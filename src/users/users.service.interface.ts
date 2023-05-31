import { SignupDto } from '../auth/dto/signup.dto';
import { BannedDto } from './dto/banned.dto';
import { IUserModel } from './user.model.interface';

export interface IUsersService {
    createUser(dto: SignupDto): Promise<IUserModel>;
    getProfile(id: number): Promise<IUserModel | null>;
    getUserList(): Promise<IUserModel[]>;
    getUserItem(id: number): Promise<IUserModel | null>;
    updateFieldIsBanned(dto: BannedDto): Promise<IUserModel | null>;
}