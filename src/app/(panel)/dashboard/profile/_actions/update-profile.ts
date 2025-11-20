'use server';

import { z } from 'zod';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório' }),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.boolean(),
  timeZone: z.string(),
  times: z.array(z.string()),
});

type FormSchema = z.infer<typeof formSchema>;

export async function updateProfile(formData: FormSchema) {
  const session = await auth();

  if (!session) {
    return {
      error: 'Usuário não encontrado',
    };
  }

  const schema = formSchema.safeParse(formData);

  if (!schema) {
    return {
      error: 'Preencha todos os campos!',
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: schema.data?.name,
        address: schema.data?.address,
        phone: schema.data?.phone,
        status: schema.data?.status,
        timeZone: schema.data?.timeZone,
        times: schema.data?.times || [],
      },
    });

    revalidatePath('/dashboard/profile');

    return {
      data: 'Clínica atualizada com sucesso!',
    };
  } catch (err) {
    return {
      error: 'Falha ao atualizar clínica',
    };
  }
}
