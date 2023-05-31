import { SignupDto } from '../auth/dto/signup.dto';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { IUsersService } from './users.service.interface';
import { HttpError } from '../errors/http-error.class';
import { BannedDto } from './dto/banned.dto';

export class UsersService implements IUsersService {
    constructor(private  readonly usersRepository: IUsersRepository) {}

    public async getUserList() {
        return this.usersRepository.find();
    }

    public async getUserItem(id: number) {
        return this.usersRepository.findById(id);
    }
    
    public async getProfile(id: number) {
        return this.usersRepository.findById(id);
    }
    
    public async createUser(dto: SignupDto) {
        const { firstName, lastName, email, confirmPassword, password, phone, username } = dto;

        if (password !== confirmPassword)
            throw new HttpError('Ваши пароли не совпадают', 422);
            
        const candidateByEmail = await this.usersRepository.findOne({email});
        if (candidateByEmail)
            throw new HttpError('email с таким названием занято!', 422)

        const candidateByUsername = await this.usersRepository.findOne({username});
        if (candidateByUsername)
            throw new HttpError('username с таким названием занято!', 422);

        const user = new User(firstName, lastName, email, username, phone, password);
        await user.hashPassword(12);
        const userData = user.getData();
        return this.usersRepository.create({ ...userData });
    }

    public async updateFieldIsBanned({userId, isBanned}: BannedDto) {
        return this.usersRepository.updateById(userId, {is_baned: isBanned});
    }
}