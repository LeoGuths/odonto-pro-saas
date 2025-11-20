'use server';

import { Subscription } from '@/generated/prisma';
import { Session } from 'next-auth';
import prisma from '@/lib/prisma';
import { getPlan } from '@/lib/permissions/get-plans';
import { PLANS } from '@/lib/plans';
import { checkSubscriptionExpired } from '@/lib/permissions/checkSubscriptionExpired';
import { ResultPermissionProps } from '@/lib/permissions/canPermission';

export async function canCreateService(
  subscription: Subscription | null,
  session: Session
): Promise<ResultPermissionProps> {
  try {
    const serviceCount = await prisma.service.count({
      where: {
        userId: session.user.id,
      },
    });

    if (subscription && subscription.status === 'active') {
      const plan = subscription.plan;
      const planLimits = await getPlan(plan);

      return {
        hasPermission:
          planLimits.maxServices === null ||
          serviceCount <= planLimits.maxServices,
        planId: subscription.plan,
        expired: false,
        plan: PLANS[subscription.plan],
      };
    }

    return await checkSubscriptionExpired(session);
  } catch (error) {
    return {
      hasPermission: false,
      planId: 'EXPIRED',
      expired: true,
      plan: null,
    };
  }
}
