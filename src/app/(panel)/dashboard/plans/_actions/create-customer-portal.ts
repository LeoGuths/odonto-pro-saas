'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function createCustomerPortal() {
  const session = await auth();

  if (!session || !session.user.id) {
    return {
      url: '',
      error: 'Usuário não encontrado.',
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return {
      url: '',
      error: 'Usuário não encontrado.',
    };
  }

  const sessionId = user.stripe_customer_id;

  if (!sessionId) {
    return {
      url: '',
      error: 'Usuário não encontrado.',
    };
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: sessionId,
      return_url: `${process.env.STRIPE_SUCCESS_URL}`,
    });

    return {
      url: session.url,
    };
  } catch (error) {
    return {
      url: '',
      error: 'Erro ao gerenciar assinatura.',
    };
  }
}
