import { ApiError } from '../../utils/errorHandling/ApiError';
import jwt from 'jsonwebtoken';
export class JWTService {
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET_LOGIN as string);
    } catch {
      throw new ApiError('توكن غير صالح', 401);
    }
  }
}
