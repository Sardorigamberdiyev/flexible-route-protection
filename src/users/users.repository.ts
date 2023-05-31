import { IDatabaseService } from '../database/database.service.interface';
import { SignupDto } from '../auth/dto/signup.dto';
import { IUserModel } from './user.model.interface';
import { IUsersRepository } from './users.repository.interface';

export class UsersRepository implements IUsersRepository {
    constructor(private readonly db: IDatabaseService) {};

    public async create(dto: SignupDto) {
        const {
            firstName,
            lastName,
            email,
            username,
            password,
            phone,
        } = dto;
        const queryText = `
        INSERT INTO person (first_name, last_name, username, phone, email, password)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`;
        const created = await this.db.query<IUserModel>(queryText, [firstName, lastName, username, phone, email, password]);
        return created.rows[0];
    }

    public async findOne(filter: Pick<IUserModel, 'email' | 'id' | 'username'>, operator: 'or' | 'and' = 'and') {
        const filterKeys = Object.keys(filter);

        if (!filterKeys.length)
            return null;

        const where = filterKeys.reduce(
            (prev, curr, idx) => {
                const logicOperator = filterKeys.length === idx + 1 ? '' : operator;
                return  `${prev} ${curr}='${filter[curr as keyof typeof filter]}' ${logicOperator}`;
            }, 
            ''
        );
        const queryText = `
        SELECT *
        FROM person 
        WHERE ${where}`;
        const singleUser = await this.db.query<IUserModel>(queryText);
        return singleUser.rows[0] || null;
    }

    public async find() {
        const queryText = `
        SELECT id, first_name, last_name, email, phone, username
        FROM person
        ORDER BY id ASC`;
        const users = await this.db.query<IUserModel>(queryText);
        return users.rows;
    }

    public async findById(id: number) {
        const queryText = `
        SELECT id, first_name, last_name, email, phone, password, is_baned
        FROM person
        WHERE id=$1`;
        const user = await this.db.query<IUserModel>(queryText, [id]);
        return user.rows[0] || null;
    }

    public async updateById(id: number, data: Partial<Omit<IUserModel, 'id'>>) {
        const updateDataKeys = Object.keys(data)
        const setData = updateDataKeys.reduce((prev, curr, currIdx) => {
            const isLastLength = currIdx === updateDataKeys.length - 1;
            return `${prev} ${curr}=${data[curr as keyof typeof data]}${!isLastLength ? ',' : ''}`;
        }, '');
        const queryText = `
        UPDATE person
        SET ${setData}
        WHERE id=$1
        RETURNING *`;
        console.log(queryText);
        const result = await this.db.query<IUserModel>(queryText, [id]);
        return result.rows[0] || null;
    }
}