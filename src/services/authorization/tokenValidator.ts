import { ApiError } from './../../utils/errorHandling/ApiError';
export class TokenValidator {
  static extractFromHeader(authHeader?: string): string {
    if (!authHeader?.startsWith(process.env.BEARERKEY as string)) {
      throw new ApiError('التوكن غير متوفر', 401);
    }
    return authHeader.replace(process.env.BEARERKEY as string, '').trim();
  }
}