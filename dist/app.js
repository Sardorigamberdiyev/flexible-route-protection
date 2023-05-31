"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const exeption_filter_1 = require("./errors/exeption.filter");
const auth_middleware_1 = require("./common/auth.middleware");
class App {
    constructor(configService, log, controllerList) {
        this.configService = configService;
        this.log = log;
        this.controllerList = controllerList;
        this.app = (0, express_1.default)();
    }
    useGlobalMiddlewares() {
        const authMiddleware = new auth_middleware_1.AuthMiddleware(this.configService);
        this.app.use((0, body_parser_1.json)());
        this.app.use(authMiddleware.handler.bind(authMiddleware));
    }
    useRoutes() {
        for (const controller of this.controllerList) {
            this.app.use('/api', controller.router);
        }
    }
    useExeption() {
        const exeptionFilter = new exeption_filter_1.ExeptionFilter(this.log);
        this.app.use(exeptionFilter.notFoundRouteHandler.bind(exeptionFilter));
        this.app.use(exeptionFilter.errorHandler.bind(exeptionFilter));
    }
    start() {
        const PORT = this.configService.get('PORT');
        this.app.listen(PORT, () => (this.log.info('Сервер на порту', PORT)));
    }
    init() {
        this.useGlobalMiddlewares();
        this.useRoutes();
        this.useExeption();
        this.start();
    }
}
exports.App = App;
