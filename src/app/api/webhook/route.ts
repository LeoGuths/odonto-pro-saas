import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { manageSubscription } from '@/lib/manage-subscription';
import { Plan } from '@/generated/prisma';
import { revalidatePath } from 'next/cache';

export const POST = async (request: Request) => {
  const signature = request.headers.get('stripe-signature') as string;

  if (!signature) {
    return new NextResponse('Missing signature', { status: 400 });
  }

  const body = await request.text();

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_SECRET_WEBHOOK_KEY as string
  );

  switch (event.type) {
    case 'customer.subscription.deleted':
      const payment = event.data.object as Stripe.Subscription;

      await manageSubscription(
        payment.id,
        payment.customer as string,
        false,
        true
      );

      break;
    case 'customer.subscription.updated':
      const paymentIntent = event.data.object as Stripe.Subscription;

      await manageSubscription(
        paymentIntent.id,
        paymentIntent.customer as string
      );

      break;
    case 'checkout.session.completed':
      const checkoutSession = event.data.object as Stripe.Checkout.Session;

      const type = (checkoutSession.metadata?.type as Plan) || 'BASIC';

      if (!checkoutSession.subscription || !checkoutSession.customer) {
        return;
      }

      await manageSubscription(
        checkoutSession.subscription as string,
        checkoutSession.customer as string,
        true,
        false,
        type
      );

      break;
    default:
      return NextResponse.json({ received: true }, { status: 200 });
  }

  revalidatePath('/dashboard/plans');

  return NextResponse.json({ received: true }, { status: 200 });
};
