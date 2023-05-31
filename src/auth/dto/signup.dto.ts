import { IsString, MinLength, IsEmail } from 'class-validator';

export class SignupDto {
    @IsString()
    @MinLength(2)
    firstName: string;

    @IsString()
    @MinLength(2)
    lastName: string;
    
    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @MinLength(6)
    confirmPassword: string;

    @IsString()
    @MinLength(4)
    phone: string;

    @IsString()
    @MinLength(3)
    username: string;

    @IsEmail()
    email: string;
}