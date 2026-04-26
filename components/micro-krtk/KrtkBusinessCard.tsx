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
import WhatsAppShareButton from '@/components/ui/WhatsAppShareButton';
import { localized, type Locale } from '@/src/lib/locale';

interface KrtkBusinessCardProps {
  person: {
    id: string;
    firstNameEn: string;
    firstNameAr?: string | null;
    lastNameEn: string;
    lastNameAr?: string | null;
    profileImageUrl?: string | null;
    coverImageUrl?: string | null;
    currentPositionEn?: string | null;
    currentPositionAr?: string | null;
    currentCompanyEn?: string | null;
    currentCompanyAr?: string | null;
    locationEn?: string | null;
    locationAr?: string | null;
    email?: string;
    phoneNumber?: string | null;
    tier?: string | null;
    isVerified?: boolean;
    linkedinUrl?: string | null;
    twitterUrl?: string | null;
    instagramUrl?: string | null;
    websiteUrl?: string | null;
    bioEn?: string | null;
    bioAr?: string | null;
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

function generateVCard(person: KrtkBusinessCardProps['person'], firstName: string, lastName: string, position: string, company: string, location: string): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${firstName} ${lastName}`,
    `N:${lastName};${firstName};;;`,
  ];
  if (company) lines.push(`ORG:${company}`);
  if (position) lines.push(`TITLE:${position}`);
  if (person.email) lines.push(`EMAIL:${person.email}`);
  if (person.phoneNumber) lines.push(`TEL:${person.phoneNumber}`);
  if (location) lines.push(`ADR:;;${location};;;`);
  if (person.websiteUrl) lines.push(`URL:${person.websiteUrl}`);
  if (person.profileImageUrl) lines.push(`PHOTO;VALUE=URI:${person.profileImageUrl}`);
  lines.push('END:VCARD');
  return lines.join('\n');
}

export default function KrtkBusinessCard({ person, locale }: KrtkBusinessCardProps) {
  const [copied, setCopied] = useState(false);
  const isAr = locale === 'ar';
  const loc = locale as Locale;
  const tier = tierConfig[person.tier?.toLowerCase() || ''] || null;

  const firstName = localized(loc, person.firstNameEn, person.firstNameAr);
  const lastName  = localized(loc, person.lastNameEn, person.lastNameAr);
  const position  = localized(loc, person.currentPositionEn, person.currentPositionAr);
  const company   = localized(loc, person.currentCompanyEn, person.currentCompanyAr);
  const location  = localized(loc, person.locationEn, person.locationAr);
  const bio       = localized(loc, person.bioEn, person.bioAr);
  const fullName  = `${firstName} ${lastName}`.trim();

  const hasSocials = person.linkedinUrl || person.twitterUrl || person.instagramUrl || person.websiteUrl;
  const hasContact = person.email || person.phoneNumber || location;

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
    const vcard = generateVCard(person, firstName, lastName, position, company, location);
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${firstName}-${lastName}.vcf`;
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
          bg-gradient-to-br from-surface-elevated via-surface to-surface
          border border-border
          shadow-md dark:shadow-[0_8px_40px_rgba(0,0,0,0.18)]
          transition-all duration-500
          hover:shadow-lg dark:hover:shadow-[0_12px_64px_rgba(212,168,83,0.15)]
          hover:border-gold/20
        `}
      >
        {/* Subtle top accent line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gold/[0.03] rounded-full blur-2xl pointer-events-none" />

        {/* Card Content */}
        <div className="relative p-8 sm:p-10">

          {/* Top Row: Tier + Verified */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              {person.tier && (
                <TierBadge tier={person.tier} size="md" />
              )}
              {person.isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold tracking-wide text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="w-3 h-3" />
                  {isAr ? 'موثق' : 'Verified'}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-[0.2em] text-text-secondary/50 uppercase">
              KRTK
            </span>
          </div>

          {/* Main: Photo + Identity */}
          <div className="flex items-start gap-6 sm:gap-8 mb-8">
            {/* Profile Photo */}
            <div className="relative flex-shrink-0">
              <div className={`w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] rounded-2xl overflow-hidden ring-2 ring-gold/30 ring-offset-2 ring-offset-surface ${tier ? tier.glow : ''}`}>
                {person.profileImageUrl ? (
                  <img
                    src={person.profileImageUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold text-gold/60">
                      {firstName[0]}{lastName[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Name + Title */}
            <div className="flex-1 min-w-0 pt-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight tracking-tight" lang={locale}>
                {firstName}
              </h2>
              <h3 className="text-xl sm:text-2xl font-semibold text-text-primary/50 leading-tight tracking-tight" lang={locale}>
                {lastName}
              </h3>
              {position && (
                <p className="mt-2 text-sm font-semibold text-gold leading-snug" lang={locale}>
                  {position}
                </p>
              )}
              {company && (
                <p className="mt-0.5 text-xs text-text-secondary font-medium" lang={locale}>
                  {company}
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

          {/* Contact Details */}
          {hasContact && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-6">
              {person.email && (
                <a
                  href={`mailto:${person.email}`}
                  className="group flex items-center gap-3 text-text-secondary hover:text-gold transition-colors duration-200"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-elevated group-hover:bg-gold/10 transition-colors duration-200">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm truncate">{person.email}</span>
                </a>
              )}
              {person.phoneNumber && (
                <a
                  href={`tel:${person.phoneNumber}`}
                  className="group flex items-center gap-3 text-text-secondary hover:text-gold transition-colors duration-200"
                  dir="ltr"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-elevated group-hover:bg-gold/10 transition-colors duration-200">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm">{person.phoneNumber}</span>
                </a>
              )}
              {location && (
                <div className="flex items-center gap-3 text-text-secondary">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-elevated">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm" lang={locale}>{location}</span>
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
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-elevated text-text-secondary hover:bg-[#0077B5]/10 hover:text-[#0077B5] transition-all duration-200 cursor-pointer"
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
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-elevated text-text-secondary hover:bg-sky-500/10 hover:text-sky-400 transition-all duration-200 cursor-pointer"
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
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-elevated text-text-secondary hover:bg-pink-500/10 hover:text-pink-400 transition-all duration-200 cursor-pointer"
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
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-elevated text-text-secondary hover:bg-gold/10 hover:text-gold transition-all duration-200 cursor-pointer"
                  aria-label="Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {/* Bio snippet */}
          {bio && (
            <p className="text-xs text-text-secondary/60 leading-relaxed line-clamp-2 mb-6" lang={locale}>
              {bio}
            </p>
          )}

          {/* Bottom Divider */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-border to-transparent mb-5" />

          {/* Footer: Branding + Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-gold to-amber" />
              <span className="text-[11px] font-semibold tracking-wide text-text-secondary/50">
                Cairo Live
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-text-secondary hover:text-gold hover:bg-gold/[0.06] transition-all duration-200 cursor-pointer"
                aria-label={isAr ? 'مشاركة البطاقة' : 'Share card'}
              >
                <Share2 className="w-3 h-3" />
                {copied
                  ? (isAr ? 'تم النسخ!' : 'Copied!')
                  : (isAr ? 'مشاركة' : 'Share')
                }
              </button>
              <WhatsAppShareButton
                variant="minimal"
                url={`/${locale}/krtk/${person.id}`}
                text={
                  isAr
                    ? `بطاقة ${fullName} الرقمية على Cairo Live`
                    : `Check out ${fullName}'s digital business card on Cairo Live`
                }
                locale={locale}
              />
              <button
                onClick={handleDownloadVCard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-text-secondary hover:text-gold hover:bg-gold/[0.06] transition-all duration-200 cursor-pointer"
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
