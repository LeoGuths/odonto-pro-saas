'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

const formSchema = z.object({
  appointmentId: z.string().min(1, {
    message: 'Vocẽ precisa fornececer o identificador do agendamento',
  }),
});

type FormSchema = z.infer<typeof formSchema>;

export async function cancelAppointment(formData: FormSchema) {
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
    await prisma.appointment.delete({
      where: {
        id: schema.data.appointmentId,
        userId: session.userId,
      },
    });

    revalidatePath('/dashboard');

    return {
      data: 'Agendamento cancelado com sucesso!',
    };
  } catch (error) {
    return {
      error: 'Ocorreu um erro ao cancelar o agendamento.',
    };
  }
}
