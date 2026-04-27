'use client';

import { useEffect, useState } from 'react';
import { PersonProduct } from '@/src/domain/entities/personProduct';
import { Trash2, Plus, ChevronUp } from 'lucide-react';

interface Props { personId: string }

type Draft = Partial<{
  titleEn: string; titleAr: string;
  descriptionEn: string; descriptionAr: string;
  externalLink: string; priceText: string; isActive: boolean;
}>;

const blank: Draft = { titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', externalLink: '', priceText: '', isActive: true };

export default function PersonProductsTab({ personId }: Props) {
  const [items, setItems] = useState<PersonProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<Draft>(blank);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/people/${personId}/products`);
    const json = await res.json();
    setItems(json.data ?? []);
    setLoading(false);
  }

  function set<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  async function save() {
    setSaving(true); setErr('');
    const res = await fetch(`/api/admin/people/${personId}/products`, {
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
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/admin/people/${personId}/products/${id}`, { method: 'DELETE' });
    setItems((p) => p.filter((i) => i.id !== id));
  }

  async function toggleActive(item: PersonProduct) {
    await fetch(`/api/admin/people/${personId}/products/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !item.isActive }),
    });
    setItems((p) => p.map((i) => i.id === item.id ? { ...i, isActive: !i.isActive } : i));
  }

  if (loading) return <p className="text-text-secondary text-sm py-8">Loading…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-text-primary">Products ({items.length})</h2>
        <button onClick={() => setShowForm((p) => !p)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold/20 text-gold text-sm hover:bg-gold/10 transition-colors">
          {showForm ? <ChevronUp size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancel' : 'Add'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-gold/10 bg-surface p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            {([['titleEn','Title (EN) *'],['titleAr','Title (AR)'],['priceText','Price Text'],['externalLink','Buy Link']] as [keyof Draft, string][]).map(([k, label]) => (
              <label key={k} className="block">
                <span className="text-xs text-text-secondary mb-1 block">{label}</span>
                <input value={(draft[k] as string) ?? ''} onChange={(e) => set(k, e.target.value as Draft[typeof k])} className={inputCls} />
              </label>
            ))}
          </div>
          {([['descriptionEn','Description (EN)'],['descriptionAr','Description (AR)']] as [keyof Draft, string][]).map(([k, label]) => (
            <label key={k} className="block">
              <span className="text-xs text-text-secondary mb-1 block">{label}</span>
              <textarea value={(draft[k] as string) ?? ''} onChange={(e) => set(k, e.target.value as Draft[typeof k])} rows={2} className={inputCls + ' resize-none'} />
            </label>
          ))}
          <label className="inline-flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input type="checkbox" checked={draft.isActive ?? true} onChange={(e) => set('isActive', e.target.checked)} />
            Active (visible on profile)
          </label>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button onClick={save} disabled={saving} className={btnCls}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gold/10 bg-surface">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-text-primary">{item.titleEn}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${item.isActive ? 'text-green-400 bg-green-500/10' : 'text-text-tertiary bg-surface'}`}>
                  {item.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              {item.priceText && <p className="text-xs text-gold mt-0.5">{item.priceText}</p>}
              {item.descriptionEn && <p className="text-sm text-text-tertiary line-clamp-1">{item.descriptionEn}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggleActive(item)} className="text-xs text-text-secondary hover:text-text-primary border border-gold/10 px-2 py-1 rounded transition-colors">
                {item.isActive ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => remove(item.id)} className="text-text-tertiary hover:text-red-400 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-text-tertiary py-4 text-center">No products yet.</p>}
      </div>
    </div>
  );
}

const inputCls = 'w-full rounded-lg border border-gold/10 bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-gold/40 focus:outline-none';
const btnCls = 'px-4 py-2 rounded-lg bg-gold text-background text-sm font-medium hover:bg-gold/90 disabled:opacity-50 transition-colors';
