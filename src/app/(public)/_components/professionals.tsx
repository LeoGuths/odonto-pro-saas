import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import fotoImg from '../../../../public/foto1.png';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Prisma } from '@/generated/prisma';
import { PremiumCardBadge } from '@/app/(public)/_components/premium-badge';

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true;
  };
}>;

interface ProfessionalsProps {
  professionals: UserWithSubscription[];
}

export function Professionals({ professionals }: ProfessionalsProps) {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Clínicas disponíveis
        </h2>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {professionals.map(professional => (
            <Card
              className="overflow-hidden py-0 hover:shadow-lg duration-300"
              key={professional.id}
            >
              <CardContent className="p-0">
                <div>
                  <div className="relative w-full aspect-video bg-gray-200">
                    <Image
                      src={professional.image || fotoImg}
                      alt="Foto clínica"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {professional?.subscription?.status === 'active' && (
                      <PremiumCardBadge plan={professional.subscription.plan} />
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-4 min-h-[160px] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{professional.name}</h3>
                      <p className="text-sm text-gray-500 lineclamp-2">
                        {professional.address ?? 'Endereço não informado'}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/clinica/${professional.id}`}
                    target="_blank"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center py-2 rounded-md text-sm md:text-base font-medium"
                  >
                    Agendar horário
                    <ArrowRight className="ml-2" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </section>
  );
}
