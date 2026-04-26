'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import BilingualInput from '@/components/ui/BilingualInput';
import { safeSlugify } from '@/src/application/utils/slugify';

interface Pillar {
  id: string;
  slug: string;
  nameEn: string;
}

interface PlaceFormProps {
  pillars: Pillar[];
  initialData?: {
    id: string;
    slug: string;
    pillarId: string;
    type: string;
    nameEn: string;
    nameAr?: string | null;
    taglineEn?: string | null;
    taglineAr?: string | null;
    descriptionEn?: string | null;
    descriptionAr?: string | null;
    locationEn?: string | null;
    locationAr?: string | null;
    mapUrl?: string | null;
    latitude?: string | null;
    longitude?: string | null;
    phone?: string | null;
    email?: string | null;
    websiteUrl?: string | null;
    instagramUrl?: string | null;
    openingHoursJson?: string | null;
    coverImageUrl?: string | null;
    galleryImagesJson?: string | null;
    isFeatured: boolean;
    status: string;
  };
}

const PLACE_TYPES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'museum', label: 'Museum' },
  { value: 'landmark', label: 'Landmark' },
  { value: 'cafe', label: 'Café' },
  { value: 'shop', label: 'Shop' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'hotel', label: 'Hotel' },
];

export default function PlaceForm({ pillars, initialData }: PlaceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    slug: initialData?.slug || '',
    pillarId: initialData?.pillarId || pillars[0]?.id || '',
    type: initialData?.type || 'restaurant',
    nameEn: initialData?.nameEn || '',
    nameAr: initialData?.nameAr || '',
    taglineEn: initialData?.taglineEn || '',
    taglineAr: initialData?.taglineAr || '',
    descriptionEn: initialData?.descriptionEn || '',
    descriptionAr: initialData?.descriptionAr || '',
    locationEn: initialData?.locationEn || '',
    locationAr: initialData?.locationAr || '',
    mapUrl: initialData?.mapUrl || '',
    latitude: initialData?.latitude || '',
    longitude: initialData?.longitude || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    websiteUrl: initialData?.websiteUrl || '',
    instagramUrl: initialData?.instagramUrl || '',
    openingHoursJson: initialData?.openingHoursJson || '',
    coverImageUrl: initialData?.coverImageUrl || '',
    galleryImagesJson: initialData?.galleryImagesJson || '',
    isFeatured: initialData?.isFeatured ?? false,
    status: initialData?.status || 'draft',
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
        ? `/api/admin/places/${initialData.id}`
        : '/api/admin/places';

      const payload: any = { ...formData };
      // Coerce numeric fields
      if (payload.latitude === '') payload.latitude = null;
      if (payload.longitude === '') payload.longitude = null;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to save place');
        return;
      }
      router.push('/admin/places');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full px-4 py-2 rounded-lg bg-background border border-gold/20 text-text-primary focus:outline-none focus:border-gold transition-colors';

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/places" className="p-2 hover:bg-surface-elevated rounded-lg transition-colors">
          <ArrowLeft className="text-text-secondary" size={24} />
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-text-primary">
            {initialData ? 'Edit Place' : 'New Place'}
          </h1>
          <p className="text-text-secondary">
            A restaurant, museum, landmark, or other discoverable spot.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Pillar + Type */}
        <div className="bg-surface-elevated rounded-lg border border-gold/10 p-6 grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Pillar *</label>
            <select
              className={inputClass}
              value={formData.pillarId}
              onChange={(e) => setField('pillarId', e.target.value)}
              required
            >
              {pillars.map((p) => (
                <option key={p.id} value={p.id}>{p.nameEn}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Type *</label>
            <select
              className={inputClass}
              value={formData.type}
              onChange={(e) => setField('type', e.target.value)}
              required
            >
              {PLACE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Names */}
        <div className="bg-surface-elevated rounded-lg border border-gold/10 p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Name</h2>
          <BilingualInput
            label="Name"
            valueEn={formData.nameEn}
            valueAr={formData.nameAr}
            onChangeEn={handleNameEnChange}
            onChangeAr={(v) => setField('nameAr', v)}
            requiredEn
          />
        </div>

        {/* Slug */}
        <div className="bg-surface-elevated rounded-lg border border-gold/10 p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">URL Slug *</h2>
          <input
            type="text"
            className={inputClass}
            value={formData.slug}
            onChange={(e) => setField('slug', e.target.value)}
            placeholder="grand-egyptian-museum"
            required
          />
        </div>

        {/* Tagline */}
        <div className="bg-surface-elevated rounded-lg border border-gold/10 p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Tagline</h2>
          <BilingualInput
            label="Tagline"
            valueEn={formData.taglineEn}
            valueAr={formData.taglineAr}
            onChangeEn={(v) => setField('taglineEn', v)}
            onChangeAr={(v) => setField('taglineAr', v)}
          />
        </div>

        {/* Description */}
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

        {/* Location */}
        <div className="bg-surface-elevated rounded-lg border border-gold/10 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Location</h2>
          <BilingualInput
            label="Address"
            valueEn={formData.locationEn}
            valueAr={formData.locationAr}
            onChangeEn={(v) => setField('locationEn', v)}
            onChangeAr={(v) => setField('locationAr', v)}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Latitude</label>
              <input
                type="number"
                step="any"
                className={inputClass}
                value={formData.latitude}
                onChange={(e) => setField('latitude', e.target.value)}
                placeholder="30.0444"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Longitude</label>
              <input
                type="number"
                step="any"
                className={inputClass}
                value={formData.longitude}
                onChange={(e) => setField('longitude', e.target.value)}
                placeholder="31.2357"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Google Maps URL</label>
            <input
              type="url"
              className={inputClass}
              value={formData.mapUrl}
              onChange={(e) => setField('mapUrl', e.target.value)}
              placeholder="https://maps.google.com/?q=..."
            />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-surface-elevated rounded-lg border border-gold/10 p-6 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Phone</label>
            <input
              type="tel"
              className={inputClass}
              value={formData.phone}
              onChange={(e) => setField('phone', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
            <input
              type="email"
              className={inputClass}
              value={formData.email}
              onChange={(e) => setField('email', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Website</label>
            <input
              type="url"
              className={inputClass}
              value={formData.websiteUrl}
              onChange={(e) => setField('websiteUrl', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Instagram</label>
            <input
              type="url"
              className={inputClass}
              value={formData.instagramUrl}
              onChange={(e) => setField('instagramUrl', e.target.value)}
            />
          </div>
        </div>

        {/* Hours JSON */}
        <div className="bg-surface-elevated rounded-lg border border-gold/10 p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-2">Opening hours (JSON)</h2>
          <p className="text-xs text-text-secondary mb-3">
            Format: <code>[{`{"day":"Mon","open":"09:00","close":"21:00"}`}]</code>. Leave empty if not applicable.
          </p>
          <textarea
            className={`${inputClass} font-mono text-xs`}
            rows={4}
            value={formData.openingHoursJson}
            onChange={(e) => setField('openingHoursJson', e.target.value)}
            placeholder={`[\n  {"day":"Mon","open":"09:00","close":"21:00"},\n  {"day":"Tue","open":"09:00","close":"21:00"}\n]`}
          />
        </div>

        {/* Cover + Gallery */}
        <div className="bg-surface-elevated rounded-lg border border-gold/10 p-6 grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Cover image</label>
            <ImageUpload
              currentImage={formData.coverImageUrl}
              onUpload={(url) => setField('coverImageUrl', url)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Gallery (JSON array of URLs)
            </label>
            <textarea
              className={`${inputClass} font-mono text-xs`}
              rows={5}
              value={formData.galleryImagesJson}
              onChange={(e) => setField('galleryImagesJson', e.target.value)}
              placeholder={`["https://...jpg","https://...jpg"]`}
            />
          </div>
        </div>

        {/* Status flags */}
        <div className="bg-surface-elevated rounded-lg border border-gold/10 p-6 grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Status</label>
            <select
              className={inputClass}
              value={formData.status}
              onChange={(e) => setField('status', e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-7">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setField('isFeatured', e.target.checked)}
              className="w-5 h-5 rounded border-gold/30 bg-background text-gold focus:ring-gold"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-text-primary">
              Featured (highlighted on the pillar page)
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
            {loading ? 'Saving...' : initialData ? 'Update Place' : 'Create Place'}
          </button>
          <Link
            href="/admin/places"
            className="px-6 py-3 bg-surface-elevated text-text-primary font-semibold rounded-lg hover:bg-border/30 transition-colors"
          >
            Cancel
          </Link>
        </div>

        {initialData && (
          <p className="text-xs text-text-secondary pt-2">
            Tip: after creating a place you can link people (chef, owner, etc.) from the place&apos;s edit page.
          </p>
        )}
      </form>
    </div>
  );
}
