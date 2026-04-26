'use client';

import { MessageCircle } from 'lucide-react';
import { buildWhatsAppShareUrl } from '@/lib/share/whatsapp';

interface WhatsAppShareButtonProps {
  url: string;
  text: string;
  locale?: string;
  className?: string;
  variant?: 'icon' | 'pill' | 'minimal';
}

export default function WhatsAppShareButton({
  url,
  text,
  locale = 'en',
  className = '',
  variant = 'pill',
}: WhatsAppShareButtonProps) {
  const isAr = locale === 'ar';
  const label = isAr ? 'واتساب' : 'WhatsApp';

  const handleClick = () => {
    // Resolve URL on client to ensure absolute origin.
    const absolute = url.startsWith('http')
      ? url
      : typeof window !== 'undefined'
      ? `${window.location.origin}${url}`
      : url;
    const shareUrl = buildWhatsAppShareUrl({ url: absolute, text });
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={isAr ? 'مشاركة على واتساب' : 'Share on WhatsApp'}
        className={
          'flex items-center justify-center w-9 h-9 rounded-xl bg-surface-elevated text-text-secondary hover:bg-[#25D366]/10 hover:text-[#25D366] transition-all duration-200 cursor-pointer ' +
          className
        }
      >
        <MessageCircle className="w-4 h-4" />
      </button>
    );
  }

  if (variant === 'minimal') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-text-secondary hover:text-[#25D366] hover:bg-[#25D366]/[0.06] transition-all duration-200 cursor-pointer ' +
          className
        }
      >
        <MessageCircle className="w-3 h-3" />
        {label}
      </button>
    );
  }

  // default: pill
  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366]/15 transition-all duration-200 cursor-pointer ' +
        className
      }
    >
      <MessageCircle className="w-4 h-4" />
      {isAr ? 'مشاركة على واتساب' : 'Share on WhatsApp'}
    </button>
  );
}
