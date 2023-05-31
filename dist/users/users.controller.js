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
exports.UsersController = void 0;
const base_controller_1 = require("../common/base.controller");
const signup_dto_1 = require("./dto/signup.dto");
const validate_middleware_1 = require("../common/validate.middleware");
const signin_dto_1 = require("./dto/signin.dto");
const http_error_class_1 = require("../errors/http-error.class");
class UsersController extends base_controller_1.BaseController {
    constructor(log, usersService, usersRepository) {
        super(log);
        this.usersService = usersService;
        this.usersRepository = usersRepository;
        this.attachRoutes([
            {
                path: '/',
                method: 'get',
                description: 'Получение список пользователей',
                middlewares: [],
                controller: this.getUsers,
            },
            {
                path: '/signup',
                method: 'post',
                description: 'Зарегестрироваться',
                middlewares: [new validate_middleware_1.ValidateMiddleware(signup_dto_1.SignupDto)],
                controller: this.signup
            },
            {
                path: '/signin',
                method: 'post',
                description: 'Войти',
                middlewares: [new validate_middleware_1.ValidateMiddleware(signin_dto_1.SigninDto)],
                controller: this.signin
            }
        ], 'users');
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.usersRepository.find();
            res.status(200).json(users);
        });
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.createUser(req.body);
            const accessToken = yield this.usersService.signUser(user);
            res.status(201).json({ accessToken });
        });
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.userVerification(req.body);
            if (!user)
                throw new http_error_class_1.HttpError('Имя пользователя или пароль некоректны!', 400);
            const accessToken = yield this.usersService.signUser(user);
            res.status(200).json({ accessToken });
        });
    }
}
exports.UsersController = UsersController;
