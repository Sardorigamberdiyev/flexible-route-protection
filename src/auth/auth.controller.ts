import { Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { IAuthController } from './auth.controller.interface';
import { ILog } from '../log/log.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { IUsersService } from '../users/users.service.interface';
import { IAuthService } from './auth.service.interface';
import { HttpError } from '../errors/http-error.class';

export class AuthController extends BaseController implements IAuthController {

    constructor(
        log: ILog, 
        private readonly usersService: IUsersService, 
        private readonly authService: IAuthService
    ) {
        super(log);
        this.attachRoutes([
            {
                path: '/signup',
                method: 'post',
                description: 'Зарегестрироваться',
                middlewares: [new ValidateMiddleware(SignupDto)],
                controller: this.signup
            },
            {
                path: '/signin',
                method: 'post',
                description: 'Войти',
                middlewares: [new ValidateMiddleware(SigninDto)],
                controller: this.signin
            },
        ], 'auth');
    }

    public async signup(req: Request<{}, any, SignupDto>, res: Response) {
        const user = await this.usersService.createUser(req.body);
        const accessToken = await this.authService.generateToken(user);
        this.ok(res, {accessToken});
    }

    public async signin(req: Request<{}, any, SigninDto>, res: Response) {
        const user = await this.authService.userVerification(req.body);
        if (!user)
            throw new HttpError('Логин или пароль не коректны', 400);
        const accessToken = await this.authService.generateToken(user);
        this.ok(res, {accessToken})
    }
}