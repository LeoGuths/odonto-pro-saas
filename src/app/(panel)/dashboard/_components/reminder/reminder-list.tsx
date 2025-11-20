'use client';

import { Reminder } from '@/generated/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { deleteReminder } from '@/app/(panel)/dashboard/_actions/delete-reminder';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ReminderContent } from '@/app/(panel)/dashboard/_components/reminder/reminder-content';
import { useState } from 'react';

interface ReminderListProps {
  reminders: Reminder[];
}

async function handleDeleteReminder(id: string) {
  const response = await deleteReminder({ reminderId: id });

  if (response.error) {
    toast.error(response.error);
    return;
  }

  toast.success(response.data);
}

export function ReminderList({ reminders }: ReminderListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl md:text-2xl font-semibold">
            Lembretes
          </CardTitle>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-9 p-0">
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Novo lembrete</DialogTitle>
                <DialogDescription>
                  Criar um novo lembrete para sua lista.
                </DialogDescription>
              </DialogHeader>

              <ReminderContent closeDialog={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {reminders.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              Nenhum lembrete encontrado...
            </p>
          )}

          <ScrollArea className="h-[340px] lg:max-h-[calc(100vh - 15rem)] pr-0 w-full flex-1">
            {reminders.map(reminder => (
              <article
                key={reminder.id}
                className="flex flex-wrap flex-row items-center justify-between py-2 px-2 bg-yellow-100 mb-2 rounded-md"
              >
                <p className="text-sm lg:text-base">{reminder.description}</p>

                <Button
                  className="bg-red-500 hover:bg-red-400 shadow-none rounded-full p-2"
                  size="sm"
                  onClick={() => handleDeleteReminder(reminder.id)}
                >
                  <Trash className="w-4 h-4 text-white" />
                </Button>
              </article>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
