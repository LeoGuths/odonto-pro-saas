'use server';

import { Session } from 'next-auth';
import { addDays, isAfter } from 'date-fns';
import { ResultPermissionProps } from '@/lib/permissions/canPermission';
import { TRIAL_DAYS } from '@/lib/permissions/trial-limits';

export async function checkSubscriptionExpired(
  session: Session
): Promise<ResultPermissionProps> {
  const trialAndDate = addDays(session?.user?.createdAt!, TRIAL_DAYS);

  if (isAfter(new Date(), trialAndDate)) {
    return {
      hasPermission: false,
      planId: 'EXPIRED',
      expired: true,
      plan: null,
    };
  }

  return {
    hasPermission: true,
    planId: 'TRIAL',
    expired: false,
    plan: null,
  };
}
