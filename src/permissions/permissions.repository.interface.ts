import { IPermission } from './permission.model';

export interface IPermissionsRepository {
    find(): Promise<IPermission[]>;
    findById(permissionId: number): Promise<IPermission>;
    findByRole(roleIds: number[]): Promise<IPermission[]>;
}