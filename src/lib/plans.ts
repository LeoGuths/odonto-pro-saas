export type PlanDetailsProps = {
  maxServices: number;
};

export type PlansProps = {
  BASIC: PlanDetailsProps;
  PROFESSIONAL: PlanDetailsProps;
};

export const PLANS: PlansProps = {
  BASIC: {
    maxServices: 3,
  },
  PROFESSIONAL: {
    maxServices: 50,
  },
};

export const subscriptionPlans = [
  {
    id: 'BASIC',
    name: 'Basic',
    description: 'Perfeito para clínicas pequenas',
    oldPrice: 'R$ 57,90',
    price: 'R$ 27,90',
    features: [
      `Até ${PLANS['BASIC'].maxServices} serviços`,
      'Agendamentos ilimitados',
      'Suporte em horário comercial',
      'Relatórios',
    ],
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional',
    description: 'Ideal para clínicas grandes',
    oldPrice: 'R$ 117,90',
    price: 'R$ 67,90',
    features: [
      `Até ${PLANS['PROFESSIONAL'].maxServices} serviços`,
      'Agendamentos ilimitados',
      'Suporte 24h',
      'Relatórios avançados',
    ],
  },
];
