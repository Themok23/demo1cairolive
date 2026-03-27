import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Person } from '@/domain/entities/person';

interface KrtkCardProps {
  person: Person;
}

export default function KrtkCard({ person }: KrtkCardProps) {
  return (
    <Link href={`/krtk/${person.id}`}>
      <Card variant="default" className="h-full hover:border-gold transition-colors cursor-pointer overflow-hidden">
        {person.profileImageUrl && (
          <div className="h-48 w-full overflow-hidden">
            <img
              src={person.profileImageUrl}
              alt={`${person.firstName} ${person.lastName}`}
              className="h-full w-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        )}
        <CardContent className="pt-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {person.firstName} {person.lastName}
            </h3>
            {person.currentPosition && (
              <p className="text-sm text-gold font-medium">
                {person.currentPosition}
              </p>
            )}
            {person.currentCompany && (
              <p className="text-xs text-text-secondary mb-3">
                at {person.currentCompany}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Badge variant="gold" size="sm">{person.tier}</Badge>
              {person.isVerified && (
                <Badge variant="success" size="sm">Verified</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
