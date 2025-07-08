import { ApiError } from './../../utils/errorHandling/ApiError';
export class RoleChecker {
  static ensureHasAccess(userRole: string, allowedRoles: string[]) {
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      throw new ApiError('لا يوجد صلاحيات', 403);
    }
  }
}