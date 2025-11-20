'use client';

import { Subscription } from '@/generated/prisma';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { subscriptionPlans } from '@/lib/plans';
import { Button } from '@/components/ui/button';
import { createCustomerPortal } from '@/app/(panel)/dashboard/plans/_actions/create-customer-portal';
import { toast } from 'sonner';

interface SubscriptionDetailProps {
  subscription: Subscription;
}
export function SubscriptionDetail({ subscription }: SubscriptionDetailProps) {
  const subscriptionInfo = subscriptionPlans.find(
    plan => plan.id === subscription.plan
  );

  async function handleManageSubscription() {
    const result = await createCustomerPortal();

    if (result.error) {
      toast.error(result.error);
      return;
    }

    window.location.href = result.url;
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Seu Plano Atual</CardTitle>
        <CardDescription>Sua assinatura está ativa!</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg md:text-xl">
            {subscription.plan}
          </h3>

          <div className="bg-green-500 text-white w-fit px-4 py-1 rounded-md">
            {subscription.status === 'active' ? 'Ativo' : 'Inativo'}
          </div>
        </div>

        <ul className="list-disc list-inside space-y-2 text-gray-500">
          {subscriptionInfo &&
            subscriptionInfo.features.map(feature => (
              <li key={feature} className="mb-2">
                {feature}
              </li>
            ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button onClick={handleManageSubscription}>Gerenciar assinatura</Button>
      </CardFooter>
    </Card>
  );
}
