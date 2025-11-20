import prisma from './prisma';
import Stripe from 'stripe';
import { Plan } from '@/generated/prisma';
import { stripe } from '@/lib/stripe';

export async function manageSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
  deleteAction = false,
  type?: Plan
) {
  const findUser = await prisma.user.findFirst({
    where: {
      stripe_customer_id: customerId,
    },
  });

  if (!findUser) {
    return Response.json(
      { error: 'Nenhuma assinatura encontrada. Informe Usuário válido' },
      { status: 400 }
    );
  }

  if (subscriptionId && deleteAction) {
    await prisma.subscription.delete({
      where: {
        id: subscriptionId,
      },
    });

    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: findUser.id,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    plan: type || 'BASIC',
  };

  if (createAction) {
    try {
      await prisma.subscription.create({
        data: subscriptionData,
      });
    } catch (error) {}

    return;
  }

  try {
    const findSubscription = await prisma.subscription.findFirst({
      where: {
        userId: findUser.id,
      },
    });

    if (!findSubscription) {
      return;
    }

    await prisma.subscription.update({
      where: {
        id: findSubscription.id,
      },
      data: {
        status: subscription.status,
        priceId: subscription.items.data[0].price.id,
      },
    });
  } catch (error) {}
}
