import { IsString, Length } from 'class-validator';

export class RemoveBorrowDTO {
  @IsString()
  star: string;
}
