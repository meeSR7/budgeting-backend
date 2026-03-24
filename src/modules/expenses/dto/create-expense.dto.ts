import { ExpenseCategory } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExpenseDto {
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @Type(() => Date)
  @IsNotEmpty()
  // @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  note?: string;
}
