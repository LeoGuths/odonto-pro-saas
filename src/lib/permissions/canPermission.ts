'use server';

import { Plan } from '@/generated/prisma';
import { auth } from '@/lib/auth';
import { PlanDetailInfo } from '@/lib/permissions/get-plans';
import prisma from '@/lib/prisma';
import { canCreateService } from '@/lib/permissions/canCreateService';

export type PLAN_PROP = 'BASIC' | 'PROFESSIONAL' | 'EXPIRED' | 'TRIAL';

interface CanPermissionProps {
  type: 'service';
}

export interface ResultPermissionProps {
  hasPermission: boolean;
  planId: PLAN_PROP;
  expired: boolean;
  plan: PlanDetailInfo | null;
}

export async function canPermission({
  type,
}: CanPermissionProps): Promise<ResultPermissionProps> {
  const session = await auth();

  if (!session || !session.user.id) {
    return {
      hasPermission: false,
      planId: 'EXPIRED',
      expired: true,
      plan: null,
    };
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  switch (type) {
    case 'service':
      return await canCreateService(subscription, session);
    default:
      return {
        hasPermission: false,
        planId: 'EXPIRED',
        expired: true,
        plan: null,
      };
  }
}
