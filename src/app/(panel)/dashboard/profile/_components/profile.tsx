'use client';

import {
  ProfileFormData,
  useProfileForm,
} from '@/app/(panel)/dashboard/profile/_components/profile-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { cn, extractPhoneNumber, formatPhone } from '@/lib/utils';
import { Prisma } from '@/generated/prisma/client';
import { updateProfile } from '@/app/(panel)/dashboard/profile/_actions/update-profile';
import { toast } from 'sonner';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ProfileAvatar } from '@/app/(panel)/dashboard/profile/_components/profile-avatar';

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true;
  };
}>;

interface ProfileContentProps {
  user: UserWithSubscription;
}

export function ProfileContent({ user }: ProfileContentProps) {
  const router = useRouter();
  const [selectedHours, setSelectedHours] = useState<string[]>(
    user.times || []
  );
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const { update } = useSession();

  const form = useProfileForm({
    name: user.name,
    address: user.address,
    phone: user.phone,
    status: user.status,
    timezone: user.timeZone,
  });

  function generateTimeSlots(): string[] {
    const hours: string[] = [];

    for (let i = 6; i <= 22; i++) {
      const hour = i.toString().padStart(2, '0');
      hours.push(`${hour}:00`);
      hours.push(`${hour}:30`);
    }

    hours.pop();

    return hours;
  }

  const hours = generateTimeSlots();

  function toggleHour(hour: string) {
    setSelectedHours(prev =>
      prev.includes(hour)
        ? prev.filter(h => h !== hour)
        : [...prev, hour].sort()
    );
  }

  const timeZones = Intl.supportedValuesOf('timeZone').filter(
    zone =>
      zone.startsWith('America/Sao_Paulo') ||
      zone.startsWith('America/Fortaleza') ||
      zone.startsWith('America/Recife') ||
      zone.startsWith('America/Bahia') ||
      zone.startsWith('America/Belem') ||
      zone.startsWith('America/Manaus') ||
      zone.startsWith('America/Cuiaba') ||
      zone.startsWith('America/Boa_Vista')
  );

  async function onSubmit(values: ProfileFormData) {
    const response = await updateProfile({
      name: values.name,
      address: values.address,
      status: values.status === 'active',
      timeZone: values.timeZone,
      phone: values.phone ? extractPhoneNumber(values.phone) : values.phone,
      times: selectedHours || [],
    });

    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success(response.data);
  }

  async function handleLogout() {
    await signOut();
    await update();
    router.replace('/');
  }

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <ProfileAvatar avatarUrl={user.image} userId={user.id} />
              </div>

              <div className="space-y-4">
                <p className="mb-4">
                  <small className="text-sm text-muted-foreground">
                    Campos marcados com <span className="text-red-500">*</span>{' '}
                    são obrigatórios.
                  </small>
                </p>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Nome Completo*
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o nome da clínica..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Endereço completo
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o endereço da clínica..."
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
                          placeholder="(99) 98888-7777"
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Status da clínica
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ? 'active' : 'inactive'}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status da clínica" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">
                              ATIVO (clínica aberta)
                            </SelectItem>
                            <SelectItem value="inactive">
                              INATIVO (clínica fechada)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label className="font-semibold">
                    Configurar horários da clínica
                  </Label>

                  <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                    <DialogTrigger asChild className="w-full">
                      <Button
                        variant="outline"
                        className="w-full h-10 inline-flex items-center justify-between px-3"
                      >
                        <span>
                          Clique aqui para visualizar e selecionar horários
                        </span>
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Horários da clínica</DialogTitle>
                        <DialogDescription>
                          Selecione abaixo os horários de funcionamento da
                          clínica
                        </DialogDescription>
                      </DialogHeader>

                      <section className="py-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Clique nos horários abaixo para marcar ou desmarcar:
                        </p>

                        <div className="grid grid-cols-5 gap-2">
                          {hours.map(hour => (
                            <Button
                              key={hour}
                              variant="outline"
                              className={cn(
                                'h-10',
                                selectedHours.includes(hour) &&
                                  'border-2 border-emerald-500 text-primary'
                              )}
                              onClick={() => toggleHour(hour)}
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                      </section>

                      <Button
                        className="w-full"
                        onClick={() => setDialogIsOpen(false)}
                      >
                        Confirmar
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>

                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Selecione o fuso horário*
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione seu fuso horário" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeZones.map(timeZone => (
                              <SelectItem key={timeZone} value={timeZone}>
                                {timeZone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400"
                >
                  Salvar alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      <section className="mt-4">
        <Button variant="destructive" onClick={handleLogout}>
          Sair da conta
        </Button>
      </section>
    </div>
  );
}
