import { Type } from 'class-transformer';
import { IsInt, IsPositive, Min, Max, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PaginationParamsDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(50)
  limit: number;
  

  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  term?: string;
}
