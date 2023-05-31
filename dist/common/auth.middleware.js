"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthMiddleware {
    constructor(configService) {
        this.configService = configService;
    }
    handler(req, res, next) {
        var _a;
        const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || '';
        const accessSecret = this.configService.get('ACCESS_SECRET');
        (0, jsonwebtoken_1.verify)(token, accessSecret, (err, payload) => {
            if (err || !payload || typeof payload === 'string')
                return next();
            console.log(req.user);
            next();
        });
    }
}
exports.AuthMiddleware = AuthMiddleware;
