'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Prisma } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Eye, X } from 'lucide-react';
import { cancelAppointment } from '@/app/(panel)/dashboard/_actions/cancel-appointment';
import { toast } from 'sonner';
import { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { DialogAppointment } from '@/app/(panel)/dashboard/_components/appointments/dialog-appointment';
import { DateTimePicker } from '@/components/date-picker';

export type AppointmentWithService = Prisma.AppointmentGetPayload<{
  include: { service: true };
}>;

export function AppointmentsList({ times }: { times: string[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const date = searchParams.get('date');
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailAppointment, setDetailAppointment] =
    useState<AppointmentWithService | null>(null);

  const selectedDate = date ? new Date(date + 'T00:00:00') : new Date();

  const {
    data: appointments,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['get-appointments', date],
    queryFn: async () => {
      let activeDate = date;

      if (!activeDate) {
        activeDate = format(new Date(), 'yyyy-MM-dd');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/clinic/appointments?date=${activeDate}`
      );

      if (!response.ok) {
        return [];
      }

      return (await response.json()) as AppointmentWithService[];
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const occupantMap: Record<string, AppointmentWithService> = {};

  if (appointments && appointments.length > 0) {
    for (const appointment of appointments) {
      const requiredSlots = Math.ceil(appointment.service.duration / 30);

      const startIndex = times.indexOf(appointment.time);

      if (startIndex !== -1) {
        for (let i = 0; i < requiredSlots; i++) {
          const slotIndex = startIndex + i;

          if (slotIndex < times.length) {
            occupantMap[times[slotIndex]] = appointment;
          }
        }
      }
    }
  }

  async function handleCancelAppointment(appointmentId: string) {
    const response = await cancelAppointment({ appointmentId });

    if (response.error) {
      toast.error(response.error);
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ['get-appointments'],
    });
    await refetch();
    toast.success(response.data);
  }

  function handleDateChange(newDate: Date) {
    const formattedDate = format(newDate, 'yyyy-MM-dd');
    const params = new URLSearchParams(searchParams.toString());
    params.set('date', formattedDate);
    router.push(`?${params.toString()}`);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl md:text-2xl font-bold">
            Agendamentos
          </CardTitle>

          <DateTimePicker value={selectedDate} onChange={handleDateChange} />
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-15rem)] pr-4">
            {isLoading ? (
              <p className="text-center text-sm text-gray-500">
                Carregando agenda...
              </p>
            ) : (
              times.map(slot => {
                const occupant = occupantMap[slot];

                if (occupant) {
                  return (
                    <div
                      key={slot}
                      className="flex items-center py-2 border-t last:border-b"
                    >
                      <div className="w-16 text-sm font-semibold">{slot}</div>
                      <div className="flex-1 text-sm">
                        <div className="font-semibold">{occupant.name}</div>
                        <div className="text-sm text-gray-500">
                          {occupant.phone}
                        </div>
                      </div>

                      <div className="ml-auto">
                        <div className="flex">
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDetailAppointment(occupant)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCancelAppointment(occupant.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={slot}
                    className="flex items-center py-2 border-t last:border-b"
                  >
                    <div className="w-16 text-sm font-semibold">{slot}</div>
                    <div className="flex-1 text-sm text-gray-500">
                      Disponível
                    </div>
                  </div>
                );
              })
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <DialogAppointment appointment={detailAppointment!} />
    </Dialog>
  );
}
