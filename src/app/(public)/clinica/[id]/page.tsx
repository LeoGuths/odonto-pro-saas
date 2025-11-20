import { getInfoClinic } from '@/app/(public)/clinica/[id]/_data-access/get-info-clinic';
import { redirect } from 'next/navigation';
import { ScheduleContent } from '@/app/(public)/clinica/[id]/_components/schedule-content';

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = (await params).id;
  const user = await getInfoClinic({ userId });

  if (!user) {
    redirect('/');
  }

  return <ScheduleContent clinicDetails={user} />;
}
