import { IsBoolean, IsNumberString } from 'class-validator';

export class BannedDto {
    @IsNumberString()
    userId: number;

    @IsBoolean()
    isBanned: boolean;
}