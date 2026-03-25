// import { Type } from "class-transformer/types/decorators/type.decorator";
import { IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';

export class UpdateIncomeDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsString()
  note?: string;
}
