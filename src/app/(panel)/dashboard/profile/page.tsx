import getSession from '@/lib/getSession';
import { getInfoUser } from '@/app/(panel)/dashboard/profile/_data-access/get-info-user';
import { redirect } from 'next/navigation';
import { ProfileContent } from '@/app/(panel)/dashboard/profile/_components/profile';

export default async function Profile() {
  const session = await getSession();

  if (!session) {
    redirect('/');
  }

  const user = await getInfoUser({ userId: session.userId });

  if (!user) {
    redirect('/');
  }

  return <ProfileContent user={user} />;
}
