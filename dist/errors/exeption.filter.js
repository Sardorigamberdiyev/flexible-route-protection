"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExeptionFilter = void 0;
const http_error_class_1 = require("./http-error.class");
class ExeptionFilter {
    constructor(log) {
        this.log = log;
    }
    notFoundRouteHandler(req, res, next) {
        this.log.debug(req.path);
        next(new http_error_class_1.HttpError('Не сущ. маршрут', 404));
    }
    errorHandler(error, req, res, _) {
        const message = error.message;
        let code = 500;
        let data = null;
        if (error instanceof http_error_class_1.HttpError) {
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
exports.ExeptionFilter = ExeptionFilter;
