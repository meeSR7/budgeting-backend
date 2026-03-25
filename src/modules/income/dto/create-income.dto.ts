import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateIncomeDto {
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsString()
  source: string;

  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @IsOptional()
  @IsString()
  note?: string;
}
