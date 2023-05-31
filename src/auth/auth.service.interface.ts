import { IPermission } from '../permissions/permission.model';
import { IRole } from '../roles/role.model';
import { IUserModel } from '../users/user.model.interface';
import { SigninDto } from './dto/signin.dto';

export interface IAuthService {
    userVerification(dto: SigninDto): Promise<IUserModel | null>;
    generateToken(user: IUserModel): Promise<string>;
    permissionCheck(userId: number, roles: IRole['keyword'][], permissions: IPermission['keyword']): Promise<boolean>;
    isBanedCheck(userId: number): Promise<boolean>;
}