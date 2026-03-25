import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'dashboard',
  version: '1',
})
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  // Add date range query parameters to filter results
  getSummary(
    @GetUser('id') userId: string,
    @Query() query?: DashboardQueryDto,
  ) {
    return this.dashboardService.getSummary(userId, query?.from, query?.to);
  }

  @Get('category-breakdown')
  getCategoryBreakdown(
    @GetUser('id') userId: string,
    @Query() query?: DashboardQueryDto,
  ) {
    return this.dashboardService.getCategoryBreakdown(userId, query?.from, query?.to);
  }

  @Get('monthly-trends')
  getMonthlyTrends(
    @GetUser('id') userId: string,
    @Query() query?: DashboardQueryDto, 
  ) {
    return this.dashboardService.getMonthlyTrends(userId, query?.from, query?.to);
  }
}
