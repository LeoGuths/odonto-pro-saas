'use server';

import prisma from '@/lib/prisma';

export async function getSubscription({ userId }: { userId: string }) {
  if (!userId) {
    return null;
  }

  try {
    return await prisma.subscription.findFirst({
      where: {
        userId,
      },
    });
  } catch (error) {
    return null;
  }
}
