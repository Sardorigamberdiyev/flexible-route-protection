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
exports.UsersService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const user_entity_1 = require("./user.entity");
const http_error_class_1 = require("../errors/http-error.class");
class UsersService {
    constructor(configService, usersRepository) {
        this.configService = configService;
        this.usersRepository = usersRepository;
    }
    createUser(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, roleId, confirmPassword, password, phone, username } = dto;
            if (password !== confirmPassword)
                throw new http_error_class_1.HttpError('Ваши пароли не совпадают', 422);
            const candidateByEmail = yield this.usersRepository.findOne({ email });
            if (candidateByEmail)
                throw new http_error_class_1.HttpError('email с таким названием занято!', 422);
            const candidateByUsername = yield this.usersRepository.findOne({ username });
            if (candidateByUsername)
                throw new http_error_class_1.HttpError('username с таким названием занято!', 422);
            const user = new user_entity_1.User(firstName, lastName, email, username, phone, password);
            yield user.hashPassword(12);
            const userData = user.getData();
            return this.usersRepository.create(Object.assign(Object.assign({}, userData), { roleId }));
        });
    }
    userVerification({ username, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield this.usersRepository.findOne({ username });
            if (!userData)
                return null;
            const { first_name, last_name, email, phone, password: userDataPass, username: userDataUsername, } = userData;
            const user = new user_entity_1.User(first_name, last_name, email, userDataUsername, phone, userDataPass);
            const isMatchPassword = yield user.comparePassword(password);
            if (!isMatchPassword)
                return null;
            return userData;
        });
    }
    signUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, username, role_id } = user;
            const accessSecret = this.configService.get('ACCESS_SECRET');
            return (0, jsonwebtoken_1.sign)({ email, username, role_id }, accessSecret, { expiresIn: '1h' });
        });
    }
}
exports.UsersService = UsersService;
