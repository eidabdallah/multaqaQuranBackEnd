import { CacheManager } from '../../utils/nodeCache/cache';
import { UserAttributes } from '../../interface/User/userAttributes';
import { ApiError } from '../../utils/errorHandling/ApiError';
import User from '../../Model/user.model';

export class UserFetcher {
  static async getUserById(id: number): Promise<UserAttributes> {
    const cacheKey = `user_${id}`;
    let user = CacheManager.get<UserAttributes>(cacheKey);
    if (!user) {
      const foundUser = await User.findByPk(id, {
        attributes: ['id', 'fullName', 'universityId', 'phoneNumber', 'CollegeName', 'role', 'gender', 'halaqaId'],
      });
      if (!foundUser) throw new ApiError('المستخدم غير متوفر', 404);
      user = foundUser.toJSON() as UserAttributes;
      CacheManager.set(cacheKey, user);
    }
    return user;
  }
}
