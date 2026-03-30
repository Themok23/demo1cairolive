import { Crown, Shield, Award, Star } from 'lucide-react';

interface TierBadgeProps {
  tier: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const tierConfig: Record<string, {
  icon: typeof Crown;
  bg: string;
  text: string;
  border: string;
  label: string;
}> = {
  platinum: {
    icon: Crown,
    bg: 'bg-gradient-to-br from-slate-200 to-slate-400',
    text: 'text-slate-900',
    border: 'border-slate-300/50',
    label: 'Platinum',
  },
  gold: {
    icon: Shield,
    bg: 'bg-gradient-to-br from-amber-400 to-yellow-500',
    text: 'text-amber-950',
    border: 'border-amber-400/50',
    label: 'Gold',
  },
  silver: {
    icon: Award,
    bg: 'bg-gradient-to-br from-gray-300 to-gray-400',
    text: 'text-gray-800',
    border: 'border-gray-400/50',
    label: 'Silver',
  },
  bronze: {
    icon: Star,
    bg: 'bg-gradient-to-br from-orange-500 to-orange-700',
    text: 'text-orange-50',
    border: 'border-orange-600/50',
    label: 'Bronze',
  },
};

const sizes = {
  sm: { wrapper: 'w-7 h-7', icon: 12 },
  md: { wrapper: 'w-9 h-9', icon: 16 },
  lg: { wrapper: 'w-11 h-11', icon: 20 },
};

export default function TierBadge({ tier, size = 'md', className = '' }: TierBadgeProps) {
  const config = tierConfig[tier?.toLowerCase()];
  if (!config) return null;

  const IconComponent = config.icon;
  const s = sizes[size];

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-full
        ${s.wrapper} ${config.bg} ${config.border} border
        shadow-sm ${className}
      `}
      title={config.label}
      aria-label={`${config.label} tier`}
    >
      <IconComponent size={s.icon} className={config.text} strokeWidth={2.5} />
    </div>
  );
}
