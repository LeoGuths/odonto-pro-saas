'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatorio' }),
  email: z.string().min(1, { message: 'O email é obrigatorio' }),
  phone: z.string().min(1, { message: 'O telefone é obrigatorio' }),
  date: z.date(),
  serviceId: z.string().min(1, { message: 'O serviço é obrigatorio' }),
  time: z.string().min(1, { message: 'O horario é obrigatorio' }),
  clinicId: z.string().min(1, { message: 'A clínica é obrigatorio' }),
});

type FormSchema = z.infer<typeof formSchema>;

export async function createNewAppointment(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    };
  }

  try {
    const selectedDate = new Date(schema.data.date);

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();

    const appointmentDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));

    const newAppointment = await prisma.appointment.create({
      data: {
        userId: schema.data.clinicId,
        serviceId: schema.data.serviceId,
        name: schema.data.name,
        email: schema.data.email,
        phone: schema.data.phone,
        appointmentDate: appointmentDate,
        time: schema.data.time,
      },
    });

    return {
      data: newAppointment,
    };
  } catch (err) {
    return {
      error: 'Erro ao cadastrar agendamento',
    };
  }
}
