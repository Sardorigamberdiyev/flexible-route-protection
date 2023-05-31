import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '../common/middleware.interface';
import { IAuthService } from './auth.service.interface';
import { HttpError } from '../errors/http-error.class';
import { IPermission } from '../permissions/permission.model';
import { IRole } from '../roles/role.model';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { DatabaseService } from '../database/database.service';
import { ConfigService } from '../config/config.service';
import { RolesRepository } from '../roles/roles.repository';
import { PermissionsRepository } from '../permissions/permissions.repository';

export class AuthPermission implements IMiddleware {
    private readonly authService: IAuthService;
    constructor(
        private readonly roles: IRole['keyword'][],
        private readonly permission: IPermission['keyword']
    ) {
        const config = ConfigService.getInstance();
        const db = DatabaseService.getInstance(config);
        const usersRepository = new UsersRepository(db);
        const rolesRepository = new RolesRepository(db);
        const permissionRepository = new PermissionsRepository(db);
        this.authService = new AuthService(config, usersRepository, rolesRepository, permissionRepository);
    }

    public async handler(req: Request, res: Response, next: NextFunction) {
        const isMatchPermission = await this.authService.permissionCheck(req.user.id, this.roles, this.permission);
        if (isMatchPermission) next();
        else next(new HttpError('Вам нет доступа', 403));
    }
}