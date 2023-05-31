import { IsString, Length } from 'class-validator';

export class CreateCountryDto {
    @IsString()
    @Length(2)
    nameRu: string;

    @IsString()
    @Length(2)
    nameUz: string;

    @IsString()
    @Length(2)
    nameOz: string;
}