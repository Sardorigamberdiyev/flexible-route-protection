"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    constructor(message, code, data = null) {
        super(message);
        this.code = code;
        this.data = data;
    }
}
exports.HttpError = HttpError;
