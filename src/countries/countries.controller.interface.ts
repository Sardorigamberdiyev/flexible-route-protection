import { NextFunction, Request, Response } from 'express';

export interface ICountriesController {
    createCountry(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCountries(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCountry(req: Request, res: Response, next: NextFunction): Promise<void>;
}