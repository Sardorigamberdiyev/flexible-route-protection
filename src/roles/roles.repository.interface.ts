import { IRole } from './role.model';

export interface IRolesRepository {
    find(): Promise<IRole[]>;
    findById(roleId: number): Promise<IRole | null>;
    findByUser(userId: number): Promise<IRole[]>;
}