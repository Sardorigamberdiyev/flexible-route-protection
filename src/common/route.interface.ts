import { Router, Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';

export interface IRoute {
    method: keyof Pick<Router, 'get' | 'post' | 'put' | 'patch'>;
    path: string;
    description?: string;
    middlewares: IMiddleware[];
    controller(req: Request, res: Response, next: NextFunction): Promise<void> | void;
}