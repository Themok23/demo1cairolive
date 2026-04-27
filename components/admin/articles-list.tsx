'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Article {
  id: string;
  titleEn: string;
  status: string;
  publishedAt: Date | null;
  malePersonId: string | null;
  femalePersonId: string | null;
}

interface ArticlesListProps {
  articles: Article[];
  locale: string;
}

export default function AdminArticlesList({ articles, locale }: ArticlesListProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    setIsDeleting(id);
    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to delete article');
      }
    } catch (error) {
      alert('Error deleting article');
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Articles</h1>
          <p className="text-text-secondary text-sm mt-1">Manage all articles on the platform</p>
        </div>
        <Link
          href={`/${locale}/admin/articles/new`}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-background font-semibold hover:bg-gold/80 transition-colors text-sm"
        >
          <Plus size={18} />
          New Article
        </Link>
      </div>

      {articles.length > 0 ? (
        <div className="rounded-xl bg-surface-elevated border border-gold/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/10 bg-surface">
                  <th className="text-left py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Title</th>
                  <th className="text-left py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Published</th>
                  <th className="text-left py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Persons</th>
                  <th className="text-right py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="border-b border-gold/5 hover:bg-surface-elevated/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="text-text-primary font-medium">{article.titleEn}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          article.status === 'published'
                            ? 'bg-green-900/30 text-green-400 border border-green-700/30'
                            : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/30'
                        }`}
                      >
                        {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-text-secondary text-sm">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString()
                          : '-'}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-text-secondary text-sm">
                        {[article.malePersonId, article.femalePersonId].filter(Boolean).length}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/${locale}/admin/articles/${article.id}/edit`}
                          className="p-2 rounded-lg hover:bg-surface-elevated transition-colors text-gold"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          disabled={isDeleting === article.id}
                          className="p-2 rounded-lg hover:bg-red-900/20 transition-colors text-red-400 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-surface-elevated border border-gold/10 p-12 text-center">
          <p className="text-text-secondary mb-4">No articles yet</p>
          <Link
            href={`/${locale}/admin/articles/new`}
            className="text-gold hover:text-gold/80 font-medium"
          >
            Create the first article
          </Link>
        </div>
      )}
    </div>
  );
}
