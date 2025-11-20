import { getReminders } from '@/app/(panel)/dashboard/_data-access/get-reminders';
import { ReminderList } from '@/app/(panel)/dashboard/_components/reminder/reminder-list';

export async function Reminders({ userId }: { userId: string }) {
  const reminders = await getReminders({ userId: userId });

  return (
    <div>
      <ReminderList reminders={reminders} />
    </div>
  );
}
