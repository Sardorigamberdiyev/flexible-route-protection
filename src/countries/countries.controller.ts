import { Request, Response } from 'express';
import { ParsedQs } from 'qs';
import { BaseController } from '../common/base.controller';
import { ILog } from '../log/log.interface';
import { ICountriesController } from './countries.controller.interface';
import { CreateCountryDto } from './dto/create-country.dto';
import { ICountriesService } from './countries.service.interface';
import { HttpError } from '../errors/http-error.class';
import { ValidateMiddleware } from '../common/validate.middleware';
import { BaseQueryDto } from '../common/base.query.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthPermission } from '../auth/auth.permission';

export class CountriesController extends BaseController implements ICountriesController {
    constructor(
        log: ILog,
        private readonly countriesService: ICountriesService
    ) {
        super(log);
        this.attachRoutes([
            {
                method: 'post',
                path: '/',
                description: 'Создать страну',
                middlewares: [new ValidateMiddleware(CreateCountryDto), new AuthGuard(), new AuthPermission(['super_admin'], 'create')],
                controller: this.createCountry,
            },
            {
                method: 'get',
                path: '/',
                description: 'Получить список стран',
                middlewares: [new ValidateMiddleware(BaseQueryDto, true), new AuthGuard(), new AuthPermission(['super_admin', 'admin'], 'read')],
                controller: this.getCountries,
            },
            {
                method: 'get',
                path: '/:id',
                description: 'Получить страну по идентификатору',
                middlewares: [new AuthGuard()],
                controller: this.getCountry,
            }
        ], 'countries')
    }

    public async createCountry(req: Request<{}, any, CreateCountryDto>, res: Response) {
        const country = await this.countriesService.createCountry(req.body);
        res.status(201).json(country);
    }

    public async getCountries(req: Request<{}, any, {}, BaseQueryDto & ParsedQs>, res: Response) {
        const countries = await this.countriesService.getCountries(req.query);
        res.status(200).json(countries);
    }

    public async getCountry(req: Request<{id: string}>, res: Response) {
        const id = req.params.id;
        if (!this.isNumberString(id))
            throw new HttpError('Динамический путь должен содержать чиловое значение', 400);
        const country = await this.countriesService.getCountry(+id);
        if (!country)
            throw new HttpError('Не существует страна по идентификатору', 404);
        res.status(200).json(country);
    }

    private isNumberString(value: string): boolean {
        return !!value.match(/^\d*$/);
    }
}