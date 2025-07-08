import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errorHandling/ApiError';
import { JWTService } from '../services/authorization/jwt';
import { TokenValidator } from './../services/authorization/tokenValidator';
import { RoleChecker } from './../services/authorization/roleChecker';
import { UserFetcher } from '../services/authorization/userFetcher';

export class AuthMiddleware {
  static authorize(allowedRoles: string[] = []) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = TokenValidator.extractFromHeader(req.headers.authorization);
        const payload = JWTService.verifyToken(token);
        const user = await UserFetcher.getUserById(payload.id);
        RoleChecker.ensureHasAccess(user.role, allowedRoles);

        (req as any).user = user;
        next();
      } catch (error: any) {
        next(new ApiError(error.message || 'حدث خطأ ما', error.statusCode || 500));
      }
    };
  }
}
