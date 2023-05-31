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
exports.UsersRepository = void 0;
class UsersRepository {
    constructor(db) {
        this.db = db;
    }
    ;
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, username, password, phone, roleId, } = dto;
            const columNames = '(first_name, last_name, username, phone, email, password, role_id)';
            const rowPositions = '($1, $2, $3, $4, $5, $6, $7)';
            const rowValues = [firstName, lastName, username, phone, email, password, roleId];
            const created = yield this.db.query(`insert into person ${columNames} values ${rowPositions} returning *`, rowValues);
            return created.rows[0];
        });
    }
    findOne(filter, operator = 'and') {
        return __awaiter(this, void 0, void 0, function* () {
            const filterKeys = Object.keys(filter);
            if (!filterKeys.length)
                return null;
            const where = filterKeys.reduce((prev, curr, idx) => {
                const logicOperator = filterKeys.length === idx + 1 ? '' : operator;
                return `${prev} ${curr}='${filter[curr]}' ${logicOperator}`;
            }, '');
            const singleUser = yield this.db.query(`SELECT * FROM person where ${where}`);
            return singleUser.rows[0] || null;
        });
    }
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.db.query('SELECT * FROM role INNER JOIN person ON person.role_id = role.id');
            return users.rows;
        });
    }
}
exports.UsersRepository = UsersRepository;
