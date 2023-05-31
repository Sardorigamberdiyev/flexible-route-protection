import { BaseQueryDto } from '../common/base.query.dto';
import { ICountriesRepository } from './countries.repository.interface';
import { ICountriesService } from './countries.service.interface';
import { CreateCountryDto } from './dto/create-country.dto';

export class CountriesService implements ICountriesService {
    constructor(private readonly countriesRepository: ICountriesRepository) {}

    public async createCountry(dto: CreateCountryDto) {
        return this.countriesRepository.create(dto);
    }

    public async getCountries(dto: BaseQueryDto) {
        const count = await this.countriesRepository.count();
        const countries = await this.countriesRepository.find(dto);
        return {
            count,
            list: countries
        }
    }

    public async getCountry(id: number) {
        return this.countriesRepository.findById(id);
    }
}