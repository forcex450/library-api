import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  username: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @Length(5, 25)
  password: string;
}
