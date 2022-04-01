import { IsString, IsEmail, Length } from 'class-validator';

export class CreateBookDTO {
  @IsString()
  name: string;

  @IsString()
  shortDescription: string;
}
