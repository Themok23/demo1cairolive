'use client';

import { useState } from 'react';

interface Props {
  krtkSlug: string;
  personName: string;
  locale: 'en' | 'ar';
}

const t = {
  en: {
    heading: 'Get in touch',
    name: 'Your name',
    email: 'Your email',
    phone: 'Phone (optional)',
    subject: 'Subject (optional)',
    message: 'Message',
    send: 'Send message',
    sending: 'Sending…',
    success: 'Message sent! We\'ll forward it shortly.',
    error: 'Something went wrong. Please try again.',
    namePlaceholder: 'Full name',
    emailPlaceholder: 'you@example.com',
    phonePlaceholder: '+20 10 0000 0000',
    subjectPlaceholder: 'What is this about?',
    messagePlaceholder: 'Write your message here…',
  },
  ar: {
    heading: 'تواصل معنا',
    name: 'اسمك',
    email: 'بريدك الإلكتروني',
    phone: 'رقم الهاتف (اختياري)',
    subject: 'الموضوع (اختياري)',
    message: 'رسالتك',
    send: 'إرسال الرسالة',
    sending: 'جارٍ الإرسال…',
    success: 'تم إرسال رسالتك! سنحيلها قريباً.',
    error: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    namePlaceholder: 'الاسم الكامل',
    emailPlaceholder: 'you@example.com',
    phonePlaceholder: '+20 10 0000 0000',
    subjectPlaceholder: 'عن ماذا يتعلق الأمر؟',
    messagePlaceholder: 'اكتب رسالتك هنا…',
  },
};

export default function InquiryForm({ krtkSlug, personName, locale }: Props) {
  const tx = t[locale];
  const [form, setForm] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ krtkSlug, ...form }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
      } else {
        setErrorMsg(json.error ?? tx.error);
        setStatus('error');
      }
    } catch {
      setErrorMsg(tx.error);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-gold/20 bg-surface-elevated p-6 text-center">
        <p className="text-gold font-medium">{tx.success}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gold/20 bg-surface-elevated p-6">
      <h2 className="text-lg font-semibold text-text-primary mb-1">{tx.heading}</h2>
      <p className="text-sm text-text-secondary mb-5">{personName}</p>

      <form onSubmit={handleSubmit} className="space-y-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={tx.name} required>
            <input
              name="senderName"
              value={form.senderName}
              onChange={handleChange}
              placeholder={tx.namePlaceholder}
              required
              className={inputCls}
            />
          </Field>
          <Field label={tx.email} required>
            <input
              name="senderEmail"
              type="email"
              value={form.senderEmail}
              onChange={handleChange}
              placeholder={tx.emailPlaceholder}
              required
              className={inputCls}
            />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={tx.phone}>
            <input
              name="senderPhone"
              value={form.senderPhone}
              onChange={handleChange}
              placeholder={tx.phonePlaceholder}
              className={inputCls}
            />
          </Field>
          <Field label={tx.subject}>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder={tx.subjectPlaceholder}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label={tx.message} required>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder={tx.messagePlaceholder}
            required
            rows={4}
            className={inputCls + ' resize-none'}
          />
        </Field>

        {status === 'error' && (
          <p className="text-sm text-red-400">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full py-2.5 rounded-lg bg-gold text-background font-medium text-sm hover:bg-gold/90 disabled:opacity-60 transition-colors"
        >
          {status === 'sending' ? tx.sending : tx.send}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs text-text-secondary mb-1 block">
        {label}
        {required && <span className="text-gold ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full rounded-lg border border-gold/10 bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-gold/40 focus:outline-none transition-colors';
