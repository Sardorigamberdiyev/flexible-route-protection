import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '../common/middleware.interface';
import { HttpError } from '../errors/http-error.class';
import { DatabaseService } from '../database/database.service';
import { ConfigService } from '../config/config.service';
import { UsersRepository } from '../users/users.repository';
import { RolesRepository } from '../roles/roles.repository';
import { PermissionsRepository } from '../permissions/permissions.repository';
import { IAuthService } from './auth.service.interface';
import { AuthService } from './auth.service';

export class AuthGuard implements IMiddleware {
    private readonly authService: IAuthService;

    constructor() {
        const config = ConfigService.getInstance();
        const db = DatabaseService.getInstance(config);
        const usersRepository = new UsersRepository(db);
        const rolesRepository = new RolesRepository(db);
        const permissionRepository = new PermissionsRepository(db);
        this.authService = new AuthService(config, usersRepository, rolesRepository, permissionRepository);
    }

    async handler(req: Request, res: Response, next: NextFunction) {
        if (!req.user)
            return next(new HttpError('Вы не авторизованы', 401));

        const isBaned = await this.authService.isBanedCheck(req.user.id);
        if (isBaned)
            return next(new HttpError('Вы получили бан', 400));

        next();
    }
}