import { IsString, IsEmail, Length } from 'class-validator';

export class CreateBookDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  author: string;
}
