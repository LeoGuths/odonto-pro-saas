'use server';

import { Service } from 'effect/Effect';
import prisma from '@/lib/prisma';

export async function getAllServices({ userId }: { userId: string }) {
  if (!userId) {
    return {
      error: 'Falha ao buscar serviços',
    };
  }

  try {
    const services = await prisma.service.findMany({
      where: {
        userId,
        status: true,
      },
    });

    return {
      data: services,
    };
  } catch (error) {
    return {
      error: 'Falha ao buscar serviços',
    };
  }
}
