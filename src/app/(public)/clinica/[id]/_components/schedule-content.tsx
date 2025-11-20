'use client';

import Image from 'next/image';
import defaultClinicImg from '@/../public/default-clinic.svg';
import { MapPin } from 'lucide-react';
import { Prisma } from '@/generated/prisma';
import {
  AppointmentFormData,
  useAppointmentForm,
} from '@/app/(public)/clinica/[id]/_components/schedule-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatDuration, formatPhone } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import ScheduleTimeList from '@/app/(public)/clinica/[id]/_components/schedule-time-list';
import { createNewAppointment } from '@/app/(public)/clinica/[id]/_actions/create-appointment';
import { toast } from 'sonner';
import { DateTimePicker } from '@/components/date-picker';

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true;
    services: true;
  };
}>;

interface ScheduleContentProps {
  clinicDetails: UserWithServiceAndSubscription;
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

export function ScheduleContent({ clinicDetails }: ScheduleContentProps) {
  const form = useAppointmentForm();
  const { watch } = form;

  const selectedDate = watch('date');
  const selectedServiceId = watch('serviceId');

  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);

  const fetchBlockedTimes = useCallback(
    async (date: Date): Promise<string[]> => {
      setLoadingTimeSlots(true);

      try {
        const dateString = date.toISOString().split('T')[0];

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST_URL}/api/schedule/get-appointments?userId=${clinicDetails.id}&date=${dateString}`
        );
        const json = await response.json();
        setLoadingTimeSlots(false);

        return json;
      } catch (err) {
        setLoadingTimeSlots(false);
        return [];
      }
    },
    [clinicDetails.id]
  );

  useEffect(() => {
    if (selectedDate) {
      fetchBlockedTimes(selectedDate).then(blocked => {
        setBlockedTimes(blocked);

        const finalSlots = (clinicDetails.times || []).map(time => ({
          time,
          isAvailable: !blocked.includes(time),
        }));

        setAvailableTimeSlots(finalSlots);

        const stillAvailable = finalSlots.find(
          slot => slot.time === selectedTime && slot.isAvailable
        );

        if (!stillAvailable) {
          setSelectedTime('');
        }
      });
    }
  }, [
    selectedDate,
    // selectServiceId,
    clinicDetails.times,
    fetchBlockedTimes,
    selectedTime,
  ]);

  const onSubmit = async (formData: AppointmentFormData) => {
    if (!selectedDate) {
      return;
    }

    const response = await createNewAppointment({
      clinicId: clinicDetails.id,
      serviceId: formData.serviceId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      time: selectedTime,
    });

    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success('Agendamento feito com sucesso!');
    form.reset();
    setSelectedTime('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-32 bg-emerald-500" />

      <section className="container mx-auto px-4 -mt-16">
        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col items-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-white mb-8">
              <Image
                src={
                  clinicDetails.image ? clinicDetails.image : defaultClinicImg
                }
                alt="Foto da clínica"
                className="object-cover"
                fill
              />
            </div>

            <h1 className="text-2xl font-bold mb-2">{clinicDetails.name}</h1>
            {clinicDetails.address && (
              <div className="flex items-center gap-1">
                <MapPin className="w-5 h-5" />
                <span>{clinicDetails.address}</span>
              </div>
            )}
          </article>
        </div>
      </section>

      <section className="max-w-2xl mx-auto w-full mt-6">
        <Form {...form}>
          <form
            className="mx-2 space-y-6 bg-white p-6 border rounded-md shadow-sm"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {!clinicDetails.status && (
              <p className="px-4 py-2 text-white bg-red-500 text-center rounded-md">
                A clínica está fechada nesse momento
              </p>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Nome completo</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Digite seu nome completo..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      placeholder="Digite seu email..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Telefone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="phone"
                      placeholder="Digite somente os números"
                      onChange={e => {
                        const formattedValue = formatPhone(e.target.value);
                        field.onChange(formattedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel className="font-semibold">
                    Data do agendamento
                  </FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={date => {
                        if (date) {
                          field.onChange(date);
                          setSelectedTime('');
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Selecione o Serviço
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={value => {
                        field.onChange(value);
                        setSelectedTime('');
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinicDetails.services.map(service => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - {formatDuration(service.duration)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedServiceId && (
              <div className="space-y-2">
                <Label className="font-semibold">Horários disponíveis</Label>
                <div className="bg-gray-100 p-4 rounded-lg">
                  {loadingTimeSlots ? (
                    <p>Carregando horários...</p>
                  ) : availableTimeSlots.length === 0 ? (
                    <p>Nenhum horário disponível</p>
                  ) : (
                    <ScheduleTimeList
                      onSelectTime={time => setSelectedTime(time)}
                      clinicTimes={clinicDetails.times}
                      blockedTimes={blockedTimes}
                      availableTimeSlots={availableTimeSlots}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      requiredTimeSlots={
                        clinicDetails.services.find(
                          service => service.id === selectedServiceId
                        )
                          ? Math.ceil(
                              clinicDetails.services.find(
                                service => service.id === selectedServiceId
                              )!.duration / 30
                            )
                          : 1
                      }
                    />
                  )}
                </div>
              </div>
            )}

            {clinicDetails.status && (
              <Button
                className="w-full bg-emerald-500 hover:bg-emerald-400"
                type="submit"
                disabled={
                  !watch('name') ||
                  !watch('email') ||
                  !watch('phone') ||
                  !watch('date') ||
                  !watch('serviceId')
                }
              >
                Realizar agendamento
              </Button>
            )}
          </form>
        </Form>
      </section>
    </div>
  );
}
