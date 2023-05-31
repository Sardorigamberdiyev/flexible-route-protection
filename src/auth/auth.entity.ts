import { compare } from 'bcrypt';

export class Auth {
    private hashPassword: string;

    constructor(hashPassword: string) {
        this.hashPassword = hashPassword;
    }

    public async comparePassword(password: string): Promise<boolean> {
        return compare(password, this.hashPassword);
    }
}