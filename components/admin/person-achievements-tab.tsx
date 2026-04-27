'use client';

import { useEffect, useState } from 'react';
import { PersonAchievement } from '@/src/domain/entities/personAchievement';
import { Trash2, Plus, ChevronUp } from 'lucide-react';

interface Props { personId: string }

type Draft = Partial<{
  titleEn: string; titleAr: string;
  descriptionEn: string; descriptionAr: string;
  externalLink: string; iconKey: string;
}>;

const blank: Draft = { titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', externalLink: '', iconKey: '' };

export default function PersonAchievementsTab({ personId }: Props) {
  const [items, setItems] = useState<PersonAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<Draft>(blank);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/people/${personId}/achievements`)
      .then(r => r.json())
      .then(json => { setItems(json.data ?? []); setLoading(false); })
      .catch(() => { setErr('Failed to load'); setLoading(false); });
  }, [personId]);

  function set(field: keyof Draft, value: string) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  async function save() {
    setSaving(true); setErr('');
    try {
      const res = await fetch(`/api/admin/people/${personId}/achievements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const json = await res.json();
      if (json.data) { setItems((p) => [...p, json.data]); setDraft(blank); setShowForm(false); }
      else setErr(json.error ?? 'Failed');
    } catch {
      setErr('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this achievement?')) return;
    await fetch(`/api/admin/people/${personId}/achievements/${id}`, { method: 'DELETE' });
    setItems((p) => p.filter((i) => i.id !== id));
  }

  if (loading) return <p className="text-text-secondary text-sm py-8">Loading…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-text-primary">Achievements ({items.length})</h2>
        <button onClick={() => setShowForm((p) => !p)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold/20 text-gold text-sm hover:bg-gold/10 transition-colors">
          {showForm ? <ChevronUp size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancel' : 'Add'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-gold/10 bg-surface p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            {([['titleEn','Title (EN) *'],['titleAr','Title (AR)'],['externalLink','External Link'],['iconKey','Icon Key']] as [keyof Draft, string][]).map(([k, label]) => (
              <label key={k} className="block">
                <span className="text-xs text-text-secondary mb-1 block">{label}</span>
                <input value={(draft[k] ?? '')} onChange={(e) => set(k, e.target.value)} className={inputCls} />
              </label>
            ))}
          </div>
          {([['descriptionEn','Description (EN)'],['descriptionAr','Description (AR)']] as [keyof Draft, string][]).map(([k, label]) => (
            <label key={k} className="block">
              <span className="text-xs text-text-secondary mb-1 block">{label}</span>
              <textarea value={(draft[k] ?? '')} onChange={(e) => set(k, e.target.value)} rows={2} className={inputCls + ' resize-none'} />
            </label>
          ))}
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button onClick={save} disabled={saving} className={btnCls}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gold/10 bg-surface">
            <div>
              <p className="font-medium text-text-primary">{item.titleEn}</p>
              {item.titleAr && <p className="text-sm text-text-secondary">{item.titleAr}</p>}
              {item.descriptionEn && <p className="text-sm text-text-tertiary line-clamp-2">{item.descriptionEn}</p>}
            </div>
            <button onClick={() => remove(item.id)} className="shrink-0 text-text-tertiary hover:text-red-400 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-text-tertiary py-4 text-center">No achievements yet.</p>}
      </div>
    </div>
  );
}

const inputCls = 'w-full rounded-lg border border-gold/10 bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-gold/40 focus:outline-none';
const btnCls = 'px-4 py-2 rounded-lg bg-gold text-background text-sm font-medium hover:bg-gold/90 disabled:opacity-50 transition-colors';
