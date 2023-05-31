"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateMiddleware = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const http_error_class_1 = require("../errors/http-error.class");
class ValidateMiddleware {
    constructor(classToValidate, isPlainQuery = false) {
        this.classToValidate = classToValidate;
        this.isPlainQuery = isPlainQuery;
    }
    handler({ body, query }, res, next) {
        const plain = this.isPlainQuery ? query : body;
        const instance = (0, class_transformer_1.plainToClass)(this.classToValidate, plain);
        (0, class_validator_1.validate)(instance)
            .then((errors) => {
            if (errors.length > 0) {
                const errorsData = errors.reduce((prev, curr) => (Object.assign(Object.assign({}, prev), { [curr.property]: curr.constraints })), {});
                next(new http_error_class_1.HttpError('Вы не прошли валидацию', 422, errorsData));
            }
            else {
                next();
            }
        });
    }
}
exports.ValidateMiddleware = ValidateMiddleware;
