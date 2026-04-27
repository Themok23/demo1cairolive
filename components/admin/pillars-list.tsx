'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useState } from 'react';

interface Pillar {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  iconKey: string | null;
  coverImageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface PillarsListProps {
  pillars: Pillar[];
  locale: string;
}

export default function AdminPillarsList({ pillars, locale }: PillarsListProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteClick = (id: string, name: string) => {
    setPendingDelete({ id, name });
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    setIsDeleting(pendingDelete.id);
    try {
      const response = await fetch(`/api/admin/pillars/${pendingDelete.id}`, { method: 'DELETE' });
      if (response.ok) {
        setPendingDelete(null);
        router.refresh();
      } else {
        setDeleteError('Failed to delete pillar');
      }
    } catch {
      setDeleteError('Error deleting pillar');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDeleteCancel = () => {
    setPendingDelete(null);
    setDeleteError(null);
  };

  return (
    <div className="p-8 space-y-6">
      {pendingDelete && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-between gap-4">
          <div>
            <p className="text-red-400 font-medium">Delete &quot;{pendingDelete.name}&quot;? This cannot be undone.</p>
            {deleteError && <p className="text-red-400 text-sm mt-1">{deleteError}</p>}
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleDeleteCancel}
              className="px-4 py-2 text-sm rounded-lg bg-[#1a1a1f] text-gray-300 hover:bg-[#D4A853]/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting !== null}
              className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Pillars</h1>
          <p className="text-gray-400">Top-level categories shown in the public nav menu.</p>
        </div>
        <Link
          href={`/${locale}/admin/pillars/new`}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4A853] text-[#0a0a0f] font-semibold hover:bg-[#e8b967] transition-colors"
        >
          <Plus size={20} />
          New Pillar
        </Link>
      </div>

      {/* Table */}
      {pillars.length > 0 ? (
        <div className="rounded-lg bg-[#1a1a1f] border border-[#D4A853]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D4A853]/10 bg-[#0a0a0f]">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Order</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Pillar</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Slug</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pillars.map((p) => {
                  const Icon = p.iconKey
                    ? ((Icons as any)[p.iconKey] as
                        | React.ComponentType<{ size?: number; className?: string }>
                        | undefined)
                    : undefined;
                  return (
                    <tr key={p.id} className="border-b border-[#D4A853]/5 hover:bg-[#D4A853]/5">
                      <td className="py-4 px-6 text-gray-400">{p.displayOrder}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {p.coverImageUrl ? (
                            <img
                              src={p.coverImageUrl}
                              alt={p.nameEn}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : Icon ? (
                            <div className="w-10 h-10 rounded-lg bg-[#D4A853]/10 flex items-center justify-center">
                              <Icon size={20} className="text-[#D4A853]" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#D4A853]/5" />
                          )}
                          <div>
                            <p className="text-white font-medium">{p.nameEn}</p>
                            {p.nameAr && (
                              <p className="text-gray-500 text-sm" lang="ar" dir="rtl">{p.nameAr}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <code className="text-sm text-gray-400">{p.slug}</code>
                      </td>
                      <td className="py-4 px-6">
                        {p.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-emerald-500/15 text-emerald-400">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-500/15 text-gray-400">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/${locale}/admin/pillars/${p.id}/edit`}
                            className="p-2 rounded-lg text-gray-400 hover:text-[#D4A853] hover:bg-[#D4A853]/10 transition-colors"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(p.id, p.nameEn)}
                            disabled={isDeleting !== null}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-[#1a1a1f] border border-[#D4A853]/10 p-12 text-center">
          <p className="text-gray-400 mb-4">No pillars yet.</p>
          <Link
            href={`/${locale}/admin/pillars/new`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4A853] text-[#0a0a0f] font-semibold hover:bg-[#e8b967] transition-colors"
          >
            <Plus size={18} />
            Create the first pillar
          </Link>
        </div>
      )}
    </div>
  );
}
