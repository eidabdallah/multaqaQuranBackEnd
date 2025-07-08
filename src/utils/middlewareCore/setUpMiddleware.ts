import { Application } from "express";
import cors from 'cors';
import SecurityMiddleware from './security';
import RateLimiterMiddleware from './rateLimiter';
import CompressionMiddleware from './compression';
import morgan from 'morgan';

export default class MiddlewareSetup {
  public static setup(app: Application): void {
    app.use(cors());
    app.use(SecurityMiddleware.helmetSecurity);
    app.use(RateLimiterMiddleware.createRateLimiter({ limit: 500 }));

    if (process.env.NODE_ENV === 'development') {
      app.use(morgan('dev'));
    }
    app.use(CompressionMiddleware.compression);
  }
}