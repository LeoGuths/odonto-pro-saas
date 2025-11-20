import ServicesContent from '@/app/(panel)/dashboard/services/_components/services-content';
import getSession from '@/lib/getSession';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';

export default async function Services() {
  const session = await getSession();

  if (!session) {
    redirect('/');
  }

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ServicesContent userId={session.userId} />
    </Suspense>
  );
}
