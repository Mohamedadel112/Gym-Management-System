import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma.service.ts';
import { RolesGuard, Roles } from '../../server.ts';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get('stats')
  @Roles('ADMIN')
  async getStats() {
    const totalUsers = await this.prisma.user.count();
    const activeMemberships = await this.prisma.membership.count({
      where: { status: 'ACTIVE' },
    });
    const totalBookings = await this.prisma.booking.count();
    
    // Revenue mock
    const revenue = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'SUCCESS' },
    });

    return {
      totalUsers,
      activeMemberships,
      totalBookings,
      revenue: revenue._sum.amount || 0,
    };
  }

  @Get('users')
  async getUsers() {
    return this.prisma.user.findMany({
      include: { membership: true },
    });
  }
}
