'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import TierBadge from '@/components/ui/TierBadge';
import { usePathname } from 'next/navigation';

interface KrtkCardProps {
  person: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    currentPosition?: string;
    currentCompany?: string;
    tier?: string;
    isVerified?: boolean;
  };
}

export default function KrtkCard({ person }: KrtkCardProps) {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Link href={`/${locale}/krtk/${person.id}`}>
      <div
        ref={cardRef}
        className="group relative h-64 w-full overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-surface-elevated to-surface p-6 transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_30px_rgba(212,168,83,0.2)] hover:-translate-y-2 cursor-pointer"
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between">
          {/* Top Section - Profile Image */}
          <div className="flex items-start justify-between">
            {person.profileImageUrl && (
              <div className="relative h-16 w-16 flex-shrink-0">
                <img
                  src={person.profileImageUrl}
                  alt={`${person.firstName} ${person.lastName}`}
                  className="h-full w-full rounded-full border-2 border-gold object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}
            {person.isVerified && (
              <div className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 border border-green-500/30">
                <CheckCircle size={12} />
                Verified
              </div>
            )}
          </div>

          {/* Bottom Section - Info */}
          <div className="space-y-2">
            <div>
              <h3 className="text-lg font-bold text-text-primary leading-tight group-hover:text-gold transition-colors duration-200">
                {person.firstName} {person.lastName}
              </h3>
            </div>
            {person.currentPosition && (
              <p className="text-sm font-medium text-gold/90 leading-tight">
                {person.currentPosition}
              </p>
            )}
            {person.currentCompany && (
              <p className="text-xs text-text-secondary leading-tight truncate">
                {person.currentCompany}
              </p>
            )}
            {person.tier && (
              <TierBadge tier={person.tier} size="sm" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
