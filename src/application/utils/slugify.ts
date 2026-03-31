/**
 * Convert a string to a URL-friendly slug.
 * Strips Arabic and other non-ASCII characters — slugs are always Latin.
 * Example: "Ahmed Essam" -> "ahmed-essam"
 * Example: "Hello World!" -> "hello-world"
 * Example: "أحمد عصام" -> "" (empty — caller should fall back to a UUID or timestamp)
 */
export function slugify(text: string): string {
  const result = text
    .toLowerCase()
    .trim()
    .replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g, '') // strip Arabic
    .replace(/[^\w\s-]/g, '')   // strip remaining non-word chars
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return result;
}

/**
 * Generate a slug, falling back to a timestamp-based ID if the slug would be empty.
 * Useful for Arabic-primary titles.
 */
export function safeSlugify(text: string, fallback?: string): string {
  const slug = slugify(text);
  if (slug.length > 0) return slug;
  return fallback || `article-${Date.now()}`;
}

/**
 * Generate a person ID from first and last name
 * Example: "Ahmed", "Essam" -> "ahmed-essam"
 */
export function generatePersonId(firstName: string, lastName: string): string {
  return slugify(`${firstName} ${lastName}`);
}

/**
 * Generate an article slug from an English title.
 * Falls back to a timestamp-based slug if title is empty or Arabic-only.
 */
export function generateArticleSlug(title: string): string {
  return safeSlugify(title);
}
