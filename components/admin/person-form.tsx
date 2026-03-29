'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PersonFormProps {
  initialData?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    dateOfBirth: Date | null;
    gender: string;
    bio: string | null;
    profileImageUrl: string | null;
    coverImageUrl: string | null;
    currentPosition: string | null;
    currentCompany: string | null;
    location: string | null;
    tier: string;
    isVerified: boolean;
    isClaimed: boolean;
    linkedinUrl: string | null;
    twitterUrl: string | null;
    instagramUrl: string | null;
    websiteUrl: string | null;
  };
}

export default function PersonForm({ initialData }: PersonFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phoneNumber: initialData?.phoneNumber || '',
    dateOfBirth: initialData?.dateOfBirth
      ? new Date(initialData.dateOfBirth).toISOString().split('T')[0]
      : '',
    gender: initialData?.gender || 'prefer-not-to-say',
    bio: initialData?.bio || '',
    profileImageUrl: initialData?.profileImageUrl || '',
    coverImageUrl: initialData?.coverImageUrl || '',
    currentPosition: initialData?.currentPosition || '',
    currentCompany: initialData?.currentCompany || '',
    location: initialData?.location || '',
    tier: initialData?.tier || 'bronze',
    isVerified: initialData?.isVerified || false,
    isClaimed: initialData?.isClaimed || false,
    linkedinUrl: initialData?.linkedinUrl || '',
    twitterUrl: initialData?.twitterUrl || '',
    instagramUrl: initialData?.instagramUrl || '',
    websiteUrl: initialData?.websiteUrl || '',
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const method = initialData ? 'PUT' : 'POST';
      const url = initialData ? `/api/admin/people/${initialData.id}` : '/api/admin/people';

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

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/people"
          className="p-2 hover:bg-[#1a1a1f] rounded-lg transition-colors"
        >
          <ArrowLeft className="text-gray-400" size={24} />
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-white">
            {initialData ? 'Edit Person' : 'New Person'}
          </h1>
          <p className="text-gray-400">
            {initialData ? 'Update person details' : 'Create a new person'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-900/20 border border-red-700/50 p-4">
            <p className="text-sm font-medium text-red-400">{error}</p>
          </div>
        )}

        <div className="rounded-lg bg-[#1a1a1f] border border-[#D4A853]/10 p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                  placeholder="Last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                  placeholder="Phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
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
            <h3 className="text-lg font-bold text-white mb-4">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Position
                </label>
                <input
                  type="text"
                  value={formData.currentPosition}
                  onChange={(e) => setFormData({ ...formData, currentPosition: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                  placeholder="Job title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Company
                </label>
                <input
                  type="text"
                  value={formData.currentCompany}
                  onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                  placeholder="City or region"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tier</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
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
            <h3 className="text-lg font-bold text-white mb-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Twitter URL
                </label>
                <input
                  type="url"
                  value={formData.twitterUrl}
                  onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Images & Bio */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Images & Bio</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  value={formData.profileImageUrl}
                  onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.coverImageUrl}
                  onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors"
                  placeholder="Write a bio..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Status</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isVerified}
                  onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                  className="w-4 h-4 rounded bg-[#0a0a0f] border border-[#D4A853]/20 accent-[#D4A853]"
                />
                <span className="text-white font-medium">Verified</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isClaimed}
                  onChange={(e) => setFormData({ ...formData, isClaimed: e.target.checked })}
                  className="w-4 h-4 rounded bg-[#0a0a0f] border border-[#D4A853]/20 accent-[#D4A853]"
                />
                <span className="text-white font-medium">Claimed</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 justify-end">
          <Link
            href="/admin/people"
            className="px-4 py-2 rounded-lg border border-[#D4A853]/20 text-white hover:bg-[#1a1a1f] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-[#D4A853] text-[#0a0a0f] font-semibold hover:bg-[#e8b967] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : 'Save Person'}
          </button>
        </div>
      </form>
    </div>
  );
}
