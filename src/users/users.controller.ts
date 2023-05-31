import { Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { IUsersController } from './users.controller.interface';
import { ILog } from '../log/log.interface';
import { IUsersService } from './users.service.interface';
import { HttpError } from '../errors/http-error.class';
import { AuthGuard } from '../auth/auth.guard';
import { AuthPermission } from '../auth/auth.permission';
import { BannedDto } from './dto/banned.dto';
import { ValidateMiddleware } from '../common/validate.middleware';

export class UsersController extends BaseController implements IUsersController {

    constructor(
        log: ILog, 
        private readonly usersService: IUsersService
    ) {
        super(log);
        this.attachRoutes([
            {
                path: '/',
                method: 'get',
                description: 'Получение список пользователей',
                middlewares: [new AuthGuard(), new AuthPermission(['super_admin', 'admin'], 'read')],
                controller: this.getUsers,
            },
            {
                path:'/profile',
                method: 'get',
                description: 'Получить профиль',
                middlewares: [new AuthGuard()],
                controller: this.getProfile
            },
            {
                path: '/:id',
                method: 'get',
                description: 'Получение пользователя по иденцификатору',
                middlewares: [new AuthGuard()],
                controller: this.getUser
            },
            {
                path: '/banned',
                method: 'patch',
                description: 'Изменение значение поле is_banned',
                middlewares: [new ValidateMiddleware(BannedDto), new AuthGuard(), new AuthPermission(['super_admin'], 'update')],
                controller: this.userBanned
            }
        ], 'users');
    }

    public async getUsers(req: Request, res: Response) {
        const users = await this.usersService.getUserList();
        this.ok(res, users);
    }

    public async getUser(req: Request<{id: string}>, res: Response) {
        const user = await this.usersService.getUserItem(+req.params.id);
        if (!user)
            throw new HttpError('Не сущ. такой пользователь', 404);
        this.ok(res, user);
    }

    public async getProfile(req: Request, res: Response) {
        const profile = await this.usersService.getProfile(req.user.id);
        if (!profile)
            throw new HttpError('Не сущ. такой пользователь', 404);
        this.ok(res, profile);
    }

    public async userBanned(req: Request<{}, any, BannedDto>, res: Response) {
        const updateUser = await this.usersService.updateFieldIsBanned(req.body);
        if (!updateUser)
            throw new HttpError('Не сущ. такой пользователь', 404);
        this.ok(res, updateUser);
    }
}