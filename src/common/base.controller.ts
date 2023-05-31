import { Router, Request, Response, NextFunction } from 'express';
import { DatabaseError } from 'pg';
import { IRoute } from './route.interface';
import { ILog } from '../log/log.interface';
import { HttpError } from '../errors/http-error.class';

export abstract class BaseController {
    public router: Router;

    constructor(protected readonly log: ILog) {
        this.router = Router();
    }

    protected attachRoutes(routes: IRoute[], prefix?: string) {
        for (const route of routes) {
            const {
                path,
                method,
                description,
                middlewares,
                controller,
            } = route;
            const possiblyPathWithPrefix = (prefix ? `/${prefix}` : '') + path;
            const middlewareHandlers = middlewares.map((m) => this.cbTryCatch(m.handler.bind(m)));
            this.log.info(`[${method.toUpperCase()}]: ${possiblyPathWithPrefix} (${description || ''}, ПО: ${middlewareHandlers.length})`);
            this.router[method](possiblyPathWithPrefix, middlewareHandlers, this.cbTryCatch(controller.bind(this)));
        }
    }

    public ok(res: Response, sendData: unknown) {
        this.send(res, 200, sendData);
    }

    public created(res: Response, sendData: unknown) {
        this.send(res, 201, sendData);
    }

    private send(res: Response, code: number, data: unknown) {
        res.status(code).json(data);
    }

    private cbTryCatch(controller: IRoute['controller']) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await controller(req, res, next);
            } catch (e) {
                if (e instanceof HttpError) {
                    next(e);
                } else {
                    if (e instanceof Error || e instanceof DatabaseError) 
                        this.log.fatal(e.message);
                    next(new HttpError('Что то пошло нетак', 500));
                }
            }
        }
    }
}