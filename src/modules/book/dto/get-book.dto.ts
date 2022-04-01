import { IsString } from 'class-validator';

export class GetBookDTO {
  @IsString()
  id: string;
}
