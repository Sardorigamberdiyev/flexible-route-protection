import { Pool } from 'pg';
import { IConfigService } from '../config/config.service.interface';
import { IDatabaseService } from './database.service.interface';

export class DatabaseService implements IDatabaseService {
    private static instance: DatabaseService;
    private  pool: Pool;

    private constructor(configService: IConfigService) {
        this.pool = new Pool({
            user: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            host: configService.get('DB_HOST'),
            port: +configService.get('DB_PORT'),
            database: configService.get('DB_NAME')
        });
    }

    public async query(queryText: string, values?: any[]) {
        return this.pool.query(queryText, values);
    }

    public static getInstance(configService: IConfigService) {
        return this.instance || new DatabaseService(configService);
    }
}