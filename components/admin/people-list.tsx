'use client';

import Link from 'next/link';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import TierBadge from '@/components/ui/TierBadge';
import { useState } from 'react';

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  currentPosition: string | null;
  currentCompany: string | null;
  tier: string;
  isVerified: boolean | null;
  isClaimed: boolean | null;
}

interface PeopleListProps {
  people: Person[];
  locale: string;
}

export default function AdminPeopleList({ people, locale }: PeopleListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this person?')) return;

    setIsDeleting(id);
    try {
      const response = await fetch(`/api/admin/people/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload();
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
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">People</h1>
          <p className="text-gray-400">Manage all people in the directory</p>
        </div>
        <Link
          href={`/${locale}/admin/people/new`}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4A853] text-[#0a0a0f] font-semibold hover:bg-[#e8b967] transition-colors"
        >
          <Plus size={20} />
          New Person
        </Link>
      </div>

      {/* Table */}
      {people.length > 0 ? (
        <div className="rounded-lg bg-[#1a1a1f] border border-[#D4A853]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D4A853]/10 bg-[#0a0a0f]">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Name</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">
                    Position
                  </th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Company</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Tier</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {people.map((person) => (
                  <tr
                    key={person.id}
                    className="border-b border-[#D4A853]/5 hover:bg-[#2a2a2f]/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="text-white font-medium">
                        {person.firstName} {person.lastName}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-400 text-sm">{person.currentPosition || '-'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-400 text-sm">{person.currentCompany || '-'}</p>
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
                          className="p-2 rounded-lg hover:bg-[#2a2a2f] transition-colors text-[#D4A853]"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(person.id)}
                          disabled={isDeleting === person.id}
                          className="p-2 rounded-lg hover:bg-red-900/20 transition-colors text-red-400 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={18} />
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
        <div className="rounded-lg bg-[#1a1a1f] border border-[#D4A853]/10 p-12 text-center">
          <p className="text-gray-400 mb-4">No people yet</p>
          <Link
            href={`/${locale}/admin/people/new`}
            className="text-[#D4A853] hover:text-[#e8b967] font-medium"
          >
            Create the first person
          </Link>
        </div>
      )}
    </div>
  );
}
