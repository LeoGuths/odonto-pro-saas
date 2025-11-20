'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

const formSchema = z.object({
  description: z
    .string()
    .min(1, { message: 'A descrição do lembrete é obrigatória' }),
});

type FormSchema = z.infer<typeof formSchema>;

export async function createReminder(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    };
  }

  const session = await auth();

  if (!session.userId) {
    return {
      error: 'Falha ao criar lembrete',
    };
  }

  try {
    await prisma.reminder.create({
      data: {
        userId: session.userId,
        description: schema.data.description,
      },
    });

    revalidatePath('/dashboard');

    return {
      data: 'Lembrete criado com sucesso!',
    };
  } catch (error) {
    return {
      error: 'Ocorreu um erro ao criar o lembrete.',
    };
  }
}
