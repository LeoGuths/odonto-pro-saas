'use server';

import prisma from '@/lib/prisma';

export async function getTimesClinic({ userId }: { userId: string }) {
  if (!userId) {
    return {
      times: [],
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        times: true,
      },
    });

    if (!user) {
      return {
        times: [],
      };
    }

    return {
      times: user.times,
    };
  } catch (error) {
    return {
      times: [],
    };
  }
}
