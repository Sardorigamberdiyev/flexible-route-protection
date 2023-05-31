"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountriesController = void 0;
const base_controller_1 = require("../common/base.controller");
const create_country_dto_1 = require("./dto/create-country.dto");
const http_error_class_1 = require("../errors/http-error.class");
const validate_middleware_1 = require("../common/validate.middleware");
const base_query_dto_1 = require("../common/base.query.dto");
class CountriesController extends base_controller_1.BaseController {
    constructor(log, countriesService) {
        super(log);
        this.countriesService = countriesService;
        this.attachRoutes([
            {
                method: 'post',
                path: '/',
                description: 'Создать страну',
                middlewares: [new validate_middleware_1.ValidateMiddleware(create_country_dto_1.CreateCountryDto)],
                controller: this.createCountry,
            },
            {
                method: 'get',
                path: '/',
                description: 'Получить список стран',
                middlewares: [new validate_middleware_1.ValidateMiddleware(base_query_dto_1.BaseQueryDto, true)],
                controller: this.getCountries,
            },
            {
                method: 'get',
                path: '/:id',
                description: 'Получить страну по идентификатору',
                middlewares: [],
                controller: this.getCountry,
            }
        ], 'countries');
    }
    createCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const country = yield this.countriesService.createCountry(req.body);
            res.status(201).json(country);
        });
    }
    getCountries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const countries = yield this.countriesService.getCountries(req.query);
            res.status(200).json(countries);
        });
    }
    getCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!this.isNumberString(id))
                throw new http_error_class_1.HttpError('Динамический путь должен содержать чиловое значение', 400);
            const country = yield this.countriesService.getCountry(+id);
            if (!country)
                throw new http_error_class_1.HttpError('Не существует страна по идентификатору', 404);
            res.status(200).json(country);
        });
    }
    isNumberString(value) {
        return !!value.match(/^\d*$/);
    }
}
exports.CountriesController = CountriesController;
