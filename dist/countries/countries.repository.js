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
exports.CountriesRepository = void 0;
class CountriesRepository {
    constructor(db) {
        this.db = db;
    }
    create(country) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nameUz, nameOz, nameRu, } = country;
            const countriesOne = yield this.db.query('INSERT INTO country (name_uz, name_oz, name_ru) VALUES ($1, $2, $3) RETURNING *', [nameUz, nameOz, nameRu]);
            return countriesOne.rows[0];
        });
    }
    find(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = +dto.limit < 1000 ? +dto.limit : 1000;
            const offset = +dto.skip;
            const countries = yield this.db.query('select * from country limit $1 offset $2', [limit, offset * limit]);
            return countries.rows;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const country = yield this.db.query('select * from country where id = $1', [id]);
            if (!country.rowCount)
                return null;
            return country.rows[0];
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            const countriesCount = yield this.db.query('select count(*) from country');
            return +countriesCount.rows[0].count;
        });
    }
}
exports.CountriesRepository = CountriesRepository;
