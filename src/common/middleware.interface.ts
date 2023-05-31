import { Request, Response, NextFunction } from 'express';

export interface IMiddleware {
    handler(req: Request, res: Response, next: NextFunction): void;
}