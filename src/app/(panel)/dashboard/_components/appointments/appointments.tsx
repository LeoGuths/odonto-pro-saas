import { getTimesClinic } from '@/app/(panel)/dashboard/_data-access/get-times-clinic';
import { AppointmentsList } from '@/app/(panel)/dashboard/_components/appointments/appointments-list';

export async function Appointments({ userId }: { userId: string }) {
  const userTimes = await getTimesClinic({ userId });

  return (
    <div>
      <AppointmentsList times={userTimes.times} />
    </div>
  );
}
