'use server';

import prisma from '@/lib/prisma';
import { TRIAL_DAYS } from '@/lib/permissions/trial-limits';
import { addDays, differenceInDays, isAfter } from 'date-fns';

export async function checkSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      subscription: true,
    },
  });

  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  if (user.subscription && user.subscription.status === 'ACTIVE') {
    return {
      subscriptionStatus: 'active',
      message: 'Você possui um plano ativo!',
    };
  }

  const trialEndDate = addDays(user.createdAt!, TRIAL_DAYS);

  if (isAfter(new Date(), trialEndDate)) {
    return {
      subscriptionStatus: 'EXPIRED',
      message: 'Seu plano expirou ou você não possui um plano ativo!',
    };
  }

  const daysRemaining = differenceInDays(trialEndDate, new Date());

  return {
    subscriptionStatus: 'TRIAL',
    message: `Você está no período de teste gratuito! Faltam ${daysRemaining} ${daysRemaining === 1 ? 'dia' : 'dias'}`,
  };
}
