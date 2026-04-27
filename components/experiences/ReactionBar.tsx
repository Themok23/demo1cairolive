'use client';

import { useState } from 'react';
import { Heart, MapPin, Bookmark } from 'lucide-react';

interface Props {
  experienceId: string;
  likeCount: number;
  locale: 'en' | 'ar';
}

const reactions = [
  { kind: 'like',     Icon: Heart,     labelEn: 'Like',     labelAr: 'أعجبني' },
  { kind: 'visited',  Icon: MapPin,    labelEn: 'Visited',  labelAr: 'زرتها' },
  { kind: 'wishlist', Icon: Bookmark,  labelEn: 'Wishlist', labelAr: 'أريد الزيارة' },
] as const;

export default function ReactionBar({ experienceId, likeCount, locale }: Props) {
  const isAr = locale === 'ar';
  const [active, setActive] = useState<Set<string>>(new Set());
  const [counts, setCounts] = useState<Record<string, number>>({ like: likeCount, visited: 0, wishlist: 0 });
  const [loading, setLoading] = useState<string | null>(null);

  async function toggle(kind: 'like' | 'visited' | 'wishlist') {
    if (loading) return;
    setLoading(kind);
    try {
      const res = await fetch(`/api/experiences/${experienceId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind }),
      });
      const json = await res.json();
      if (json.success) {
        setActive((prev) => {
          const next = new Set(prev);
          if (json.active) next.add(kind); else next.delete(kind);
          return next;
        });
        setCounts((prev) => ({ ...prev, [kind]: prev[kind] + (json.active ? 1 : -1) }));
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className={`flex items-center gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
      {reactions.map(({ kind, Icon, labelEn, labelAr }) => (
        <button
          key={kind}
          onClick={() => toggle(kind)}
          disabled={!!loading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-all ${
            active.has(kind)
              ? 'border-gold bg-gold/10 text-gold'
              : 'border-gold/20 text-text-secondary hover:border-gold/40 hover:text-text-primary'
          } disabled:opacity-50`}
        >
          <Icon size={14} className={active.has(kind) ? 'fill-gold' : ''} />
          <span>{isAr ? labelAr : labelEn}</span>
          {counts[kind] > 0 && <span className="text-xs opacity-70">{counts[kind]}</span>}
        </button>
      ))}
    </div>
  );
}
