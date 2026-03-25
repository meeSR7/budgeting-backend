import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryBreakdown, MonthlyTrend } from './types/dashboard.types';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  private buildDateFilter(from?: string, to?: string) {
    if (from && to) {
      return {
        createdAt: {
          gte: new Date(from),
          lte: new Date(to + 'T23:59:59.999Z'), // Include the entire 'to' day
        },
      };
    }
    return {};
  }

  private getAllMonths(from: string, to: string): string[] {
    const months: string[] = [];

    const start = new Date(from);
    const end = new Date(to);

    while (start <= end) {
      const month = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`; // Format as YYYY-MM
      months.push(month);
      start.setMonth(start.getMonth() + 1);
    }
    return months;
  }

  async getSummary(userId: string, from?: string, to?: string) {
    // Add date range parameters

    const dateFilter = this.buildDateFilter(from, to);
    const [income, expenses] = await Promise.all([
      // Fetch total income and expenses in parallel
      this.prisma.income.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          userId,
          ...dateFilter,
        },
      }),
      this.prisma.expense.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          userId,
          ...dateFilter,
        },
      }),
    ]);

    // Calculate balance
    const totalIncome = income._sum.amount || 0; // Handle null case
    const totalExpenses = expenses._sum.amount || 0;
    const balance = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      balance,
    };
  }

  async getCategoryBreakdown(
    userId: string,
    from?: string,
    to?: string,
  ): Promise<CategoryBreakdown[]> {
    const dateFilter = this.buildDateFilter(from, to);
    const expensesByCategory = await this.prisma.expense.groupBy({
      by: ['category'],
      _sum: {
        amount: true,
      },
      where: {
        userId,
        ...dateFilter,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
    });

    return expensesByCategory.map((item) => ({
      category: item.category,
      total: item._sum.amount || 0, // Handle null case
    }));
  }

  async getMonthlyTrends(
    userId: string,
    from?: string,
    to?: string,
  ): Promise<MonthlyTrend[]> {
    const dateFilter = this.buildDateFilter(from, to);

    // Fetch monthly income and expenses in parallel
    const [incomes, expenses] = await Promise.all([
      this.prisma.income.findMany({
        where: {
          userId,
          ...dateFilter,
        },
        select: {
          amount: true,
          createdAt: true,
        },
      }),
      this.prisma.expense.findMany({
        where: {
          userId,
          ...dateFilter,
        },
      }),
    ]);

    //helper to format month as YYYY-MM (local time function to avoid timezone issues)
    const formatMonth = (date: Date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    };

    // Aggregate income and expenses by month
    const monthlyIncome: Record<string, number> = {}; // Use Record type for better type safety
    const monthlyExpenses: Record<string, number> = {};

    incomes.forEach((income) => {
      const month = formatMonth(income.createdAt);
      monthlyIncome[month] = (monthlyIncome[month] || 0) + income.amount;
    });

    expenses.forEach((expense) => {
      const month = formatMonth(expense.createdAt);
      monthlyExpenses[month] = (monthlyExpenses[month] || 0) + expense.amount;
    });

    // Combine results into a single array

    let allMonths: string[];
    if (from && to) {
      allMonths = this.getAllMonths(from, to);
    } else {
      allMonths = [
        ...new Set([
          ...Object.keys(monthlyIncome),
          ...Object.keys(monthlyExpenses),
        ]),
      ];
    }

    const trends = Array.from(allMonths)
      .map((month) => ({
        month,
        income: monthlyIncome[month] || 0,
        expenses: monthlyExpenses[month] || 0,
      }))
      .sort((a, b) => a.month.localeCompare(b.month)); // Sort by month

    return trends;
  }
}
