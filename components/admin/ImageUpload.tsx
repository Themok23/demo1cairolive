'use client';

import { useRef, useState } from 'react';
import { Upload, X, Link } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  className?: string;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, GIF, and WebP images are allowed' };
  }
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }
  return { valid: true };
}

export default function ImageUpload({ value, onChange, label, className = '' }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCountRef = useRef(0);

  // No internal "preview" state — value prop is the single source of truth.
  const preview = value;

  async function uploadFile(file: File) {
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', { method: 'POST', body: formData });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      onChange(data.url); // call parent directly — no stale closure
      setShowUrlInput(false);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // No useCallback([]) — uploadFile and onChange are stable enough for this use case.
  function handleFileSelect(file: File) {
    uploadFile(file);
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current -= 1;
    if (dragCountRef.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current = 0;
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileSelect(files[0]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      setError('Please enter a valid URL');
      return;
    }
    try {
      new URL(urlInput);
      onChange(urlInput);
      setShowUrlInput(false);
      setUrlInput('');
      setError(null);
    } catch {
      setError('Please enter a valid URL');
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-white mb-3">{label}</label>

      {!preview ? (
        <>
          {!showUrlInput ? (
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-[#D4A853] bg-[#D4A853]/10'
                  : 'border-[#D4A853]/20 bg-[#0a0a0f] hover:border-[#D4A853]/40'
              }`}
            >
              <Upload className="mx-auto mb-3 text-gray-400" size={32} />
              <p className="text-white font-medium mb-2">Drag and drop your image here</p>
              <p className="text-gray-300 text-sm mb-4">
                or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#D4A853] hover:text-[#D4A853]/80 transition-colors font-medium"
                >
                  click to browse
                </button>
              </p>
              <p className="text-gray-400 text-xs mb-4">JPG, PNG, GIF, or WebP (max 10MB)</p>

              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="inline-flex items-center gap-2 text-[#D4A853] hover:text-[#D4A853]/80 transition-colors text-sm font-medium"
              >
                <Link size={16} />
                Or paste a URL
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                onChange={handleFileInputChange}
                className="hidden"
              />

              {isLoading && (
                <div className="absolute inset-0 bg-[#0a0a0f]/80 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-white text-sm">Uploading...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="border-2 border-[#D4A853]/20 rounded-lg p-6 bg-[#0a0a0f]">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  dir="ltr"
                  placeholder="Enter image URL"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleUrlSubmit(); }}
                  className="flex-1 bg-[#0a0a0f] border border-[#D4A853]/20 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4A853]/40 transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-[#D4A853] hover:bg-[#D4A853]/90 text-[#0a0a0f] font-medium rounded transition-colors disabled:opacity-50"
                >
                  Apply URL
                </button>
                <button
                  type="button"
                  onClick={() => { setShowUrlInput(false); setUrlInput(''); setError(null); }}
                  className="flex-1 px-4 py-2 bg-[#0a0a0f] border border-[#D4A853]/20 hover:border-[#D4A853]/40 text-white rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-[#D4A853]/20 bg-[#0a0a0f]">
          <img src={preview} alt="Preview" className="w-full h-auto max-h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-between p-3">
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              disabled={isLoading}
              className="p-2 bg-[#D4A853]/80 hover:bg-[#D4A853] rounded text-[#0a0a0f] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Link size={16} />
              <span className="text-sm font-medium">Change</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isLoading}
              className="p-2 bg-red-600/80 hover:bg-red-600 rounded text-white transition-colors disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
