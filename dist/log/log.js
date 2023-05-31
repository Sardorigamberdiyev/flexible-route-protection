"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const tslog_1 = require("tslog");
class Log {
    constructor() {
        this.logger = new tslog_1.Logger({
            prettyLogTimeZone: 'local',
            hideLogPositionForProduction: true,
        });
    }
    warn(...msg) {
        this.logger.warn(...msg);
    }
    error(...msg) {
        this.logger.error(...msg);
    }
    info(...msg) {
        this.logger.info(...msg);
    }
    fatal(...msg) {
        this.logger.fatal(...msg);
    }
    debug(...arg) {
        this.logger.debug(...arg);
    }
}
exports.Log = Log;
