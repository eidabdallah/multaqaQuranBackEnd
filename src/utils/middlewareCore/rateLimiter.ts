import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit';
import { Request, Response } from 'express';

export default class RateLimiterMiddleware {
  static createRateLimiter(options?: Partial<Parameters<typeof rateLimit>[0]>): RateLimitRequestHandler {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100000,
      keyGenerator: (req: Request) => {
        const user = (req as any).user;
        return user?.id;
      },
      handler: (req : Request, res : Response) => {
        return res.status(429).json({
          success: false,
          message: 'طلب كثير، حاول لاحقًا'
        });
      },
      ...options,
    });
  }
}
