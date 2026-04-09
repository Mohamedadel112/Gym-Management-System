import { Controller, Get, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { PrismaService } from './prisma.service.ts';

@Controller('gym')
export class GymController {
  constructor(private prisma: PrismaService) {}

  @Get('classes')
  async getClasses() {
    return this.prisma.class.findMany({
      include: { _count: { select: { bookings: true } } },
    });
  }

  @Post('book/:classId')
  async bookClass(@Param('classId') classId: string, @Body() body: any) {
    // In a real app, we'd get userId from JWT
    const userId = body.userId; 
    return this.prisma.booking.create({
      data: {
        userId,
        classId,
      },
    });
  }

  @Get('membership/:userId')
  async getMembership(@Param('userId') userId: string) {
    return this.prisma.membership.findUnique({
      where: { userId },
    });
  }
}
