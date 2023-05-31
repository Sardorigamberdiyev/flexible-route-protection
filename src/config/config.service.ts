import { IConfigService } from './config.service.interface';
import { config, DotenvParseOutput } from 'dotenv';

export class ConfigService implements IConfigService {
    private static instance: ConfigService;
    private parsed: DotenvParseOutput;

    private constructor() {
        const { parsed, error } = config();

        if (error || !parsed)
            throw new Error('Не удалось загрузить файл .env')

        this.parsed = parsed;
    }

    public get(key: string) {
        const result = this.parsed[key];

        if (result === undefined)
            throw new Error(`Нет такой значение по ключу ${key}`);

        return result;
    }

    public static getInstance() {
        return this.instance || new ConfigService();
    }
}