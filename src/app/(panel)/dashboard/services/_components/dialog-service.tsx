import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DialogServiceFormData,
  useDialogServiceForm,
  UseDialogServiceProps,
} from '@/app/(panel)/dashboard/services/_components/dialog-service-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { convertRealToCents } from '@/lib/utils';
import { createNewService } from '@/app/(panel)/dashboard/services/_actions/create-service';
import { toast } from 'sonner';
import { updateService } from '@/app/(panel)/dashboard/services/_actions/update-service';

interface DialogServiceProps extends UseDialogServiceProps {
  closeModal: () => void;
  serviceId?: string;
}

export function DialogService({
  closeModal,
  serviceId,
  initialValues,
}: DialogServiceProps) {
  const form = useDialogServiceForm({ initialValues });
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: DialogServiceFormData) {
    setIsLoading(true);

    const priceInCents = convertRealToCents(values.price);
    const hours = parseInt(values.hours) || 0;
    const minutes = parseInt(values.minutes) || 0;
    const duration = hours * 60 + minutes;

    if (serviceId) {
      await editServiceById({
        serviceId,
        name: values.name,
        priceInCents,
        duration,
      });

      setIsLoading(false);
      return;
    }

    const response = await createNewService({
      name: values.name,
      price: priceInCents,
      duration,
    });

    setIsLoading(false);

    if (response.error) {
      toast.error(response.error);
      return;
    }

    handleCloseModal();
    toast.success('Serviço cadastrado com sucesso!');
  }

  async function editServiceById({
    serviceId,
    name,
    priceInCents,
    duration,
  }: {
    serviceId: string;
    name: string;
    priceInCents: number;
    duration: number;
  }) {
    const response = await updateService({
      serviceId,
      name,
      price: priceInCents,
      duration,
    });

    setIsLoading(false);

    if (response.error) {
      toast.error(response.error);
      return;
    }

    handleCloseModal();
    toast.success(response.data);
  }

  function handleCloseModal() {
    form.reset();
    closeModal();
  }

  function changeCurrency(event: React.ChangeEvent<HTMLInputElement>) {
    let { value } = event.target;
    value = value.replace(/\D/g, '');

    if (value) {
      value = (parseInt(value, 10) / 100).toFixed(2);
      value = value.replace('.', ',');
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    event.target.value = value;
    form.setValue('price', value);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {serviceId ? 'Atualizar Serviço' : 'Novo Serviço'}
        </DialogTitle>
        <DialogDescription>
          {serviceId ? 'Atualize seu serviço' : 'Adicione um novo serviço'}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">
                    Nome do serviço
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Digite o nome do serviço..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">
                    Valor do serviço
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: 120,99"
                      onChange={changeCurrency}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <p className="font-semibold">Tempo de duração do serviço</p>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Horas</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: 2"
                      min="0"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minutes"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Minutos</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: 30"
                      min="0"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            className="w-full font-semibold text-white"
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? 'Carregando...'
              : `${serviceId ? 'Salvar' : 'Adicionar serviço'}`}
          </Button>
        </form>
      </Form>
    </>
  );
}
