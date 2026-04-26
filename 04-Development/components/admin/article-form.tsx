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

interface ArticleFormProps {
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
    malePersonId?: string | null;
    femalePersonId?: string | null;
  };
  people: Person[];
}

export default function ArticleForm({ initialData, people }: ArticleFormProps) {
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
      router.push('/admin/articles');
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
        <Link href="/admin/articles" className="p-2 hover:bg-surface-elevated rounded-lg transition-colors">
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

          {/* Featured Persons */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-text-primary">Featured Persons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'malePersonId'   as const, label: 'Male Person' },
                { key: 'femalePersonId' as const, label: 'Female Person' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-text-primary mb-2">{label}</label>
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
        </div>

        <div className="flex items-center gap-4 justify-end">
          <Link
            href="/admin/articles"
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
