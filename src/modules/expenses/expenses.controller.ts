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
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'expenses',
  version: '1',
})
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(
    @Body() createExpenseDto: CreateExpenseDto,
    @GetUser('userId') userId: string,
  ) {
    return this.expensesService.create(createExpenseDto, userId);
  }

  @Get()
  findAll(@GetUser('userId') userId: string) {
    return this.expensesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.expensesService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @GetUser('userId') userId: string,
  ) {
    return this.expensesService.update(id, updateExpenseDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.expensesService.remove(id, userId);
  }
}
