'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Plus, Trash2, Star } from 'lucide-react';
import { useState } from 'react';

interface PlaceRow {
  id: string;
  slug: string;
  pillarSlug: string;
  pillarNameEn: string;
  type: string;
  nameEn: string;
  nameAr: string | null;
  coverImageUrl: string | null;
  isFeatured: boolean;
  status: string;
}

interface PlacesListProps {
  places: PlaceRow[];
  locale: string;
}

const STATUS_STYLES: Record<string, string> = {
  draft:     'bg-gray-500/15 text-gray-400',
  published: 'bg-emerald-500/15 text-emerald-400',
  archived:  'bg-rose-500/15 text-rose-400',
};

export default function AdminPlacesList({ places, locale }: PlacesListProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete place "${name}"? This cannot be undone.`)) return;
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/admin/places/${id}`, { method: 'DELETE' });
      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to delete place');
      }
    } catch (error) {
      alert('Error deleting place');
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Places</h1>
          <p className="text-gray-400">Restaurants, museums, landmarks, cafés, and more.</p>
        </div>
        <Link
          href={`/${locale}/admin/places/new`}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4A853] text-[#0a0a0f] font-semibold hover:bg-[#e8b967] transition-colors"
        >
          <Plus size={20} />
          New Place
        </Link>
      </div>

      {places.length > 0 ? (
        <div className="rounded-lg bg-[#1a1a1f] border border-[#D4A853]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D4A853]/10 bg-[#0a0a0f]">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Place</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Pillar</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Type</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {places.map((p) => (
                  <tr key={p.id} className="border-b border-[#D4A853]/5 hover:bg-[#D4A853]/5">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {p.coverImageUrl ? (
                          <img
                            src={p.coverImageUrl}
                            alt={p.nameEn}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#D4A853]/10" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{p.nameEn}</p>
                            {p.isFeatured && (
                              <Star size={12} className="text-[#D4A853] fill-[#D4A853]" />
                            )}
                          </div>
                          {p.nameAr && (
                            <p className="text-gray-500 text-sm" lang="ar" dir="rtl">{p.nameAr}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-sm">{p.pillarNameEn}</td>
                    <td className="py-4 px-6">
                      <code className="text-xs text-gray-400 uppercase">{p.type}</code>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${STATUS_STYLES[p.status] || STATUS_STYLES.draft}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/${locale}/admin/places/${p.id}/edit`}
                          className="p-2 rounded-lg text-gray-400 hover:text-[#D4A853] hover:bg-[#D4A853]/10 transition-colors"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.nameEn)}
                          disabled={isDeleting === p.id}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
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
          <p className="text-gray-400 mb-4">No places yet.</p>
          <Link
            href={`/${locale}/admin/places/new`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4A853] text-[#0a0a0f] font-semibold hover:bg-[#e8b967] transition-colors"
          >
            <Plus size={18} />
            Create the first place
          </Link>
        </div>
      )}
    </div>
  );
}
