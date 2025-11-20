'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProfileAvatar(avatarUrl: string) {
  if (!avatarUrl) {
    return {
      error: 'Falha ao atualizar a imagem.',
    };
  }

  const session = await auth();

  if (!session || !session.user.id) {
    return {
      error: 'Usuário não encontrado.',
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: avatarUrl,
      },
    });

    revalidatePath('/dashboard/profile');

    return {
      data: 'Imagem atualizada com sucesso.',
    };
  } catch (error) {
    return {
      error: 'Falha ao atualizar a imagem.',
    };
  }
}
