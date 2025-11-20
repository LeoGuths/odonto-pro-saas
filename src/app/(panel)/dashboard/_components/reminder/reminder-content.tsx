'use client';

import {
  ReminderFormData,
  useReminderForm,
} from '@/app/(panel)/dashboard/_components/reminder/reminder-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { createReminder } from '@/app/(panel)/dashboard/_actions/create-reminder';

interface ReminderContentProps {
  closeDialog: () => void;
}

export function ReminderContent({ closeDialog }: ReminderContentProps) {
  const form = useReminderForm();

  async function onSubmit(formData: ReminderFormData) {
    const response = await createReminder({
      description: formData.description,
    });

    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success(response.data);
    form.reset();
    closeDialog();
  }

  return (
    <div className="grid gap-4 py-4">
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  Descrição do lembrete*
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Digite a descrição do lembrete..."
                    className="max-h-52 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={!form.watch('description')}>
            Criar lembrete
          </Button>
        </form>
      </Form>
    </div>
  );
}
