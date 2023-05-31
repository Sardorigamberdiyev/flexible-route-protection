import { IBaseModel } from '../common/base.model.interface';

export interface IUserModel extends IBaseModel {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    is_baned: boolean;
    is_deleted: boolean;
}