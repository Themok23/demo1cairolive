'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { CheckCircle } from 'lucide-react';

interface KrtkCardProps {
  person: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    currentPosition?: string;
    currentCompany?: string;
    tier?: 'Free' | 'Premium';
    isVerified?: boolean;
  };
}

export default function KrtkCard({ person }: KrtkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Link href={`/krtk/${person.id}`}>
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
                {person.isVerified && (
                  <CheckCircle
                    size={20}
                    className="absolute -bottom-1 -right-1 fill-gold text-background"
                  />
                )}
              </div>
            )}
            {person.tier === 'Premium' && (
              <Badge
                variant="gold"
                size="sm"
                className="ml-auto text-xs font-bold"
              >
                PREMIUM
              </Badge>
            )}
          </div>

          {/* Bottom Section - Info */}
          <div className="space-y-2">
            <div>
              <h3 className="text-lg font-bold text-text-primary leading-tight group-hover:text-gold transition-colors duration-200">
                {person.firstName}
              </h3>
              <h4 className="text-lg font-bold text-text-primary/70 leading-tight">
                {person.lastName}
              </h4>
            </div>
            {person.currentPosition && (
              <p className="text-xs font-semibold text-gold/90 leading-tight">
                {person.currentPosition}
              </p>
            )}
            {person.currentCompany && (
              <p className="text-xs text-text-secondary leading-tight truncate">
                {person.currentCompany}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
