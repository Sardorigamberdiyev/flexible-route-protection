import { BaseQueryDto } from '../common/base.query.dto';
import { ICountryModel } from './country.model.interface';
import { CreateCountryDto } from './dto/create-country.dto';

export interface ICountriesRepository {
    create(country: CreateCountryDto): Promise<ICountryModel>;
    find(queryDto: BaseQueryDto): Promise<ICountryModel[]>;
    findById(id: number): Promise<ICountryModel | null>;
    delete(id: number): Promise<ICountryModel | null>;
    count(): Promise<number>;
}