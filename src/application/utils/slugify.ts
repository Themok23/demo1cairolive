/**
 * Convert a string to a URL-friendly slug
 * Example: "Ahmed Essam" -> "ahmed-essam"
 * Example: "Hello World!" -> "hello-world"
 *
 * @param text - The text to slugify
 * @returns A slug-friendly string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate a person ID from first and last name
 * Example: "Ahmed", "Essam" -> "ahmed-essam"
 *
 * @param firstName - The first name
 * @param lastName - The last name
 * @returns A slug-friendly person ID
 */
export function generatePersonId(firstName: string, lastName: string): string {
  return slugify(`${firstName} ${lastName}`);
}

/**
 * Generate an article slug from title
 * Example: "Hello World Article" -> "hello-world-article"
 *
 * @param title - The article title
 * @returns A slug-friendly string
 */
export function generateArticleSlug(title: string): string {
  return slugify(title);
}
