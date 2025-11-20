import { Plan } from '@/generated/prisma';
import { Star, Zap } from 'lucide-react';

export function PremiumCardBadge({ plan }: { plan: Plan }) {
  const badges = {
    BASIC: {
      icon: <Zap className="text-white" size={20} />,
      bg: 'bg-blue-500',
    },
    PROFESSIONAL: {
      icon: <Star className="text-white" size={20} />,
      bg: 'bg-yellow-500',
    },
  };

  const badge = badges[plan];

  if (!badge) {
    return null;
  }

  return (
    <div
      className={`absolute top-2 right-2 ${badge.bg} w-12 h-12 z-[2] rounded-full flex items-center justify-center shadow-lg`}
    >
      {badge.icon}
    </div>
  );
}
