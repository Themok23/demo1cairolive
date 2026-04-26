'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import BilingualInput from '@/components/ui/BilingualInput';

interface PersonFormProps {
  initialData?: {
    id: string;
    firstNameEn: string;
    firstNameAr?: string | null;
    lastNameEn: string;
    lastNameAr?: string | null;
    bioEn?: string | null;
    bioAr?: string | null;
    currentPositionEn?: string | null;
    currentPositionAr?: string | null;
    currentCompanyEn?: string | null;
    currentCompanyAr?: string | null;
    locationEn?: string | null;
    locationAr?: string | null;
    email: string;
    phoneNumber?: string | null;
    dateOfBirth?: Date | null;
    gender: string;
    profileImageUrl?: string | null;
    coverImageUrl?: string | null;
    tier: string;
    isVerified: boolean;
    isClaimed: boolean;
    linkedinUrl?: string | null;
    twitterUrl?: string | null;
    instagramUrl?: string | null;
    websiteUrl?: string | null;
  };
}

export default function PersonForm({ initialData }: PersonFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstNameEn: initialData?.firstNameEn || '',
    firstNameAr: initialData?.firstNameAr || '',
    lastNameEn:  initialData?.lastNameEn  || '',
    lastNameAr:  initialData?.lastNameAr  || '',
    bioEn: initialData?.bioEn || '',
    bioAr: initialData?.bioAr || '',
    currentPositionEn: initialData?.currentPositionEn || '',
    currentPositionAr: initialData?.currentPositionAr || '',
    currentCompanyEn:  initialData?.currentCompanyEn  || '',
    currentCompanyAr:  initialData?.currentCompanyAr  || '',
    locationEn: initialData?.locationEn || '',
    locationAr: initialData?.locationAr || '',
    email:       initialData?.email       || '',
    phoneNumber: initialData?.phoneNumber || '',
    dateOfBirth: initialData?.dateOfBirth
      ? new Date(initialData.dateOfBirth).toISOString().split('T')[0]
      : '',
    gender:      initialData?.gender      || 'prefer-not-to-say',
    profileImageUrl: initialData?.profileImageUrl || '',
    coverImageUrl:   initialData?.coverImageUrl   || '',
    tier:       initialData?.tier       || 'bronze',
    isVerified: initialData?.isVerified || false,
    isClaimed:  initialData?.isClaimed  || false,
    linkedinUrl:  initialData?.linkedinUrl  || '',
    twitterUrl:   initialData?.twitterUrl   || '',
    instagramUrl: initialData?.instagramUrl || '',
    websiteUrl:   initialData?.websiteUrl   || '',
  });

  function setField<K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const method = initialData ? 'PUT' : 'POST';
      const url    = initialData ? `/api/admin/people/${initialData.id}` : '/api/admin/people';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to save person');
        return;
      }
      router.push('/admin/people');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full px-4 py-2 rounded-lg bg-background border border-gold/20 text-text-primary focus:outline-none focus:border-gold transition-colors';

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/people" className="p-2 hover:bg-surface-elevated rounded-lg transition-colors">
          <ArrowLeft className="text-text-secondary" size={24} />
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-text-primary">
            {initialData ? 'Edit Person' : 'New Person'}
          </h1>
          <p className="text-text-secondary">
            {initialData ? 'Update person details' : 'Create a new person'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-400/40 p-4 dark:bg-red-900/20 dark:border-red-700/50">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="rounded-lg bg-surface-elevated border border-gold/10 p-6 space-y-6">

          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BilingualInput
                label="First Name"
                required
                valueEn={formData.firstNameEn}
                valueAr={formData.firstNameAr}
                onChangeEn={(v) => setField('firstNameEn', v)}
                onChangeAr={(v) => setField('firstNameAr', v)}
                placeholder={{ en: 'First name', ar: 'الاسم الأول' }}
              />
              <BilingualInput
                label="Last Name"
                required
                valueEn={formData.lastNameEn}
                valueAr={formData.lastNameAr}
                onChangeEn={(v) => setField('lastNameEn', v)}
                onChangeAr={(v) => setField('lastNameAr', v)}
                placeholder={{ en: 'Last name', ar: 'اسم العائلة' }}
              />
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Email *</label>
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={formData.email}
                  onChange={(e) => setField('email', e.target.value)}
                  className={inputClass}
                  placeholder="Email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Phone Number</label>
                <input
                  type="tel"
                  dir="ltr"
                  value={formData.phoneNumber}
                  onChange={(e) => setField('phoneNumber', e.target.value)}
                  className={inputClass}
                  placeholder="+20..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Date of Birth</label>
                <input
                  type="date"
                  dir="ltr"
                  value={formData.dateOfBirth}
                  onChange={(e) => setField('dateOfBirth', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setField('gender', e.target.value)}
                  className={inputClass}
                >
                  <option value="prefer-not-to-say">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BilingualInput
                label="Current Position"
                valueEn={formData.currentPositionEn}
                valueAr={formData.currentPositionAr}
                onChangeEn={(v) => setField('currentPositionEn', v)}
                onChangeAr={(v) => setField('currentPositionAr', v)}
                placeholder={{ en: 'Job title', ar: 'المسمى الوظيفي' }}
              />
              <BilingualInput
                label="Current Company"
                valueEn={formData.currentCompanyEn}
                valueAr={formData.currentCompanyAr}
                onChangeEn={(v) => setField('currentCompanyEn', v)}
                onChangeAr={(v) => setField('currentCompanyAr', v)}
                placeholder={{ en: 'Company name', ar: 'اسم الشركة' }}
              />
              <BilingualInput
                label="Location"
                valueEn={formData.locationEn}
                valueAr={formData.locationAr}
                onChangeEn={(v) => setField('locationEn', v)}
                onChangeAr={(v) => setField('locationAr', v)}
                placeholder={{ en: 'City or region', ar: 'المدينة' }}
              />
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Tier</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setField('tier', e.target.value)}
                  className={inputClass}
                >
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                </select>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'linkedinUrl' as const,  label: 'LinkedIn URL',  ph: 'https://linkedin.com/in/...' },
                { key: 'twitterUrl' as const,   label: 'Twitter URL',   ph: 'https://twitter.com/...' },
                { key: 'instagramUrl' as const, label: 'Instagram URL', ph: 'https://instagram.com/...' },
                { key: 'websiteUrl' as const,   label: 'Website',       ph: 'https://example.com' },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-text-primary mb-2">{label}</label>
                  <input
                    type="url"
                    dir="ltr"
                    value={formData[key]}
                    onChange={(e) => setField(key, e.target.value)}
                    className={inputClass}
                    placeholder={ph}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Images & Bio */}
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4">Images & Bio</h3>
            <div className="space-y-6">
              <ImageUpload
                label="Profile Image"
                value={formData.profileImageUrl}
                onChange={(url) => setField('profileImageUrl', url)}
              />
              <ImageUpload
                label="Cover Image"
                value={formData.coverImageUrl}
                onChange={(url) => setField('coverImageUrl', url)}
              />
              <BilingualInput
                label="Bio"
                multiline
                rows={5}
                valueEn={formData.bioEn}
                valueAr={formData.bioAr}
                onChangeEn={(v) => setField('bioEn', v)}
                onChangeAr={(v) => setField('bioAr', v)}
                placeholder={{ en: 'Write a bio...', ar: 'اكتب نبذة...' }}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4">Status</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isVerified}
                  onChange={(e) => setField('isVerified', e.target.checked)}
                  className="w-4 h-4 rounded bg-background border border-gold/20 accent-gold"
                />
                <span className="text-text-primary font-medium">Verified</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isClaimed}
                  onChange={(e) => setField('isClaimed', e.target.checked)}
                  className="w-4 h-4 rounded bg-background border border-gold/20 accent-gold"
                />
                <span className="text-text-primary font-medium">Claimed</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-end">
          <Link
            href="/admin/people"
            className="px-4 py-2 rounded-lg border border-gold/20 text-text-primary hover:bg-surface-elevated transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-gold text-background font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : 'Save Person'}
          </button>
        </div>
      </form>
    </div>
  );
}
