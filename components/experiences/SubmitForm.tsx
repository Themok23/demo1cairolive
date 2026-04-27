'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ExperienceImageUpload from '@/components/experiences/ImageUpload';

interface Props {
  locale: 'en' | 'ar';
}

type FormState = {
  type: string;
  titleEn: string;
  summaryEn: string;
  contentEn: string;
  coverImageUrl: string;
  submittedByName: string;
  submittedByEmail: string;
  honeypot: string;
};

const blank: FormState = {
  type: 'visit', titleEn: '', summaryEn: '', contentEn: '',
  coverImageUrl: '', submittedByName: '', submittedByEmail: '', honeypot: '',
};

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 180);
}

export default function SubmitForm({ locale }: Props) {
  const isAr = locale === 'ar';
  const router = useRouter();
  const [form, setForm] = useState<FormState>(blank);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.honeypot) return;
    setSaving(true); setErr('');
    try {
      const slug = slugify(form.titleEn) + '-' + Date.now().toString(36);
      const res = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          type: form.type,
          titleEn: form.titleEn,
          summaryEn: form.summaryEn || null,
          contentEn: form.contentEn,
          coverImageUrl: form.coverImageUrl || null,
          submittedByName: form.submittedByName,
          submittedByEmail: form.submittedByEmail,
        }),
      });
      const json = await res.json();
      if (json.success) {
        router.push(`/${locale}/experiences/submitted` as any);
      } else {
        setErr(json.error ?? 'Submission failed');
      }
    } catch {
      setErr('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const inputCls = 'w-full rounded-lg border border-gold/10 bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-gold/40 focus:outline-none transition-colors';
  const labelCls = 'text-xs font-medium text-text-secondary mb-1.5 block';

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        value={form.honeypot}
        onChange={(e) => set('honeypot', e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Experience Type */}
      <label className="block">
        <span className={labelCls}>{isAr ? 'نوع التجربة *' : 'Experience Type *'}</span>
        <select value={form.type} onChange={(e) => set('type', e.target.value)} className={inputCls}>
          <option value="visit">{isAr ? 'زيارة' : 'Visit'}</option>
          <option value="book_review">{isAr ? 'مراجعة كتاب' : 'Book Review'}</option>
          <option value="trip">{isAr ? 'رحلة' : 'Trip'}</option>
          <option value="event">{isAr ? 'فعالية' : 'Event'}</option>
        </select>
      </label>

      {/* Title */}
      <label className="block">
        <span className={labelCls}>{isAr ? 'العنوان *' : 'Title *'}</span>
        <input
          required
          value={form.titleEn}
          onChange={(e) => set('titleEn', e.target.value)}
          maxLength={280}
          placeholder={isAr ? 'عنوان تجربتك' : 'Title of your experience'}
          className={inputCls}
        />
      </label>

      {/* Cover Image Upload */}
      <div>
        <span className={labelCls}>{isAr ? 'صورة الغلاف' : 'Cover Image'}</span>
        <ExperienceImageUpload
          value={form.coverImageUrl}
          onChange={(url) => set('coverImageUrl', url)}
          isAr={isAr}
        />
      </div>

      {/* Summary */}
      <label className="block">
        <span className={labelCls}>{isAr ? 'ملخص قصير' : 'Short Summary'}</span>
        <input
          value={form.summaryEn}
          onChange={(e) => set('summaryEn', e.target.value)}
          maxLength={500}
          placeholder={isAr ? 'جملة أو اثنتان عن تجربتك' : 'One or two sentences about your experience'}
          className={inputCls}
        />
      </label>

      {/* Full Content */}
      <label className="block">
        <span className={labelCls}>{isAr ? 'المحتوى الكامل *' : 'Full Content *'}</span>
        <textarea
          required
          value={form.contentEn}
          onChange={(e) => set('contentEn', e.target.value)}
          rows={8}
          minLength={20}
          maxLength={10000}
          placeholder={isAr ? 'اكتب تجربتك بالتفصيل…' : 'Write your experience in detail…'}
          className={inputCls + ' resize-y'}
        />
      </label>

      {/* Name + Email */}
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className={labelCls}>{isAr ? 'اسمك *' : 'Your Name *'}</span>
          <input
            required
            value={form.submittedByName}
            onChange={(e) => set('submittedByName', e.target.value)}
            maxLength={200}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className={labelCls}>{isAr ? 'بريدك الإلكتروني *' : 'Your Email *'}</span>
          <input
            required
            type="email"
            value={form.submittedByEmail}
            onChange={(e) => set('submittedByEmail', e.target.value)}
            maxLength={200}
            className={inputCls}
          />
        </label>
      </div>

      {err && <p className="text-sm text-red-400">{err}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 rounded-xl bg-gold text-background font-semibold hover:bg-gold/90 disabled:opacity-50 transition-colors"
      >
        {saving
          ? (isAr ? 'جارٍ الإرسال…' : 'Submitting…')
          : (isAr ? 'إرسال التجربة' : 'Submit Experience')}
      </button>
    </form>
  );
}
