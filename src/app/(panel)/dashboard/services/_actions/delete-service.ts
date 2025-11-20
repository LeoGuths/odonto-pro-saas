'use server';

import { z } from 'zod';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  serviceId: z
    .string()
    .min(1, { message: 'O identificador do serviço é obrigatório' }),
});

type FormSchema = z.infer<typeof formSchema>;

export async function deleteService(formData: FormSchema) {
  const session = await auth();

  if (!session.userId) {
    return {
      error: 'Falha ao excluir serviço',
    };
  }

  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    };
  }

  try {
    await prisma.service.update({
      where: {
        id: formData.serviceId,
        userId: session.userId,
      },
      data: {
        status: false,
      },
    });

    revalidatePath('/dashboard/services');

    return {
      data: 'Serviço excluido com sucesso',
    };
  } catch (err) {
    return {
      error: 'Falha ao deletar serviço',
    };
  }
}
