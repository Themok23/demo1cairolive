'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import TierBadge from '@/components/ui/TierBadge';
import { useState } from 'react';

interface Person {
  id: string;
  firstNameEn: string;
  lastNameEn: string;
  currentPositionEn: string | null;
  currentCompanyEn: string | null;
  tier: string;
  isVerified: boolean | null;
  isClaimed: boolean | null;
}

interface PeopleListProps {
  people: Person[];
  locale: string;
}

export default function AdminPeopleList({ people, locale }: PeopleListProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this person?')) return;

    setIsDeleting(id);
    try {
      const response = await fetch(`/api/admin/people/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to delete person');
      }
    } catch (error) {
      alert('Error deleting person');
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">People</h1>
          <p className="text-text-secondary text-sm mt-1">Manage all people in the directory</p>
        </div>
        <Link
          href={`/${locale}/admin/people/new`}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-background font-semibold hover:bg-gold/80 transition-colors text-sm"
        >
          <Plus size={18} />
          New Person
        </Link>
      </div>

      {people.length > 0 ? (
        <div className="rounded-xl bg-surface-elevated border border-gold/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/10 bg-surface">
                  <th className="text-left py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Name</th>
                  <th className="text-left py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Position</th>
                  <th className="text-left py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Company</th>
                  <th className="text-left py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Tier</th>
                  <th className="text-left py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Status</th>
                  <th className="text-right py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {people.map((person) => (
                  <tr
                    key={person.id}
                    className="border-b border-gold/5 hover:bg-surface-elevated/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="text-text-primary font-medium">
                        {person.firstNameEn} {person.lastNameEn}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-text-secondary text-sm">{person.currentPositionEn || '-'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-text-secondary text-sm">{person.currentCompanyEn || '-'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <TierBadge tier={person.tier} size="sm" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {person.isVerified && (
                          <span className="inline-block px-2 py-1 rounded text-xs bg-green-900/30 text-green-400">
                            Verified
                          </span>
                        )}
                        {person.isClaimed && (
                          <span className="inline-block px-2 py-1 rounded text-xs bg-blue-900/30 text-blue-400">
                            Claimed
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/${locale}/admin/people/${person.id}/edit`}
                          className="p-2 rounded-lg hover:bg-surface-elevated transition-colors text-gold"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(person.id)}
                          disabled={isDeleting === person.id}
                          className="p-2 rounded-lg hover:bg-red-900/20 transition-colors text-red-400 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-surface-elevated border border-gold/10 p-12 text-center">
          <p className="text-text-secondary mb-4">No people yet</p>
          <Link
            href={`/${locale}/admin/people/new`}
            className="text-gold hover:text-gold/80 font-medium"
          >
            Create the first person
          </Link>
        </div>
      )}
    </div>
  );
}
