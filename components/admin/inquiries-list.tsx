'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { KrtkInquiry } from '@/src/domain/entities/krtkInquiry';
import { Inbox } from 'lucide-react';

interface Props {
  inquiries: KrtkInquiry[];
  total: number;
}

const statusColors: Record<KrtkInquiry['status'], string> = {
  new: 'text-gold bg-gold/10 border border-gold/20',
  read: 'text-text-secondary bg-surface border border-gold/10',
  forwarded: 'text-green-400 bg-green-500/10 border border-green-500/20',
  archived: 'text-text-tertiary bg-surface border border-gold/5',
};

export default function AdminInquiriesList({ inquiries, total }: Props) {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Inquiries</h1>
          <p className="text-sm text-text-secondary mt-1">{total} total</p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-secondary gap-3">
          <Inbox size={40} className="opacity-30" />
          <p>No inquiries yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-gold/10 rounded-xl border border-gold/10 overflow-hidden">
          {inquiries.map((inq) => (
            <Link
              key={inq.id}
              href={`/${locale}/admin/inquiries/${inq.id}` as any}
              className="flex items-start gap-4 p-4 bg-surface hover:bg-surface-elevated transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-text-primary truncate">{inq.senderName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[inq.status]}`}>
                    {inq.status}
                  </span>
                </div>
                <p className="text-xs text-text-secondary truncate">{inq.senderEmail}</p>
                {inq.subject && <p className="text-sm text-text-secondary mt-1 truncate">{inq.subject}</p>}
                <p className="text-sm text-text-tertiary mt-0.5 truncate">{inq.message}</p>
              </div>
              <p className="text-xs text-text-tertiary whitespace-nowrap shrink-0 pt-0.5">
                {new Date(inq.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
