import { IsOptional, IsString } from 'class-validator';

export class GetBookDTO {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  name: string;
}
