'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { KrtkInquiry } from '@/src/domain/entities/krtkInquiry';
import { ArrowLeft, Send, Archive } from 'lucide-react';
import Link from 'next/link';

interface Props {
  inquiry: KrtkInquiry;
}

export default function AdminInquiryDetail({ inquiry: initial }: Props) {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const [inquiry, setInquiry] = useState(initial);
  const [forwardEmail, setForwardEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function patch(action: string, extra?: object) {
    setBusy(true);
    setMsg('');
    const res = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...extra }),
    });
    const json = await res.json();
    setBusy(false);
    if (json.success) {
      setInquiry(json.data);
      setMsg(action === 'forwarded' ? 'Marked as forwarded.' : 'Done.');
    } else {
      setMsg(json.error ?? 'Error');
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href={`/${locale}/admin/inquiries` as any}
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors"
      >
        <ArrowLeft size={16} /> Back to Inquiries
      </Link>

      <div className="rounded-xl border border-gold/10 bg-surface-elevated p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary">{inquiry.senderName}</h1>
            <p className="text-sm text-text-secondary">{inquiry.senderEmail}</p>
            {inquiry.senderPhone && <p className="text-sm text-text-secondary">{inquiry.senderPhone}</p>}
          </div>
          <span className="text-xs text-text-tertiary">
            {new Date(inquiry.createdAt).toLocaleString('en-GB')}
          </span>
        </div>

        {inquiry.subject && (
          <div>
            <p className="text-xs text-text-tertiary uppercase tracking-wide mb-1">Subject</p>
            <p className="text-text-primary">{inquiry.subject}</p>
          </div>
        )}

        <div>
          <p className="text-xs text-text-tertiary uppercase tracking-wide mb-1">Message</p>
          <p className="text-text-primary whitespace-pre-wrap">{inquiry.message}</p>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-gold/10">
          <span className="text-xs text-text-secondary">Profile:</span>
          <span className="text-xs text-gold font-mono">{inquiry.krtkSlug}</span>
          <span className="text-xs text-text-tertiary ml-2">Status: {inquiry.status}</span>
        </div>
      </div>

      {inquiry.status !== 'archived' && (
        <div className="rounded-xl border border-gold/10 bg-surface p-6 space-y-4">
          <h2 className="font-semibold text-text-primary">Actions</h2>

          <div className="flex items-center gap-3">
            <input
              type="email"
              placeholder="Forward to email…"
              value={forwardEmail}
              onChange={(e) => setForwardEmail(e.target.value)}
              className="flex-1 rounded-lg border border-gold/10 bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-gold/40 focus:outline-none"
            />
            <button
              onClick={() => patch('forwarded', { forwardedTo: forwardEmail })}
              disabled={busy || !forwardEmail}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-background text-sm font-medium hover:bg-gold/90 disabled:opacity-50 transition-colors"
            >
              <Send size={14} /> Forward
            </button>
          </div>

          <button
            onClick={() => patch('archived')}
            disabled={busy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gold/10 text-text-secondary hover:text-text-primary hover:border-gold/30 text-sm transition-colors"
          >
            <Archive size={14} /> Archive
          </button>

          {msg && <p className="text-sm text-text-secondary">{msg}</p>}
        </div>
      )}
    </div>
  );
}
