'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  reminderId: z
    .string()
    .min(1, { message: 'O identificador do lembrete é obrigatório' }),
});

type FormSchema = z.infer<typeof formSchema>;

export async function deleteReminder(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    };
  }

  try {
    await prisma.reminder.delete({
      where: {
        id: schema.data.reminderId,
      },
    });

    revalidatePath('/dashboard');

    return {
      data: 'Lembrete removido com sucesso.',
    };
  } catch (error) {
    return {
      error: 'Ocorreu um erro ao deletar o lembrete.',
    };
  }
}
