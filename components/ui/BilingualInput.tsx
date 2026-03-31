'use client';

import { useState } from 'react';

type Lang = 'en' | 'ar';

interface BilingualInputProps {
  label: string;
  valueEn: string;
  valueAr: string;
  onChangeEn: (v: string) => void;
  onChangeAr: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  placeholder?: { en?: string; ar?: string };
  className?: string;
}

const tabClass = (active: boolean) =>
  `px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
    active ? 'bg-[#D4A853] text-[#0a0a0f]' : 'text-gray-400 hover:text-white'
  }`;

const inputClass =
  'w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#D4A853]/20 text-white focus:outline-none focus:border-[#D4A853] transition-colors';

export default function BilingualInput({
  label,
  valueEn,
  valueAr,
  onChangeEn,
  onChangeAr,
  multiline = false,
  rows = 3,
  required = false,
  placeholder,
  className = '',
}: BilingualInputProps) {
  const [lang, setLang] = useState<Lang>('en');

  const isEmpty = (v: string) => !v.trim();
  const enMissing = isEmpty(valueEn);
  const arMissing = isEmpty(valueAr);

  const sharedProps = {
    dir: lang === 'ar' ? ('rtl' as const) : ('ltr' as const),
    lang,
    value: lang === 'en' ? valueEn : valueAr,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      lang === 'en' ? onChangeEn(e.target.value) : onChangeAr(e.target.value),
    required: required && lang === 'en',
    placeholder: lang === 'en' ? (placeholder?.en || '') : (placeholder?.ar || ''),
    className: inputClass,
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label row + language tab switcher */}
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <div className="flex items-center gap-1 bg-[#111115] rounded-lg p-1">
          <button type="button" onClick={() => setLang('en')} className={tabClass(lang === 'en')}>
            EN{enMissing ? <span className="text-red-400 ml-0.5">·</span> : null}
          </button>
          <button type="button" onClick={() => setLang('ar')} className={tabClass(lang === 'ar')}>
            AR{arMissing ? <span className="text-amber-400 ml-0.5">·</span> : null}
          </button>
        </div>
      </div>

      {multiline ? (
        <textarea {...sharedProps} rows={rows} />
      ) : (
        <input type="text" {...sharedProps} />
      )}

      {/* Completion status */}
      <div className="flex gap-3 mt-1">
        <span className={`text-xs ${enMissing ? 'text-gray-500' : 'text-emerald-500'}`}>
          {enMissing ? '○ EN empty' : '✓ EN'}
        </span>
        <span className={`text-xs ${arMissing ? 'text-amber-500' : 'text-emerald-500'}`}>
          {arMissing ? '○ AR empty' : '✓ AR'}
        </span>
      </div>
    </div>
  );
}
