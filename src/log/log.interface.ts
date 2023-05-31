
export interface ILog {
    warn(...arg: unknown[]): void;
    error(...arg: unknown[]): void;
    info(...arg: unknown[]): void;
    fatal(...arg: unknown[]): void;
    debug(...arg: unknown[]): void;
}