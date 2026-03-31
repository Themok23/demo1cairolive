import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizes HTML content from the database before rendering with dangerouslySetInnerHTML.
 * Allows a safe subset of HTML tags and attributes for rich article content.
 */
export function sanitizeContent(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'b', 'em', 'i', 'u', 's', 'del',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'figure', 'figcaption',
    ],
    allowedAttributes: {
      'a': ['href', 'target', 'rel'],
      'img': ['src', 'alt', 'width', 'height', 'class'],
      'code': ['class'],
      'pre': ['class'],
      '*': ['class', 'id', 'dir'],
    },
    allowedSchemes: ['https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      'img': ['https', 'data'],
    },
    // Force all links to open in a new tab with noopener for safety
    transformTags: {
      'a': (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    },
  });
}
