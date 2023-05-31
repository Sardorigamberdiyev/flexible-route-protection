import { IDatabaseService } from '../database/database.service.interface';
import { IRole } from './role.model';
import { IRolesRepository } from './roles.repository.interface';

export class RolesRepository implements IRolesRepository {
    constructor(private readonly db: IDatabaseService) {}

    public async find() {
        const queryText = `SELECT * FROM role`;
        const result = await this.db.query<IRole>(queryText);
        return result.rows;
    }

    public async findById(roleId: number) {
        const queryText = `
        SELECT *
        FROM role
        WHERE id=$1`;
        const result = await this.db.query<IRole>(queryText, [roleId]);
        return result.rows[0] || null;
    }

    public async findByUser(userId: number) {
        const queryText = `
        SELECT r.id, r.keyword, r.description
        FROM role r
        INNER JOIN role_person rp ON rp.role_id=r.id
        WHERE rp.person_id=$1
        ORDER BY r.description ASC`;
        const result = await this.db.query<IRole>(queryText, [userId]);
        return result.rows;
    }
}