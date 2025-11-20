'use server';

import { Plan } from '@/generated/prisma';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';

interface SubscriptionProps {
  type: Plan;
}

export async function createSubscription({ type }: SubscriptionProps) {
  const session = await auth();

  if (!session) {
    return {
      url: '',
      error: 'Falha ao ativar plano.',
    };
  }

  const findUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!findUser) {
    return {
      url: '',
      error: 'Nenhuma assinatura encontrada. Informe Usuário válido',
    };
  }

  let customerId = findUser.stripe_customer_id;

  if (!customerId) {
    const stripeCustomer = await stripe.customers.create({
      email: findUser.email,
    });

    await prisma.user.update({
      where: {
        id: findUser.id,
      },
      data: {
        stripe_customer_id: stripeCustomer.id,
      },
    });

    customerId = stripeCustomer.id;
  }

  try {
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          price:
            type === 'BASIC'
              ? process.env.STRIPE_PLAN_BASIC
              : process.env.STRIPE_PLAN_PROFESSIONAL,
          quantity: 1,
        },
      ],
      metadata: {
        type: type,
      },
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${process.env.STRIPE_SUCCESS_URL}`,
      cancel_url: `${process.env.STRIPE_CANCEL_URL}`,
    });

    return {
      url: stripeCheckoutSession.url,
    };
  } catch (error) {
    return {
      url: '',
      error: 'Falha ao ativar plano.',
    };
  }
}
