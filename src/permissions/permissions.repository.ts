import { IDatabaseService } from '../database/database.service.interface';
import { IPermission } from './permission.model';
import { IPermissionsRepository } from './permissions.repository.interface';

export class PermissionsRepository implements IPermissionsRepository {
    constructor(private readonly db: IDatabaseService) {}

    public async find() {
        const queryText = `SELECT * FROM permission`;
        const result = await this.db.query<IPermission>(queryText);
        return result.rows;
    }

    public async findById(permissionId: number) {
        const queryText = `
        SELECT *
        FROM permission
        WHERE id=$1`;
        const result = await this.db.query<IPermission>(queryText, [permissionId]);
        return result.rows[0] || null;
    }

    public async findByRole(roleIds: number[]) {
        const inValues = roleIds.reduce((p, c, ci) => {
            const isLastLength = roleIds.length - 1 === ci;
            const comma = isLastLength ? '' : ',';
            return p + `${c}${comma}`;
        }, '');
        const queryText = `
        SELECT DISTINCT p.keyword, p.description, p.id
        FROM role_permission rp
        INNER JOIN permission p ON rp.permission_id=p.id
        WHERE rp.role_id IN (${inValues})
        ORDER BY p.keyword ASC`;
        const result = await this.db.query<IPermission>(queryText);
        return result.rows;
    }
    
}