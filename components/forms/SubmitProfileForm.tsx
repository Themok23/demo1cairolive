'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { isValidEmail } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface SubmitProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  bio?: string;
  currentPosition?: string;
  currentCompany?: string;
  location?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

export default function SubmitProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const t = useTranslations('submit');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmitProfileFormData>();

  const onSubmit = async (data: SubmitProfileFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      if (!isValidEmail(data.email)) {
        setMessage({ type: 'error', text: t('error') });
        return;
      }

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: t('success'),
        });
        reset();
      } else {
        setMessage({ type: 'error', text: result.error || t('error') });
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('error') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          {...register('firstName', { required: true })}
          label={t('firstName')}
          placeholder={t('firstName')}
          error={errors.firstName ? t('firstName') : undefined}
        />
        <Input
          {...register('lastName', { required: true })}
          label={t('lastName')}
          placeholder={t('lastName')}
          error={errors.lastName ? t('lastName') : undefined}
        />
      </div>

      <Input
        {...register('email', { required: true })}
        type="email"
        label={t('email')}
        placeholder="you@example.com"
        error={errors.email ? t('email') : undefined}
      />

      <Input
        {...register('phoneNumber')}
        type="tel"
        label={t('phone')}
        placeholder="+20 1XX XXX XXXX"
      />

      <Input
        {...register('currentPosition')}
        label={t('position')}
        placeholder={t('position')}
      />

      <Input
        {...register('currentCompany')}
        label={t('company')}
        placeholder={t('company')}
      />

      <Input
        {...register('location')}
        label={t('location')}
        placeholder={t('location')}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          {...register('linkedinUrl')}
          type="url"
          label={t('linkedin')}
          placeholder="https://linkedin.com/in/yourprofile"
        />
        <Input
          {...register('twitterUrl')}
          type="url"
          label={t('twitter')}
          placeholder="https://twitter.com/yourhandle"
        />
      </div>

      {message && (
        <div
          className={`rounded-lg p-4 text-sm ${
            message.type === 'success'
              ? 'bg-green-900 bg-opacity-20 text-green-400 border border-green-600'
              : 'bg-red-900 bg-opacity-20 text-red-400 border border-red-600'
          }`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
        {isLoading ? t('submitting') : t('submitButton')}
      </Button>
    </form>
  );
}
