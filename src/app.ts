import express, { Express } from 'express';
import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { ILog } from './log/log.interface';
import { ExeptionFilter } from './errors/exeption.filter';
import { BaseController } from './common/base.controller';
import { AuthMiddleware } from './auth/auth.middleware';
import { IDatabaseService } from './database/database.service.interface';

export class App {
    private app: Express;

    constructor(
        private readonly configService: IConfigService,
        private readonly log: ILog,
        private readonly controllerList: BaseController[]
    ) {
        this.app = express();
    }

    private useGlobalMiddlewares() {
        const authMiddleware = new AuthMiddleware(this.configService);
        this.app.use(json());
        this.app.use(authMiddleware.handler.bind(authMiddleware));
    }

    private useRoutes() {
        for (const controller of this.controllerList) {
            this.app.use('/api', controller.router);
        }
    }

    private useExeption() {
        const exeptionFilter = new ExeptionFilter(this.log);
        this.app.use(exeptionFilter.notFoundRouteHandler.bind(exeptionFilter));
        this.app.use(exeptionFilter.errorHandler.bind(exeptionFilter));
    }

    private async start() {
        const PORT = this.configService.get('PORT');
        this.app.listen(PORT, () => (
            this.log.info('Сервер на порту', PORT)
        ));
    }

    public init() {
        this.useGlobalMiddlewares();
        this.useRoutes();
        this.useExeption();
        this.start();
    }
}