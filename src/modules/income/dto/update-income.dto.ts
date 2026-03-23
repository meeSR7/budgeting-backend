// import { PartialType } from '@nestjs/mapped-types';
// import { CreateIncomeDto } from './create-income.dto';
// export class UpdateIncomeDto extends PartialType(CreateIncomeDto) {}

export class UpdateIncomeDto {
  amount?: number;
  source?: string;
  date?: Date;
  note?: string;
}
