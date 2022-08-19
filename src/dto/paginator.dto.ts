import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatorDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  limit: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  page: string;
}
