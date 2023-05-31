import { Request, Response, NextFunction } from 'express';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { IMiddleware } from './middleware.interface';
import { HttpError } from '../errors/http-error.class';

export class ValidateMiddleware implements IMiddleware {
    constructor(private classToValidate: ClassConstructor<object>, private isPlainQuery: boolean = false) {}

    handler({ body, query }: Request, res: Response, next: NextFunction): void {
        const plain = this.isPlainQuery ? query : body;
        const instance = plainToClass(this.classToValidate, plain);
        validate(instance)
        .then((errors) => {
            if (errors.length > 0) {
                const errorsData = errors.reduce(
                    (prev, curr) => ({
                        ...prev,
                        [curr.property]: curr.constraints
                    }), {}
                );
                next(new HttpError('Вы не прошли валидацию', 422, errorsData));
            } else {
                next();
            }
        });
    }
}