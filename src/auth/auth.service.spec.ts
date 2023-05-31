import { hash } from 'bcrypt';
import { jest } from '@jest/globals';
import { IConfigService } from '../config/config.service.interface';
import { IPermissionsRepository } from '../permissions/permissions.repository.interface';
import { IRolesRepository } from '../roles/roles.repository.interface';
import { IUsersRepository } from '../users/users.repository.interface';
import { AuthService } from './auth.service';
import { IAuthService } from './auth.service.interface';
import { SigninDto } from './dto/signin.dto';
import { IUserModel } from '../users/user.model.interface';

const configServiceMock: IConfigService = {
    get: jest.fn<IConfigService['get']>()
};

const usersRepositoryMock: IUsersRepository = {
    create: jest.fn<IUsersRepository['create']>(),
    find: jest.fn<IUsersRepository['find']>(),
    findById: jest.fn<IUsersRepository['findById']>(),
    findOne: jest.fn<IUsersRepository['findOne']>(),
    updateById: jest.fn<IUsersRepository['updateById']>()
};

const permissionRepositoryMock: IPermissionsRepository = {
    find: jest.fn<IPermissionsRepository['find']>(),
    findById: jest.fn<IPermissionsRepository['findById']>(),
    findByRole: jest
    .fn<IPermissionsRepository['findByRole']>()
    .mockResolvedValue([{keyword: 'create', description: 'Добавить', id: 1}])
};

const rolesRepositoryMock: IRolesRepository = {
    find: jest.fn<IRolesRepository['find']>(),
    findById: jest.fn<IRolesRepository['findById']>(),
    findByUser: jest
    .fn<IRolesRepository['findByUser']>()
    .mockResolvedValue([{keyword: 'admin', description: 'Админ', id: 1}])
};

const authService: IAuthService = new AuthService(configServiceMock, usersRepositoryMock, rolesRepositoryMock, permissionRepositoryMock);

const signDto: SigninDto = {
    username: 'isardor7',
    password: '123456'
};

let userData: IUserModel;

beforeAll(async () => {
    const hashPassword = await hash('123456', 12);
    userData = {
        id: 1,
        first_name: 'Sardor',
        last_name: 'Igamberdiyev',
        email: 'sardor@gmail.com',
        username: 'isardor',
        password: hashPassword,
        is_baned: false,
        is_deleted: false,
        phone: '+998901743414',
    };
})

describe('Auth service', () => {
    it('userVerification - login is incorrect', async () => {
        usersRepositoryMock.findOne = jest
        .fn<IUsersRepository['findOne']>()
        .mockResolvedValueOnce(null);
        const isVerification = await authService.userVerification(signDto);
        expect(isVerification).toEqual(null);
    });
    it('userVerification - password is incorrect', async () => {
        usersRepositoryMock.findOne = jest
        .fn<IUsersRepository['findOne']>()
        .mockResolvedValueOnce(userData);
        const isVerification = await authService.userVerification({username: 'isardor7', password: '1231233'});
        expect(isVerification).toEqual(null);
    });
    it('userVerification - success', async () => {
        usersRepositoryMock.findOne = jest
        .fn<IUsersRepository['findOne']>()
        .mockResolvedValueOnce(userData);
        const isVerification = await authService.userVerification({username: 'isardor7', password: '123456'});
        expect(isVerification).not.toEqual(null);
    });

    it('permissionCheck - role fail forbidden', async () => {
        const isMatchPermission = await authService.permissionCheck(1, ['super_admin'], 'delete');
        expect(isMatchPermission).toBeFalsy();
    });
    it('permissionCheck - permission fail forbidden', async () => {
        const isMatchPermission = await authService.permissionCheck(1, ['admin'], 'delete');
        expect(isMatchPermission).toBeFalsy();
    });
    it('permissionCheck - success', async () => {
        const isMatchPermission = await authService.permissionCheck(1, ['admin', 'super_admin'], 'create');
        expect(isMatchPermission).toBeTruthy();
    });
});