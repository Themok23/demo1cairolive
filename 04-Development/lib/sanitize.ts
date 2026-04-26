import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizes HTML content before rendering with dangerouslySetInnerHTML.
 * Allows a safe subset of HTML tags. Blocks data: URIs, wildcard attributes,
 * and other XSS vectors.
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
      'img': ['src', 'alt', 'width', 'height'],
      'code': ['class'],    // syntax highlighting only
      'pre': ['class'],
      'div': ['class', 'dir'],
      'span': ['class', 'dir'],
      'p': ['dir'],
      'h1': ['dir'], 'h2': ['dir'], 'h3': ['dir'],
      'h4': ['dir'], 'h5': ['dir'], 'h6': ['dir'],
      'td': ['colspan', 'rowspan'], 'th': ['colspan', 'rowspan'],
    },
    /* Only https:// and mailto: — data: URIs are blocked (XSS vector) */
    allowedSchemes: ['https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      'img': ['https'],
    },
    /* Force all links to open in a new tab safely */
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
