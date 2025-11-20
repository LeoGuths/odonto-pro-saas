'use server';

import prisma from '@/lib/prisma';

interface GetUserDataProps {
  userId: string;
}

export async function getInfoUser({ userId }: GetUserDataProps) {
  try {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });
  } catch (err) {
    return null;
  }
}
