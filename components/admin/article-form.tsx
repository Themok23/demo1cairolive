'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import BilingualInput from '@/components/ui/BilingualInput';
import { safeSlugify } from '@/src/application/utils/slugify';

interface Person {
  id: string;
  firstNameEn: string;
  firstNameAr?: string | null;
  lastNameEn: string;
  lastNameAr?: string | null;
}

interface PlaceOption {
  id: string;
  slug: string;
  nameEn: string;
  pillarSlug?: string;
}

interface ArticleFormProps {
  locale: string;
  initialData?: {
    id: string;
    titleEn: string;
    titleAr?: string | null;
    slugEn: string;
    contentEn: string;
    contentAr?: string | null;
    excerptEn: string;
    excerptAr?: string | null;
    status: string;
    category?: string | null;
    featuredImageUrl?: string | null;
    articleType?: string | null;
    placeId?: string | null;
    malePersonId?: string | null;
    femalePersonId?: string | null;
  };
  people: Person[];
  places?: PlaceOption[];
}

export default function ArticleForm({ locale, initialData, people, places = [] }: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    titleEn:   initialData?.titleEn   || '',
    titleAr:   initialData?.titleAr   || '',
    slugEn:    initialData?.slugEn    || '',
    contentEn: initialData?.contentEn || '',
    contentAr: initialData?.contentAr || '',
    excerptEn: initialData?.excerptEn || '',
    excerptAr: initialData?.excerptAr || '',
    status:    initialData?.status    || 'draft',
    category:  initialData?.category  || '',
    featuredImageUrl: initialData?.featuredImageUrl || '',
    articleType:    initialData?.articleType    || 'people',
    placeId:        initialData?.placeId        || '',
    malePersonId:   initialData?.malePersonId   || '',
    femalePersonId: initialData?.femalePersonId || '',
  });

  function setField<K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  const handleTitleEnChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      titleEn: value,
      // Auto-generate slug only if not yet manually set
      slugEn: prev.slugEn ? prev.slugEn : safeSlugify(value),
    }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const method = initialData ? 'PUT' : 'POST';
      const url    = initialData ? `/api/admin/articles/${initialData.id}` : '/api/admin/articles';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to save article');
        return;
      }
      router.push(`/${locale}/admin/articles`);
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
        <Link href={`/${locale}/admin/articles`} className="p-2 hover:bg-surface-elevated rounded-lg transition-colors">
          <ArrowLeft className="text-text-secondary" size={24} />
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-text-primary">
            {initialData ? 'Edit Article' : 'New Article'}
          </h1>
          <p className="text-text-secondary">
            {initialData ? 'Update article details' : 'Create a new article'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-400/40 p-4 dark:bg-red-900/20 dark:border-red-700/50">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="rounded-lg bg-surface-elevated border border-gold/10 p-6 space-y-6">

          {/* Title + Slug */}
          <div className="space-y-4">
            <BilingualInput
              label="Title"
              required
              valueEn={formData.titleEn}
              valueAr={formData.titleAr}
              onChangeEn={handleTitleEnChange}
              onChangeAr={(v) => setField('titleAr', v)}
              placeholder={{ en: 'Article title', ar: 'عنوان المقال' }}
            />
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Slug *</label>
              <input
                type="text"
                required
                dir="ltr"
                value={formData.slugEn}
                onChange={(e) => setField('slugEn', e.target.value)}
                className={inputClass}
                placeholder="article-slug"
              />
              <p className="text-xs text-text-secondary mt-1">Auto-generated from English title. Edit if needed.</p>
            </div>
          </div>

          {/* Content */}
          <BilingualInput
            label="Content"
            required
            multiline
            rows={10}
            valueEn={formData.contentEn}
            valueAr={formData.contentAr}
            onChangeEn={(v) => setField('contentEn', v)}
            onChangeAr={(v) => setField('contentAr', v)}
            placeholder={{ en: 'Article content (Markdown supported)', ar: 'محتوى المقال' }}
          />

          {/* Excerpt */}
          <BilingualInput
            label="Excerpt"
            required
            multiline
            rows={3}
            valueEn={formData.excerptEn}
            valueAr={formData.excerptAr}
            onChangeEn={(v) => setField('excerptEn', v)}
            onChangeAr={(v) => setField('excerptAr', v)}
            placeholder={{ en: 'Short description', ar: 'ملخص قصير' }}
          />

          {/* Category + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Category</label>
              <input
                type="text"
                dir="auto"
                value={formData.category}
                onChange={(e) => setField('category', e.target.value)}
                className={inputClass}
                placeholder="e.g. Technology / تقنية"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setField('status', e.target.value)}
                className={inputClass}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Featured Image */}
          <ImageUpload
            label="Featured Image"
            value={formData.featuredImageUrl}
            onChange={(url) => setField('featuredImageUrl', url)}
          />

          {/* Article type — toggles which fields show below */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-primary">Article type *</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  value: 'people',
                  title: 'People',
                  desc: '2 Egyptians (1 male + 1 female)',
                },
                {
                  value: 'place',
                  title: 'Place',
                  desc: 'A restaurant, museum, landmark',
                },
                {
                  value: 'entity',
                  title: 'Entity',
                  desc: 'Organization, event, or brand',
                },
              ].map((opt) => {
                const active = formData.articleType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setField('articleType', opt.value)}
                    className={`text-left rounded-lg border-2 p-4 transition-all ${
                      active
                        ? 'border-gold bg-gold/10'
                        : 'border-gold/20 bg-background hover:border-gold/40'
                    }`}
                  >
                    <div className={`font-bold text-sm mb-1 ${active ? 'text-gold' : 'text-text-primary'}`}>
                      {opt.title}
                    </div>
                    <div className="text-xs text-text-secondary">{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional content based on type */}
          {formData.articleType === 'people' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-text-primary">Featured Persons</h3>
              <p className="text-xs text-text-secondary">
                Every &quot;people&quot; article spotlights one male and one female Egyptian.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'malePersonId' as const, label: 'Male Person' },
                  { key: 'femalePersonId' as const, label: 'Female Person' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      {label}
                    </label>
                    <select
                      value={formData[key]}
                      onChange={(e) => setField(key, e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select a person</option>
                      {people.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.firstNameEn} {person.lastNameEn}
                          {person.firstNameAr ? ` / ${person.firstNameAr} ${person.lastNameAr || ''}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.articleType === 'place' && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-text-primary">Featured place</h3>
              <p className="text-xs text-text-secondary">
                Pick the place this article spotlights. Community experiences (Phase D)
                will be layered on top of this article.
              </p>
              <select
                value={formData.placeId}
                onChange={(e) => setField('placeId', e.target.value)}
                className={inputClass}
              >
                <option value="">Select a place</option>
                {places.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nameEn}
                  </option>
                ))}
              </select>
              {places.length === 0 && (
                <p className="text-xs text-rose-400">
                  No places exist yet. Create one in /admin/places first.
                </p>
              )}
            </div>
          )}

          {formData.articleType === 'entity' && (
            <div className="rounded-lg bg-surface border border-gold/10 p-4">
              <p className="text-sm text-text-secondary">
                Entity articles cover organizations, events, or brands. No
                additional linkage needed at the schema level — content lives in
                the body.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 justify-end">
          <Link
            href={`/${locale}/admin/articles`}
            className="px-4 py-2 rounded-lg border border-gold/20 text-text-primary hover:bg-surface-elevated transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-gold text-background font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
