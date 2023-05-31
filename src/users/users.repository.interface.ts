import { SignupDto } from '../auth/dto/signup.dto';
import { IUserModel } from './user.model.interface';

export interface IUsersRepository {
    create(dto: Omit<SignupDto, 'confirmPassword'>): Promise<IUserModel>;
    find(): Promise<IUserModel[]>;
    findOne(filter: Partial<Pick<IUserModel, 'email' | 'id' | 'username'>>, operator?: 'or' | 'and'): Promise<IUserModel | null>;
    findById(id: number): Promise<IUserModel | null>;
    updateById(id: number, data: Partial<Omit<IUserModel, 'id'>>): Promise<IUserModel | null>;
}

export type FindByIdQuery = Omit<IUserModel, 'password'> & {role_keyword: string};