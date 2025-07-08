import { Request, Response, NextFunction } from "express";
export default class NotFoundMiddleware {
    static notFound(req: Request, res: Response, next: NextFunction) {
        return res.status(404).json({
            error: 'Not Found',
            message: `Route ${req.originalUrl} not found`
        });
    }
}
