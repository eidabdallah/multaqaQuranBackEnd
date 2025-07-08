import { NextFunction, Request, Response } from "express";
import { ApiError } from './ApiError';

export default class ErrorMiddleware {
    static handle(err: Error, req: Request, res: Response, next: NextFunction) {
        if (err instanceof ApiError) {
            return res.status(err.statusCode).json({
                message: err.message
            });
        }
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack
        });
    }
}
