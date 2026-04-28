'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  views: number;
  shares: number;
  inquiries: number;
  locale: 'en' | 'ar';
}

export default function AnalyticsChart({ views, shares, inquiries, locale }: Props) {
  const isAr = locale === 'ar';

  const data = [
    { name: isAr ? 'مشاهدات' : 'Views',     value: views,     color: '#60a5fa' },
    { name: isAr ? 'مشاركات' : 'Shares',    value: shares,    color: '#4ade80' },
    { name: isAr ? 'استفسارات' : 'Inquiries', value: inquiries, color: '#D4A853' },
  ];

  return (
    <div className="rounded-xl border border-gold/10 bg-surface-elevated p-6">
      <p className="text-sm font-semibold text-text-secondary mb-4">
        {isAr ? 'نظرة عامة' : 'Overview'}
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={48}>
          <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#f5f0e8' }}
            cursor={{ fill: 'rgba(212,168,83,0.06)' }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
