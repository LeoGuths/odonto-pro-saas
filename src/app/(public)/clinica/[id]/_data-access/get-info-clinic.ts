'use server';

import prisma from '@/lib/prisma';

export async function getInfoClinic({ userId }: { userId: string }) {
  try {
    if (!userId) {
      return null;
    }

    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
        services: {
          where: {
            status: true,
          },
        },
      },
    });
  } catch (err) {
    return null;
  }
}
