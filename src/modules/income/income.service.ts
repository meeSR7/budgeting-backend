import { Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IncomeService {
  constructor(private prisma: PrismaService) {}

  create(createIncomeDto: CreateIncomeDto) {
    return this.prisma.income.create({
      data: { ...createIncomeDto, userId: 'dummy-user-1' },
    });
  }

  findAll() {
    return this.prisma.income.findMany({
      orderBy: { amount: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.income.findUnique({
      where: { id },
    });
  }

  update(id: string, updateIncomeDto: UpdateIncomeDto) {
    return this.prisma.income.update({
      where: { id },
      data: updateIncomeDto,
    });
  }

  remove(id: string) {
    return this.prisma.income.delete({
      where: { id },
    });
  }
}
