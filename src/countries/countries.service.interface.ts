import { BaseQueryDto } from '../common/base.query.dto';
import { ICountryModel } from './country.model.interface';
import { CreateCountryDto } from './dto/create-country.dto';

export interface ICountriesService {
    createCountry(dto: CreateCountryDto): Promise<ICountryModel>;
    getCountries(dto: BaseQueryDto): Promise<{count: number, list: ICountryModel[]}>;
    getCountry(id: number): Promise<ICountryModel | null>;
}