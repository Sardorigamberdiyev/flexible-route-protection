"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const express_1 = require("express");
const http_error_class_1 = require("../errors/http-error.class");
class BaseController {
    constructor(log) {
        this.log = log;
        this.router = (0, express_1.Router)();
    }
    attachRoutes(routes, prefix) {
        for (const route of routes) {
            const { path, method, description, middlewares, controller, } = route;
            const possiblyPathWithPrefix = (prefix ? `/${prefix}` : '') + path;
            const middlewareHandlers = middlewares.map((m) => m.handler.bind(m));
            this.log.info(`[${method.toUpperCase()}]: ${possiblyPathWithPrefix} (${description || ''}, ПО: ${middlewareHandlers.length})`);
            this.router[method](possiblyPathWithPrefix, middlewareHandlers, this.cbTryCatch(controller.bind(this)));
        }
    }
    cbTryCatch(controller) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield controller(req, res, next);
            }
            catch (e) {
                if (e instanceof http_error_class_1.HttpError) {
                    next(e);
                }
                else {
                    if (e instanceof Error)
                        this.log.fatal(e.message);
                    next(new http_error_class_1.HttpError('Что то пошло нетак', 500));
                }
            }
        });
    }
}
exports.BaseController = BaseController;
