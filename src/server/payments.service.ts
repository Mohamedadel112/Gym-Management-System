import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from './prisma.service.ts';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
      apiVersion: '2025-01-27' as any,
    });
  }

  async createCheckoutSession(userId: string, plan: string) {
    const prices = {
      BASIC: 2900, // $29.00
      PREMIUM: 5900,
      VIP: 9900,
    };

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan} Membership`,
            },
            unit_amount: (prices as any)[plan],
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.APP_URL}/dashboard?canceled=true`,
      metadata: { userId, plan },
    });

    return { url: session.url };
  }

  async handleWebhook(payload: any, sig: string) {
    let event;
    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const { userId, plan } = session.metadata;

      await this.prisma.membership.upsert({
        where: { userId },
        update: {
          type: plan,
          status: 'ACTIVE',
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
        create: {
          userId,
          type: plan,
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          price: session.amount_total / 100,
        },
      });
    }
  }
}
