'use server';

import prisma from '@/lib/prisma';

export async function getPermissionReports(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      subscription: true,
    },
  });

  if (!user?.subscription || user.subscription.plan !== 'PROFESSIONAL') {
    return null;
  }

  return user;
}
