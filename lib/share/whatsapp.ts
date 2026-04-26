/**
 * WhatsApp share utility — generates wa.me deep links.
 * No SDK or API key needed; opens the user's WhatsApp client directly.
 */

export interface WhatsAppShareInput {
  /** The URL to share (will be appended after the text) */
  url: string;
  /** Pre-filled text shown before the URL */
  text: string;
  /** Optional phone number to send to (international format, no +). Omit for "share with anyone". */
  phone?: string;
}

/** Build a wa.me deep link. */
export function buildWhatsAppShareUrl(input: WhatsAppShareInput): string {
  const message = `${input.text}\n\n${input.url}`;
  const encoded = encodeURIComponent(message);
  if (input.phone) {
    return `https://wa.me/${input.phone}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
}
