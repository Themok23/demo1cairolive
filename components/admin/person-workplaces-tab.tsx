'use client';

import { useEffect, useState } from 'react';
import { PersonWorkplace } from '@/src/domain/entities/personWorkplace';
import { Trash2, Plus, ChevronUp } from 'lucide-react';

interface Props { personId: string }

type Draft = Partial<{
  companyEn: string; companyAr: string;
  positionEn: string; positionAr: string;
  descriptionEn: string; descriptionAr: string;
  fromDate: string; toDate: string; isCurrent: boolean;
}>;

const blank: Draft = { companyEn: '', companyAr: '', positionEn: '', positionAr: '', descriptionEn: '', descriptionAr: '', isCurrent: false };

export default function PersonWorkplacesTab({ personId }: Props) {
  const [items, setItems] = useState<PersonWorkplace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<Draft>(blank);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/people/${personId}/workplaces`);
    const json = await res.json();
    setItems(json.data ?? []);
    setLoading(false);
  }

  function set<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  async function save() {
    setSaving(true); setErr('');
    const res = await fetch(`/api/admin/people/${personId}/workplaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    const json = await res.json();
    setSaving(false);
    if (json.data) { setItems((p) => [...p, json.data]); setDraft(blank); setShowForm(false); }
    else setErr(json.error ?? 'Failed');
  }

  async function remove(id: string) {
    if (!confirm('Delete this workplace?')) return;
    await fetch(`/api/admin/people/${personId}/workplaces/${id}`, { method: 'DELETE' });
    setItems((p) => p.filter((i) => i.id !== id));
  }

  if (loading) return <p className="text-text-secondary text-sm py-8">Loading…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-text-primary">Workplaces ({items.length})</h2>
        <button onClick={() => setShowForm((p) => !p)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold/20 text-gold text-sm hover:bg-gold/10 transition-colors">
          {showForm ? <ChevronUp size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancel' : 'Add'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-gold/10 bg-surface p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            {([['companyEn','Company (EN) *'],['companyAr','Company (AR)'],['positionEn','Position (EN)'],['positionAr','Position (AR)'],['fromDate','From Date (YYYY-MM-DD)'],['toDate','To Date (YYYY-MM-DD)']] as [keyof Draft, string][]).map(([k, label]) => (
              <label key={k} className="block">
                <span className="text-xs text-text-secondary mb-1 block">{label}</span>
                <input value={(draft[k] as string) ?? ''} onChange={(e) => set(k, e.target.value as Draft[typeof k])} className={inputCls} />
              </label>
            ))}
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input type="checkbox" checked={draft.isCurrent ?? false} onChange={(e) => set('isCurrent', e.target.checked)} />
            Current position
          </label>
          {[['descriptionEn','Description (EN)'],['descriptionAr','Description (AR)']].map(([k, label]) => (
            <label key={k} className="block">
              <span className="text-xs text-text-secondary mb-1 block">{label}</span>
              <textarea value={(draft[k as keyof Draft] as string) ?? ''} onChange={(e) => set(k as keyof Draft, e.target.value as Draft[keyof Draft])} rows={2} className={inputCls + ' resize-none'} />
            </label>
          ))}
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button onClick={save} disabled={saving} className={btnCls}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => {
          const from = item.fromDate ? new Date(item.fromDate).getFullYear() : null;
          const to = item.isCurrent ? 'Present' : item.toDate ? new Date(item.toDate).getFullYear() : null;
          return (
            <div key={item.id} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gold/10 bg-surface">
              <div>
                <p className="font-medium text-text-primary">{item.companyEn}</p>
                {item.positionEn && <p className="text-sm text-text-secondary">{item.positionEn}</p>}
                {(from || to) && <p className="text-xs text-text-tertiary">{[from, to].filter(Boolean).join(' — ')}</p>}
              </div>
              <button onClick={() => remove(item.id)} className="shrink-0 text-text-tertiary hover:text-red-400 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-sm text-text-tertiary py-4 text-center">No workplaces yet.</p>}
      </div>
    </div>
  );
}

const inputCls = 'w-full rounded-lg border border-gold/10 bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-gold/40 focus:outline-none';
const btnCls = 'px-4 py-2 rounded-lg bg-gold text-background text-sm font-medium hover:bg-gold/90 disabled:opacity-50 transition-colors';
