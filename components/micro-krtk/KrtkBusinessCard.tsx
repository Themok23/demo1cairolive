'use client';

import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  CheckCircle,
  Share2,
  Download,
} from 'lucide-react';
import TierBadge from '@/components/ui/TierBadge';

interface KrtkBusinessCardProps {
  person: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string | null;
    coverImageUrl?: string | null;
    currentPosition?: string | null;
    currentCompany?: string | null;
    location?: string | null;
    email?: string;
    phoneNumber?: string | null;
    tier?: string | null;
    isVerified?: boolean;
    linkedinUrl?: string | null;
    twitterUrl?: string | null;
    instagramUrl?: string | null;
    websiteUrl?: string | null;
    bio?: string | null;
  };
  locale: string;
}

const tierConfig: Record<string, { label: string; labelAr: string; bg: string; text: string; border: string; glow: string }> = {
  platinum: {
    label: 'PLATINUM',
    labelAr: 'بلاتيني',
    bg: 'bg-gradient-to-r from-slate-200 to-slate-400',
    text: 'text-slate-900',
    border: 'border-slate-300',
    glow: 'shadow-[0_0_20px_rgba(203,213,225,0.3)]',
  },
  gold: {
    label: 'GOLD',
    labelAr: 'ذهبي',
    bg: 'bg-gradient-to-r from-amber-400 to-yellow-500',
    text: 'text-amber-950',
    border: 'border-amber-400',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
  },
  silver: {
    label: 'SILVER',
    labelAr: 'فضي',
    bg: 'bg-gradient-to-r from-gray-300 to-gray-400',
    text: 'text-gray-900',
    border: 'border-gray-400',
    glow: 'shadow-[0_0_20px_rgba(156,163,175,0.3)]',
  },
  bronze: {
    label: 'BRONZE',
    labelAr: 'برونزي',
    bg: 'bg-gradient-to-r from-orange-600 to-orange-700',
    text: 'text-orange-50',
    border: 'border-orange-600',
    glow: 'shadow-[0_0_20px_rgba(194,65,12,0.2)]',
  },
};

function generateVCard(person: KrtkBusinessCardProps['person']): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${person.firstName} ${person.lastName}`,
    `N:${person.lastName};${person.firstName};;;`,
  ];
  if (person.currentCompany) lines.push(`ORG:${person.currentCompany}`);
  if (person.currentPosition) lines.push(`TITLE:${person.currentPosition}`);
  if (person.email) lines.push(`EMAIL:${person.email}`);
  if (person.phoneNumber) lines.push(`TEL:${person.phoneNumber}`);
  if (person.location) lines.push(`ADR:;;${person.location};;;`);
  if (person.websiteUrl) lines.push(`URL:${person.websiteUrl}`);
  if (person.profileImageUrl) lines.push(`PHOTO;VALUE=URI:${person.profileImageUrl}`);
  lines.push('END:VCARD');
  return lines.join('\n');
}

export default function KrtkBusinessCard({ person, locale }: KrtkBusinessCardProps) {
  const [copied, setCopied] = useState(false);
  const isAr = locale === 'ar';
  const tier = tierConfig[person.tier?.toLowerCase() || ''] || null;
  const fullName = `${person.firstName} ${person.lastName}`;

  const hasSocials = person.linkedinUrl || person.twitterUrl || person.instagramUrl || person.websiteUrl;
  const hasContact = person.email || person.phoneNumber || person.location;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/${locale}/krtk/${person.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${fullName} - KRTK Card`,
          text: isAr ? `بطاقة ${fullName} الرقمية` : `${fullName}'s digital business card`,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // Clipboard failed
      }
    }
  };

  const handleDownloadVCard = () => {
    const vcard = generateVCard(person);
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${person.firstName}-${person.lastName}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${isAr ? 'rtl' : 'ltr'}`}>
      {/* === THE CARD === */}
      <div
        className={`
          relative overflow-hidden rounded-2xl
          bg-gradient-to-br from-[#18181B] via-[#1C1C20] to-[#111113]
          border border-white/[0.06]
          transition-all duration-500
          hover:shadow-[0_8px_60px_rgba(212,168,83,0.12)]
          hover:border-[#D4A853]/20
        `}
      >
        {/* Subtle top accent line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4A853]/40 to-transparent" />

        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4A853]/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#D4A853]/[0.03] rounded-full blur-2xl pointer-events-none" />

        {/* Card Content */}
        <div className="relative p-8 sm:p-10">

          {/* Top Row: Tier + Verified */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              {person.tier && (
                <TierBadge tier={person.tier} size="md" />
              )}
              {person.isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold tracking-wide text-emerald-400">
                  <CheckCircle className="w-3 h-3" />
                  {isAr ? 'موثق' : 'Verified'}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-[0.2em] text-white/20 uppercase">
              KRTK
            </span>
          </div>

          {/* Main: Photo + Identity */}
          <div className="flex items-start gap-6 sm:gap-8 mb-8">
            {/* Profile Photo */}
            <div className="relative flex-shrink-0">
              <div className={`w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] rounded-2xl overflow-hidden ring-2 ring-[#D4A853]/30 ring-offset-2 ring-offset-[#18181B] ${tier ? tier.glow : ''}`}>
                {person.profileImageUrl ? (
                  <img
                    src={person.profileImageUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#D4A853]/20 to-[#D4A853]/5 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold text-[#D4A853]/60">
                      {person.firstName[0]}{person.lastName[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Name + Title */}
            <div className="flex-1 min-w-0 pt-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight">
                {person.firstName}
              </h2>
              <h3 className="text-xl sm:text-2xl font-semibold text-white/50 leading-tight tracking-tight">
                {person.lastName}
              </h3>
              {person.currentPosition && (
                <p className="mt-2 text-sm font-semibold text-[#D4A853] leading-snug">
                  {person.currentPosition}
                </p>
              )}
              {person.currentCompany && (
                <p className="mt-0.5 text-xs text-white/40 font-medium">
                  {person.currentCompany}
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-6" />

          {/* Contact Details */}
          {hasContact && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-6">
              {person.email && (
                <a
                  href={`mailto:${person.email}`}
                  className="group flex items-center gap-3 text-white/40 hover:text-[#D4A853] transition-colors duration-200"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-[#D4A853]/10 transition-colors duration-200">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm truncate">{person.email}</span>
                </a>
              )}
              {person.phoneNumber && (
                <a
                  href={`tel:${person.phoneNumber}`}
                  className="group flex items-center gap-3 text-white/40 hover:text-[#D4A853] transition-colors duration-200"
                  dir="ltr"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-[#D4A853]/10 transition-colors duration-200">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm">{person.phoneNumber}</span>
                </a>
              )}
              {person.location && (
                <div className="flex items-center gap-3 text-white/40">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04]">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm">{person.location}</span>
                </div>
              )}
            </div>
          )}

          {/* Social Links */}
          {hasSocials && (
            <div className="flex items-center gap-2 mb-6">
              {person.linkedinUrl && (
                <a
                  href={person.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.04] text-white/30 hover:bg-[#0077B5]/10 hover:text-[#0077B5] transition-all duration-200 cursor-pointer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {person.twitterUrl && (
                <a
                  href={person.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.04] text-white/30 hover:bg-sky-500/10 hover:text-sky-400 transition-all duration-200 cursor-pointer"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {person.instagramUrl && (
                <a
                  href={person.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.04] text-white/30 hover:bg-pink-500/10 hover:text-pink-400 transition-all duration-200 cursor-pointer"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {person.websiteUrl && (
                <a
                  href={person.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.04] text-white/30 hover:bg-[#D4A853]/10 hover:text-[#D4A853] transition-all duration-200 cursor-pointer"
                  aria-label="Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {/* Bio snippet */}
          {person.bio && (
            <p className="text-xs text-white/25 leading-relaxed line-clamp-2 mb-6">
              {person.bio}
            </p>
          )}

          {/* Bottom Divider */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-5" />

          {/* Footer: Branding + Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-[#D4A853] to-[#F59E0B]" />
              <span className="text-[11px] font-semibold tracking-wide text-white/20">
                Cairo Live
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white/30 hover:text-[#D4A853] hover:bg-[#D4A853]/[0.06] transition-all duration-200 cursor-pointer"
                aria-label={isAr ? 'مشاركة البطاقة' : 'Share card'}
              >
                <Share2 className="w-3 h-3" />
                {copied
                  ? (isAr ? 'تم النسخ!' : 'Copied!')
                  : (isAr ? 'مشاركة' : 'Share')
                }
              </button>
              <button
                onClick={handleDownloadVCard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white/30 hover:text-[#D4A853] hover:bg-[#D4A853]/[0.06] transition-all duration-200 cursor-pointer"
                aria-label={isAr ? 'تحميل البطاقة' : 'Download vCard'}
              >
                <Download className="w-3 h-3" />
                {isAr ? 'تحميل' : 'vCard'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
