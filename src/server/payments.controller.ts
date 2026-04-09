import { Controller, Post, Body, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service.ts';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-session')
  async createSession(@Body() body: any) {
    return this.paymentsService.createCheckoutSession(body.userId, body.plan);
  }

  @Post('webhook')
  async webhook(@Req() req: any, @Body() body: any) {
    const sig = req.headers['stripe-signature'];
    return this.paymentsService.handleWebhook(req.rawBody, sig);
  }
}
