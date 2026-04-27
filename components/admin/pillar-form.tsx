'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import BilingualInput from '@/components/ui/BilingualInput';
import { safeSlugify } from '@/src/application/utils/slugify';

interface PillarFormProps {
  locale: string;
  initialData?: {
    id: string;
    slug: string;
    nameEn: string;
    nameAr?: string | null;
    descriptionEn?: string | null;
    descriptionAr?: string | null;
    iconKey?: string | null;
    coverImageUrl?: string | null;
    displayOrder: number;
    isActive: boolean;
  };
}

const COMMON_ICONS = [
  'Compass', 'UtensilsCrossed', 'Landmark', 'Palette', 'Code',
  'Music', 'Camera', 'Film', 'Trophy', 'Sparkles', 'Mountain',
  'BookOpen', 'Coffee', 'Heart', 'Star',
];

export default function PillarForm({ locale, initialData }: PillarFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    slug: initialData?.slug || '',
    nameEn: initialData?.nameEn || '',
    nameAr: initialData?.nameAr || '',
    descriptionEn: initialData?.descriptionEn || '',
    descriptionAr: initialData?.descriptionAr || '',
    iconKey: initialData?.iconKey || '',
    coverImageUrl: initialData?.coverImageUrl || '',
    displayOrder: initialData?.displayOrder ?? 0,
    isActive: initialData?.isActive ?? true,
  });

  function setField<K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  const handleNameEnChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      nameEn: value,
      slug: prev.slug ? prev.slug : safeSlugify(value),
    }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const method = initialData ? 'PUT' : 'POST';
      const url = initialData
        ? `/api/admin/pillars/${initialData.id}`
        : '/api/admin/pillars';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to save pillar');
        return;
      }
      router.push(`/${locale}/admin/pillars`);
      router.refresh();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full px-4 py-2 rounded-lg bg-background border border-gold/20 text-text-primary focus:outline-none focus:border-gold transition-colors';

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/admin/pillars`} className="p-2 hover:bg-surface-elevated rounded-lg transition-colors">
          <ArrowLeft className="text-text-secondary" size={24} />
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-text-primary">
            {initialData ? 'Edit Pillar' : 'New Pillar'}
          </h1>
          <p className="text-text-secondary">
            Top-level category for places, articles, and experiences.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Names */}
        <div className="bg-surface-elevated rounded-lg border border-gold/10 p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Name</h2>
          <BilingualInput
            label="Name"
            valueEn={formData.nameEn}
            valueAr={formData.nameAr}
            onChangeEn={handleNameEnChange}
            onChangeAr={(v) => setField('nameAr', v)}
            required
          />
        </div>

        {/* Slug */}
        <div className="bg-surface-elevated rounded-lg border border-gold/10 p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">URL Slug</h2>
          <input
            type="text"
            className={inputClass}
            value={formData.slug}
            onChange={(e) => setField('slug', e.target.value)}
            placeholder="tourism"
            required
          />
          <p className="mt-1 text-xs text-text-secondary">
            Used in URLs like <code>/pillars/{formData.slug || 'slug'}</code>. Lowercase letters, numbers, hyphens.
          </p>
        </div>

        {/* Descriptions */}
        <div className="bg-surface-elevated rounded-lg border border-gold/10 p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Description</h2>
          <BilingualInput
            label="Description"
            valueEn={formData.descriptionEn}
            valueAr={formData.descriptionAr}
            onChangeEn={(v) => setField('descriptionEn', v)}
            onChangeAr={(v) => setField('descriptionAr', v)}
            multiline
          />
        </div>

        {/* Icon + Cover */}
        <div className="bg-surface-elevated rounded-lg border border-gold/10 p-6 grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Icon (lucide-react)
            </label>
            <select
              className={inputClass}
              value={formData.iconKey}
              onChange={(e) => setField('iconKey', e.target.value)}
            >
              <option value="">No icon</option>
              {COMMON_ICONS.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-text-secondary">
              See lucide.dev/icons for the full list.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Cover image
            </label>
            <ImageUpload
              label="Cover image"
              value={formData.coverImageUrl}
              onChange={(url) => setField('coverImageUrl', url)}
            />
          </div>
        </div>

        {/* Display order + Active */}
        <div className="bg-surface-elevated rounded-lg border border-gold/10 p-6 grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Display order
            </label>
            <input
              type="number"
              className={inputClass}
              value={formData.displayOrder}
              onChange={(e) => setField('displayOrder', parseInt(e.target.value, 10) || 0)}
              min={0}
            />
            <p className="mt-1 text-xs text-text-secondary">Lower numbers show first.</p>
          </div>
          <div className="flex items-center gap-3 pt-7">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setField('isActive', e.target.checked)}
              className="w-5 h-5 rounded border-gold/30 bg-background text-gold focus:ring-gold"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-text-primary">
              Active (show in nav menu)
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gold text-background font-semibold rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : initialData ? 'Update Pillar' : 'Create Pillar'}
          </button>
          <Link
            href={`/${locale}/admin/pillars`}
            className="px-6 py-3 bg-surface-elevated text-text-primary font-semibold rounded-lg hover:bg-border/30 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
