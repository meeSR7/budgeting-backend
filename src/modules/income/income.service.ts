import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IncomeService {
  constructor(private prisma: PrismaService) {}

  create(createIncomeDto: CreateIncomeDto, userId: string) {
    return this.prisma.income.create({
      data: { ...createIncomeDto, userId },
    });
  }

  findAll(userId: string) {
    return this.prisma.income.findMany({
      where: { userId },  
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {

    const income = await this.prisma.income.findFirst({
      where: { id, userId },
    })
    if (!income) {
      throw new NotFoundException('Income not found');
    }
    return income;
  }

  async update(id: string, updateIncomeDto: UpdateIncomeDto, userId: string) {
    const income = await this.prisma.income.findFirst({
      where: { id, userId },
    });
    if (!income) {
      throw new NotFoundException('Income not found');
    }

    return this.prisma.income.update({
      where: { id },
      data: updateIncomeDto,
    });
  }

  async remove(id: string, userId: string) {
    const income = await this.prisma.income.findFirst({
      where: { id, userId },
    });
    if (!income) {
      throw new NotFoundException('Income not found');
    }

    return this.prisma.income.delete({
      where: { id },
    });
  }
}
