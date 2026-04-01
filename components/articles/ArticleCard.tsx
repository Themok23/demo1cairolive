import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Article } from '@/domain/entities/article';

interface ArticleCardProps {
  article: Article;
  locale?: string;
}

export default function ArticleCard({ article, locale = 'en' }: ArticleCardProps) {
  return (
    <Link href={`/${locale}/articles/${article.slugEn}`}>
      <Card variant="default" className="h-full hover:border-gold transition-colors cursor-pointer">
        {article.featuredImageUrl && (
          <div className="mb-4 -mx-6 -mt-6 h-48 w-[calc(100%+48px)] overflow-hidden rounded-t-lg">
            <img
              src={article.featuredImageUrl}
              alt={article.titleEn}
              className="h-full w-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        )}
        <CardHeader className="mb-2">
          <CardTitle className="line-clamp-2">{article.titleEn}</CardTitle>
          <CardDescription>{formatDate(new Date(article.publishedAt || article.createdAt))}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 line-clamp-3 text-sm text-text-secondary">
            {article.excerptEn}
          </p>
          <div className="flex items-center justify-between">
            <Badge size="sm">{article.category || 'General'}</Badge>
            <span className="text-xs text-text-secondary">
              {article.readTimeMinutes} min read
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
