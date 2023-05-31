import { IUsersRepository } from './users.repository.interface';
import { IUsersService } from './users.service.interface';
import { UsersService } from './users.service';
import { IUserModel } from './user.model.interface';
import { SignupDto } from '../auth/dto/signup.dto';

const usersRepositoryMock: IUsersRepository = {
    findById: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    updateById: jest.fn()
}

let usersService: IUsersService;

const userData: SignupDto = {
    email: 'sardor@gmail.com',
    username: 'sardor',
    phone: '+998901743414',
    firstName: 'Sardor',
    lastName: 'Igamberdiyev',
    password: '123456',
    confirmPassword: '123456',
}

beforeAll(() => {
    usersService = new UsersService(usersRepositoryMock);
});

describe('User service', () => {
    it('createUser - mismatched passwords', async () => {
        const passNotConfirmUserData: SignupDto = {
            ...userData,
            confirmPassword: '12345'
        };
        const createdUser = usersService.createUser(passNotConfirmUserData);
        await expect(createdUser).rejects.toThrow('Ваши пароли не совпадают');
    });
    it('createUser - exists with such email', async () => {
        usersRepositoryMock.findOne = jest
        .fn()
        .mockReturnValueOnce({id: 1});
        const createdUser = usersService.createUser(userData);
        await expect(createdUser).rejects.toThrow('email с таким названием занято!');
    });
    it('createUser - exists with such username', async () => {
        usersRepositoryMock.findOne = jest
        .fn()
        .mockReturnValueOnce(null)
        .mockReturnValueOnce({id: 1});
        const createdUser = usersService.createUser(userData);
        await expect(createdUser).rejects.toThrow('username с таким названием занято!');
    });
    it('createUser - success', async () => {
        usersRepositoryMock.findOne = jest
        .fn()
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(null);
        usersRepositoryMock.create = jest
        .fn()
        .mockImplementationOnce((userDto: SignupDto): IUserModel => ({
            id: 1,
            first_name: userDto.firstName,
            last_name: userDto.lastName,
            email: userDto.email,
            password: userDto.password,
            phone: userDto.phone,
            username: userDto.username,
            is_baned: false,
            is_deleted: false,
            
        }));
        const createdUser = await usersService.createUser(userData);
        expect(createdUser.password).not.toEqual('123456');
        expect(createdUser.id).toBe(1);
    });
});
