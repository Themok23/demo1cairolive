'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
<<<<<<< HEAD
import ImageUpload from '@/components/admin/ImageUpload';
=======
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126

interface Person {
  id: string;
  firstName: string;
  lastName: string;
}

interface ArticleFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    status: string;
    category: string | null;
    featuredImageUrl: string | null;
    malePersonId: string | null;
    femalePersonId: string | null;
  };
  people: Person[];
}

export default function ArticleForm({ initialData, people }: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    status: initialData?.status || 'draft',
    category: initialData?.category || '',
    featuredImageUrl: initialData?.featuredImageUrl || '',
    malePersonId: initialData?.malePersonId || '',
    femalePersonId: initialData?.femalePersonId || '',
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: generateSlug(value),
    });
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const method = initialData ? 'PUT' : 'POST';
      const url = initialData ? `/api/admin/articles/${initialData.id}` : '/api/admin/articles';

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

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/articles"
          className="p-2 hover:bg-[#1a1a1f] rounded-lg transition-colors"
        >
          <ArrowLeft className="text-gray-400" size={24} />
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-white">
            {initialData ? 'Edit Article' : 'New Article'}
          </h1>
          <p className="text-gray-400">
            {initialData ? 'Update article details' : 'Create a new article'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-900/20 border border-red-700/50 p-4">
            <p className="text-sm font-medium text-red-400">{error}</p>
          </div>
        )}

        <div className="rounded-lg bg-[#1a1a1f] border border-[#D4A853]/10 p-6 space-y-6">
          {/* Title and Slug */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                placeholder="Article title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                placeholder="article-slug"
              />
              <p className="text-xs text-gray-500 mt-1">Auto-generated from title</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content *</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors font-mono text-sm"
              placeholder="Article content (Markdown supported)"
              rows={10}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt *</label>
            <textarea
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
              placeholder="Short article description"
              rows={3}
            />
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                placeholder="e.g. Technology, Business"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Featured Image */}
<<<<<<< HEAD
          <ImageUpload
            label="Featured Image"
            value={formData.featuredImageUrl}
            onChange={(url) => setFormData({ ...formData, featuredImageUrl: url })}
          />
=======
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Featured Image URL
            </label>
            <input
              type="url"
              value={formData.featuredImageUrl}
              onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
              placeholder="https://..."
            />
          </div>
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126

          {/* Persons */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Featured Persons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Male Person
                </label>
                <select
                  value={formData.malePersonId}
                  onChange={(e) => setFormData({ ...formData, malePersonId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                >
                  <option value="">Select a person</option>
                  {people.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.firstName} {person.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Female Person
                </label>
                <select
                  value={formData.femalePersonId}
                  onChange={(e) => setFormData({ ...formData, femalePersonId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                >
                  <option value="">Select a person</option>
                  {people.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.firstName} {person.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 justify-end">
          <Link
            href="/admin/articles"
            className="px-4 py-2 rounded-lg border border-[#D4A853]/20 text-white hover:bg-[#1a1a1f] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-[#D4A853] text-[#0a0a0f] font-semibold hover:bg-[#e8b967] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
