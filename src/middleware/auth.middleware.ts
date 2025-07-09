import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from './../utils/errorHandling/ApiError';
import User from './../Model/user.model';
import { CacheManager } from './../utils/nodeCache/cache';
import { UserAttributes } from './../interface/User/userAttributes';

export class AuthMiddleware {
  static authorize(accessRoles: string[] = []) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return next(new ApiError("التوكن غير متوفر", 401));
        }
        const token = authHeader.split(' ')[1].trim();
        let decoded: any;
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET_LOGIN as string);
        } catch (err: any) {
          if (err.name === 'TokenExpiredError') {
            return next(new ApiError("انتهت صلاحية التوكن", 401));
          }
          if (err.name === 'JsonWebTokenError') {
            return next(new ApiError("التوكن غير صالح", 401));
          }
          return next(new ApiError("خطأ في التحقق من التوكن", 500));
        }
        const cacheKey = `user_${decoded.id}`;
        let user = CacheManager.get<UserAttributes>(cacheKey);
        if (!user) {
          const userInstance = await User.findByPk(decoded.id, {
            attributes: ['id', 'fullName', 'universityId', 'phoneNumber', 'CollegeName', 'role', 'gender', 'halaqaId'],
          });
          if (!userInstance) {
            return next(new ApiError("المستخدم غير متوفر", 404));
          }
          user = userInstance.get({ plain: true }) as UserAttributes;
          CacheManager.set<UserAttributes>(cacheKey, user);
        }
        if (accessRoles.length > 0 && !accessRoles.some(role => role.toLowerCase() === user!.role.toLowerCase())) {
          return next(new ApiError("لا يوجد صلاحيات", 403));
        }
        req.user = user;
        next();
      } catch (error: any) {
        return next(new ApiError(error.message || error.stack, 500));
      }
    };
  }
}
