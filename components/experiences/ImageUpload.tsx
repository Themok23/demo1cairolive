'use client';

import { useRef, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  isAr?: boolean;
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

const t = (isAr: boolean, en: string, ar: string) => (isAr ? ar : en);

export default function ExperienceImageUpload({ value, onChange, isAr = false }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const dragCount = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    if (!ACCEPTED.includes(file.type)) {
      setError(t(isAr, 'Only JPG, PNG, or WebP images allowed.', 'يُسمح فقط بصور JPG أو PNG أو WebP.'));
      return;
    }
    if (file.size > MAX_SIZE) {
      setError(t(isAr, 'File must be under 5 MB.', 'يجب أن يكون حجم الملف أقل من 5 ميجابايت.'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/public/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      onChange(data.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t(isAr, 'Upload failed. Try again.', 'فشل الرفع. حاول مرة أخرى.'));
    } finally {
      setLoading(false);
    }
  }

  function onDragEnter(e: React.DragEvent) {
    e.preventDefault(); e.stopPropagation();
    dragCount.current += 1;
    setDragging(true);
  }
  function onDragLeave(e: React.DragEvent) {
    e.preventDefault(); e.stopPropagation();
    dragCount.current -= 1;
    if (dragCount.current === 0) setDragging(false);
  }
  function onDragOver(e: React.DragEvent) { e.preventDefault(); e.stopPropagation(); }
  function onDrop(e: React.DragEvent) {
    e.preventDefault(); e.stopPropagation();
    dragCount.current = 0; setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }

  function remove() {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="w-full">
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-gold/20 bg-surface group">
          <img src={value} alt="cover preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold text-background text-xs font-semibold hover:bg-gold/90 transition-colors"
            >
              <Upload size={13} />
              {t(isAr, 'Change', 'تغيير')}
            </button>
            <button
              type="button"
              onClick={remove}
              className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={() => !loading && inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 h-36 ${
            dragging
              ? 'border-gold bg-gold/8 scale-[1.01]'
              : 'border-gold/20 bg-surface hover:border-gold/40 hover:bg-gold/5'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${dragging ? 'bg-gold/20' : 'bg-gold/10'}`}>
            <ImageIcon size={18} className="text-gold" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-text-primary">
              {t(isAr, 'Drop image here or ', 'اسحب الصورة هنا أو ')}
              <span className="text-gold underline underline-offset-2">
                {t(isAr, 'browse', 'تصفح')}
              </span>
            </p>
            <p className="text-xs text-text-secondary mt-0.5">JPG · PNG · WebP · {t(isAr, 'max 5 MB', 'الحد الأقصى 5 ميجا')}</p>
          </div>

          {loading && (
            <div className="absolute inset-0 rounded-xl bg-surface/80 backdrop-blur-sm flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-text-secondary">{t(isAr, 'Uploading…', 'جارٍ الرفع…')}</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        onChange={(e) => { if (e.target.files?.[0]) upload(e.target.files[0]); }}
        className="hidden"
      />

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
