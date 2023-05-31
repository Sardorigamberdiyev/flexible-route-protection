import { IsOptional, IsNumberString } from 'class-validator';

export class BaseQueryDto {
    @IsOptional()
    @IsNumberString()
    skip: string;

    @IsOptional()
    @IsNumberString()
    limit: string;
}