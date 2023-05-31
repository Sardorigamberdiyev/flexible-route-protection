import { hash } from 'bcrypt';

export class User {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly username: string,
        public readonly phone: string,
        public password: string,
    ) {}

    public async hashPassword(salt: number) {
        this.password = await hash(this.password, salt);
    }

    public getData() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            username: this.username,
            phone: this.phone,
            password: this.password
        }
    }
}