import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const userId = searchParams.get('userId');
  const dateParam = searchParams.get('date');

  if (!userId || userId === 'null' || !dateParam || dateParam === 'null') {
    return NextResponse.json(
      {
        error:
          'Nenhum agendamento encontrado. Informe o ID do Usuário e a Data',
      },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: 'Nenhum agendamento encontrado. Informe Usuário válido',
        },
        { status: 400 }
      );
    }

    const [year, month, day] = dateParam.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));

    const appointments = await prisma.appointment.findMany({
      where: {
        userId,
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        service: true,
      },
    });

    const blockedSlots = new Set<string>();

    for (const appointment of appointments) {
      const requiredSlot = Math.ceil(appointment.service.duration / 30);
      const startIndex = user.times.indexOf(appointment.time);

      if (startIndex !== -1) {
        for (let i = 0; i < requiredSlot; i++) {
          const blockedSlot = user.times[startIndex + i];
          if (blockedSlot) {
            blockedSlots.add(blockedSlot);
          }
        }
      }
    }

    return NextResponse.json(Array.from(blockedSlots));
  } catch (err) {
    return NextResponse.json(
      {
        error:
          'Nenhum agendamento encontrado. Informe o ID do Usuário e a Data',
      },
      { status: 400 }
    );
  }
}
