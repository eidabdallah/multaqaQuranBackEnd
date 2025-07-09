import { Request, Response, NextFunction } from 'express';
import { ApiError } from './ApiError';

export class AsyncHandler {
  static asyncHandler(func: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await func(req, res, next);
      } catch (error: any) {
        next(new ApiError(error.message || error.stack, 500));
      }
    };
  }
}
