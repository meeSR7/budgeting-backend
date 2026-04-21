import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'incomes',
  version: '1',
})
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  create(
    @Body() createIncomeDto: CreateIncomeDto,
    @GetUser('userId') userId: string,
  ) {
    return this.incomeService.create(createIncomeDto, userId);
  }

  @Get()
  findAll(@GetUser('userId') userId: string) {
    return this.incomeService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.incomeService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIncomeDto: UpdateIncomeDto,
    @GetUser('userId') userId: string,
  ) {
    return this.incomeService.update(id, updateIncomeDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.incomeService.remove(id, userId);
  }
}
