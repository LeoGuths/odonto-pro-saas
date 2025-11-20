'use server';

import prisma from '@/lib/prisma';

export async function getProfessionals() {
  try {
    return prisma.user.findMany({
      where: {
        status: true,
      },
      include: {
        subscription: true,
      },
    });
  } catch (err) {
    return [];
  }
}
