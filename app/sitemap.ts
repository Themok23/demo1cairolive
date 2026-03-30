import { MetadataRoute } from 'next';
import { db } from '@/src/infrastructure/db/client';
import { articles, persons } from '@/src/infrastructure/db/schema';
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://demo1cairolive.vercel.app';

  try {
    const publishedArticles = await db
      .select({ slug: articles.slug, updatedAt: articles.updatedAt })
      .from(articles)
      .where(eq(articles.status, 'published'));

    const allPersons = await db.select({ id: persons.id, updatedAt: persons.updatedAt }).from(persons);

    const staticPages = ['', '/people', '/articles', '/krtk', '/submit', '/subscribe'];
    const locales = ['en', 'ar'];

    const staticEntries = locales.flatMap((locale) =>
      staticPages.map((page) => ({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: page === '' ? 1 : 0.8,
      }))
    );

    const articleEntries = locales.flatMap((locale) =>
      publishedArticles.map((article) => ({
        url: `${baseUrl}/${locale}/articles/${article.slug}`,
        lastModified: article.updatedAt || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    );

    const personEntries = locales.flatMap((locale) =>
      allPersons.map((person) => ({
        url: `${baseUrl}/${locale}/krtk/${person.id}`,
        lastModified: person.updatedAt || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    );

    return [...staticEntries, ...articleEntries, ...personEntries];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [];
  }
}
