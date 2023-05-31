"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const dotenv_1 = require("dotenv");
class ConfigService {
    constructor() {
        const { parsed, error } = (0, dotenv_1.config)();
        if (error || !parsed)
            throw new Error('Не удалось загрузить файл .env');
        this.parsed = parsed;
    }
    get(key) {
        const result = this.parsed[key];
        if (result === undefined)
            throw new Error(`Нет такой значение по ключу ${key}`);
        return result;
    }
}
exports.ConfigService = ConfigService;
