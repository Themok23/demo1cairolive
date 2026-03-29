'use client';

import Link from 'next/link';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Article {
  id: string;
  title: string;
  status: string;
  publishedAt: Date | null;
  malePersonId: string | null;
  femalePersonId: string | null;
}

interface ArticlesListProps {
  articles: Article[];
}

export default function AdminArticlesList({ articles }: ArticlesListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    setIsDeleting(id);
    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload();
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
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Articles</h1>
          <p className="text-gray-400">Manage all articles on the platform</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4A853] text-[#0a0a0f] font-semibold hover:bg-[#e8b967] transition-colors"
        >
          <Plus size={20} />
          New Article
        </Link>
      </div>

      {/* Table */}
      {articles.length > 0 ? (
        <div className="rounded-lg bg-[#1a1a1f] border border-[#D4A853]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D4A853]/10 bg-[#0a0a0f]">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Title</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">
                    Published
                  </th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">
                    Persons
                  </th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="border-b border-[#D4A853]/5 hover:bg-[#2a2a2f]/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="text-white font-medium">{article.title}</p>
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
                      <p className="text-gray-400 text-sm">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString()
                          : '-'}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-400 text-sm">
                        {[article.malePersonId, article.femalePersonId].filter(Boolean).length}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="p-2 rounded-lg hover:bg-[#2a2a2f] transition-colors text-[#D4A853]"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          disabled={isDeleting === article.id}
                          className="p-2 rounded-lg hover:bg-red-900/20 transition-colors text-red-400 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={18} />
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
        <div className="rounded-lg bg-[#1a1a1f] border border-[#D4A853]/10 p-12 text-center">
          <p className="text-gray-400 mb-4">No articles yet</p>
          <Link
            href="/admin/articles/new"
            className="text-[#D4A853] hover:text-[#e8b967] font-medium"
          >
            Create the first article
          </Link>
        </div>
      )}
    </div>
  );
}
