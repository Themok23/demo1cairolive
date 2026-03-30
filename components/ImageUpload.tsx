'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
}

export function ImageUpload({ onUpload, currentImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCountRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Only JPG, PNG, GIF, and WebP images are allowed',
      };
    }
    if (file.size > MAX_SIZE) {
      return {
        valid: false,
        error: 'File size must be less than 10MB',
      };
    }
    return { valid: true };
  };

  const uploadFile = async (file: File) => {
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

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setPreview(data.url);
      onUpload(data.url);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    uploadFile(file);
  }, []);

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
    if (dragCountRef.current === 0) {
      setIsDragging(false);
    }
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
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-amber-500 bg-amber-500/10'
              : 'border-gray-600 bg-gray-900/50 hover:border-amber-500/50'
          }`}
        >
          <Upload className="mx-auto mb-3 text-gray-400" size={32} />
          <p className="text-white font-medium mb-2">Drag and drop your image</p>
          <p className="text-gray-400 text-sm mb-4">
            or{' '}
            <button
              onClick={handleBrowseClick}
              className="text-amber-500 hover:text-amber-400 transition-colors font-medium"
            >
              click to browse
            </button>
          </p>
          <p className="text-gray-500 text-xs">
            JPG, PNG, GIF, or WebP • Max 10MB
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />

          {isLoading && (
            <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-white text-sm">Uploading...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-700 bg-gray-900">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto max-h-64 object-cover"
          />
          <button
            onClick={handleRemove}
            disabled={isLoading}
            className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-900/30 border border-red-700 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
