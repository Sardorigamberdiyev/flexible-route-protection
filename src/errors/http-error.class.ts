
export class HttpError extends Error {
    public code: number;
    public data: unknown;
    constructor(message: string, code: number, data: unknown = null) {
        super(message);
        this.code = code;
        this.data = data;
    }
}