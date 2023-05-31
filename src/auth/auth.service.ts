import { sign } from 'jsonwebtoken';
import { Auth } from './auth.entity';
import { IAuthService } from './auth.service.interface';
import { IConfigService } from '../config/config.service.interface';
import { IUserModel } from '../users/user.model.interface';
import { IUsersRepository } from '../users/users.repository.interface';
import { SigninDto } from './dto/signin.dto';
import { IRolesRepository } from '../roles/roles.repository.interface';
import { IPermissionsRepository } from '../permissions/permissions.repository.interface';
import { IRole } from '../roles/role.model';
import { IPermission } from '../permissions/permission.model';

export class AuthService implements IAuthService {
    constructor(
        private readonly configService: IConfigService,
        private readonly usersRepository: IUsersRepository,
        private readonly rolesRepository: IRolesRepository,
        private readonly permissionsRepository: IPermissionsRepository
    ) {}

    public async permissionCheck(userId: number, roles: IRole['keyword'][], permission: IPermission['keyword']) {
        const userRoles = await this.rolesRepository.findByUser(userId);
        console.log('userRoles', userRoles);
        const userKeywords = userRoles.map((r) => r.keyword);
        const isRolesMatch = roles.reduce(
            (prev, curr) => (
                userKeywords.includes(curr) || prev
            ), false
        );
        if (!isRolesMatch)
            return false;
        const roleIds = userRoles.map((r) => r.id);
        const userPermissions = await this.permissionsRepository.findByRole(roleIds);
        console.log('userPermissions', userPermissions);
        return userPermissions.map((p) => p.keyword).includes(permission);
    }

    public async userVerification({username, password}: SigninDto) {
        const userData = await this.usersRepository.findOne({username});

        if (!userData)
            return null;

        const auth = new Auth(userData.password);
        const isMatchPassword = await auth.comparePassword(password);
        
        if (!isMatchPassword)
            return null;

        return userData;
    }

    public async isBanedCheck(userId: number) {
        const user = await this.usersRepository.findById(userId);
        return user ? user.is_baned : true;
    }

    public async generateToken(user: IUserModel) {
        const { id, email, username } = user;
        const accessSecret = this.configService.get('ACCESS_SECRET');
        return sign({ id, email, username }, accessSecret, { expiresIn: '1h' });
    }
    
}