import { subscriptionPlans } from '@/lib/plans';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SubscriptionButton } from '@/app/(panel)/dashboard/plans/_components/subscription-button';
import { Plan } from '@/generated/prisma';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Info } from 'lucide-react';

export function GridPlans() {
  return (
    <div className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-900">
          <span className="font-semibold">Ambiente de testes:</span> Para testar
          a assinatura, use o cartão{' '}
          <span className="inline-flex items-center gap-1 font-mono font-semibold bg-blue-100 px-2 py-0.5 rounded">
            <CreditCard className="h-3 w-3" />
            4242 4242 4242 4242
          </span>{' '}
          com qualquer CVV e data futura.
        </AlertDescription>
      </Alert>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {subscriptionPlans.map((plan, index) => (
          <div key={plan.id} className="relative">
            {index === 1 && (
              <div className="absolute top-0 left-0 right-0 bg-emerald-500 py-3 text-center rounded-t-lg z-10">
                <p className="text-white font-semibold">PROMOÇÃO EXCLUSIVA</p>
              </div>
            )}

            <Card
              className={`flex flex-col w-full mx-auto ${
                index === 1 ? 'border-emerald-500 pt-14' : ''
              }`}
            >
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {plan.name}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <ul>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-sm md:text-base">
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <p className="text-gray-600 line-through">{plan.oldPrice}</p>
                  <p className="text-2xl text-black font-bold">{plan.price}</p>
                </div>
              </CardContent>

              <CardFooter>
                <SubscriptionButton type={plan.id as Plan} />
              </CardFooter>
            </Card>
          </div>
        ))}
      </section>
    </div>
  );
}
