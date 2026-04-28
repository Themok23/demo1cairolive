'use client';

import { useState } from 'react';
import { Experience } from '@/src/domain/entities/experience';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

interface Props {
  items: Experience[];
  locale: string;
  status: string;
}

export default function ExperiencesAdminList({ items: initial, locale, status }: Props) {
  const [items, setItems] = useState<Experience[]>(initial);
  const [loading, setLoading] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  async function approve(id: string) {
    setLoading(id);
    const res = await fetch(`/api/admin/experiences/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' }),
    });
    const json = await res.json();
    if (json.success) setItems((p) => p.filter((i) => i.id !== id));
    setLoading(null);
  }

  async function reject(id: string) {
    setLoading(id);
    const res = await fetch(`/api/admin/experiences/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', rejectionReason: reason || undefined }),
    });
    const json = await res.json();
    if (json.success) { setItems((p) => p.filter((i) => i.id !== id)); setRejectId(null); setReason(''); }
    setLoading(null);
  }

  if (items.length === 0) {
    return <p className="text-sm text-text-tertiary py-8 text-center">No {status} experiences.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-gold/10 bg-surface p-4">
          <div className="flex items-start gap-4 justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  item.type === 'visit' ? 'bg-blue-500/10 text-blue-400' :
                  item.type === 'book_review' ? 'bg-purple-500/10 text-purple-400' :
                  item.type === 'trip' ? 'bg-green-500/10 text-green-400' :
                  'bg-amber-500/10 text-amber-400'
                }`}>{item.type.replace('_', ' ')}</span>
                <Clock size={12} className="text-text-tertiary" />
                <span className="text-xs text-text-tertiary">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="font-medium text-text-primary truncate">{item.titleEn}</p>
              {item.summaryEn && <p className="text-sm text-text-secondary line-clamp-2 mt-0.5">{item.summaryEn}</p>}
              {item.submittedByName && (
                <p className="text-xs text-text-tertiary mt-1">by {item.submittedByName} ({item.submittedByEmail})</p>
              )}
              {item.rejectionReason && (
                <p className="text-xs text-red-400 mt-1">Rejection reason: {item.rejectionReason}</p>
              )}
            </div>

            {status === 'pending' && (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => approve(item.id)}
                  disabled={loading === item.id}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 text-sm transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={14} /> Approve
                </button>
                <button
                  onClick={() => setRejectId(item.id)}
                  disabled={loading === item.id}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm transition-colors disabled:opacity-50"
                >
                  <XCircle size={14} /> Reject
                </button>
              </div>
            )}

            {status === 'published' && item.slug && (
              <a
                href={`/${locale}/experiences/${item.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-tertiary hover:text-gold transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>

          {rejectId === item.id && (
            <div className="mt-3 space-y-2">
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Rejection reason (optional)"
                className="w-full rounded-lg border border-gold/10 bg-background px-3 py-2 text-sm text-text-primary focus:border-gold/40 focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => reject(item.id)}
                  disabled={loading === item.id}
                  className="px-4 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors disabled:opacity-50"
                >
                  {loading === item.id ? 'Rejecting…' : 'Confirm Reject'}
                </button>
                <button onClick={() => { setRejectId(null); setReason(''); }} className="px-4 py-1.5 rounded-lg text-text-secondary text-sm hover:text-text-primary">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
