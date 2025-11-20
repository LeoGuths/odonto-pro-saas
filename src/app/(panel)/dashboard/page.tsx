import Link from 'next/link';
import getSession from '@/lib/getSession';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { ButtonCopyLink } from '@/app/(panel)/dashboard/_components/button-copy-link';
import { Reminders } from '@/app/(panel)/dashboard/_components/reminder/reminders';
import { Appointments } from '@/app/(panel)/dashboard/_components/appointments/appointments';
import { redirect } from 'next/navigation';
import { checkSubscription } from '@/lib/permissions/checkSubscription';
import LabelSubscription from '@/components/label-subscription';

export default async function Dashboard() {
  const session = await getSession();

  if (!session || !session.user) {
    redirect('/');
  }

  const subscription = await checkSubscription(session.user.id);

  return (
    <main>
      {subscription.subscriptionStatus === 'EXPIRED' && (
        <LabelSubscription expired={true} />
      )}

      {subscription.subscriptionStatus === 'TRIAL' && (
        <div className="bg-green-500 text-white text-sm md:text-base px-3 py-2 rounded-md my-2">
          <p className="font-semibold">{subscription.message}</p>
        </div>
      )}

      {subscription.subscriptionStatus !== 'EXPIRED' && (
        <>
          <div className="space-x-2 flex items-center justify-end">
            <Link href={`/clinica/${session.userId}`} target="_blank">
              <Button className="bg-emerald-500 hover:bg-emerald-400 flex-1 md:flex-[0]">
                <Calendar className="w-5 h-5" />
                <span>Novo agendamento</span>
              </Button>
            </Link>

            <ButtonCopyLink userId={session.userId} />
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <Appointments userId={session.userId} />

            <Reminders userId={session.userId} />
          </section>
        </>
      )}
    </main>
  );
}
