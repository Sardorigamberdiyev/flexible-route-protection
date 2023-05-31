import { Request, Response, NextFunction } from 'express';

export interface IExeptionFilter {
    notFoundRouteHandler(req: Request, res: Response, next: NextFunction): void;
    errorHandler(error: Error, req: Request, res: Response, next: NextFunction): void;
}