import { Request, Response, NextFunction } from 'express';
import { IExeptionFilter } from './exeption.filter.interface';
import { ILog } from '../log/log.interface';
import { HttpError } from './http-error.class';

export class ExeptionFilter implements IExeptionFilter {
    constructor(private readonly log: ILog) {}

    notFoundRouteHandler(req: Request, res: Response, next: NextFunction) {
        this.log.debug(req.path)
        next(new HttpError('Не сущ. маршрут', 404));
    }

    errorHandler(error: Error | HttpError, req: Request, res: Response, _: NextFunction): void {
        const message = error.message;
        let code = 500;
        let data = null;
        if (error instanceof HttpError) {
            code = error.code;
            data = error.data;
        }
        this.log.error(code.toString(), '|', message);
        res.status(code).json({
            message,
            code,
            data,
        });
    }
}