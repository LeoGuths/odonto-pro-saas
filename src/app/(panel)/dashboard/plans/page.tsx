import getSession from '@/lib/getSession';
import { GridPlans } from '@/app/(panel)/dashboard/plans/_components/grid-plans';
import { getSubscription } from '@/lib/get-subscription';
import { redirect } from 'next/navigation';
import { SubscriptionDetail } from '@/app/(panel)/dashboard/plans/_components/subscription-detail';

export default async function Plans() {
  const session = await getSession();

  if (!session) {
    redirect('/');
  }

  const subscription = await getSubscription({ userId: session.userId });

  return (
    <div>
      {subscription?.status !== 'active' && <GridPlans />}

      {subscription?.status === 'active' && (
        <SubscriptionDetail subscription={subscription} />
      )}
    </div>
  );
}
