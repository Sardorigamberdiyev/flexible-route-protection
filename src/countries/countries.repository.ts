import { BaseQueryDto } from '../common/base.query.dto';
import { IDatabaseService } from '../database/database.service.interface';
import { ICountriesRepository } from './countries.repository.interface';
import { ICountryModel } from './country.model.interface';
import { CreateCountryDto } from './dto/create-country.dto';

export class CountriesRepository implements ICountriesRepository {
    constructor(private readonly db: IDatabaseService) {}

    public async create(country: CreateCountryDto) {
        const {
            nameUz,
            nameOz,
            nameRu,
        } = country;
        const queryText = `
        INSERT INTO country (name_uz, name_oz, name_ru)
        VALUES ($1, $2, $3)
        RETURNING *`;
        const result = await this.db.query<ICountryModel>(queryText, [nameUz, nameOz, nameRu]);
        return result.rows[0];
    }

    public async find(dto: BaseQueryDto) {
        const limit = +dto.limit < 1000 ? +dto.limit : 1000;
        const offset = +dto.skip;
        const queryText = `
        SELECT *
        FROM country
        LIMIT $1
        OFFSET $2`;
        const result = await this.db.query<ICountryModel>(queryText, [limit, offset * limit]);
        return result.rows;
    }

    public async findById(id: number) {
        const queryText = `
        SELECT *
        FROM country
        WHERE id=$1`;
        const result = await this.db.query<ICountryModel>(queryText, [id]);
        return result.rows[0] || null;
    }

    public async count() {
        const queryText = `
        SELECT COUNT(*)
        FROM country`;
        const countriesCount = await this.db.query<{count: string}>(queryText);
        return +countriesCount.rows[0].count;
    }

    public async delete(id: number) {
        const queryText = `
        DELETE FROM country
        WHERE id=$1
        RETURNING *`;
        const result = await this.db.query<ICountryModel>(queryText, [id]);
        return result.rows[0] || null;
    }
}