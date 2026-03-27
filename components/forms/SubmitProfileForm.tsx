'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { isValidEmail } from '@/lib/utils';

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
        setMessage({ type: 'error', text: 'Please enter a valid email address' });
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
          text: 'Profile submitted successfully! Our team will review it shortly.',
        });
        reset();
      } else {
        setMessage({ type: 'error', text: result.error || 'Submission failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          {...register('firstName', { required: 'First name is required' })}
          label="First Name"
          placeholder="Your first name"
          error={errors.firstName?.message}
        />
        <Input
          {...register('lastName', { required: 'Last name is required' })}
          label="Last Name"
          placeholder="Your last name"
          error={errors.lastName?.message}
        />
      </div>

      <Input
        {...register('email', { required: 'Email is required' })}
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        error={errors.email?.message}
      />

      <Input
        {...register('phoneNumber')}
        type="tel"
        label="Phone Number (Optional)"
        placeholder="+20 1XX XXX XXXX"
      />

      <Input
        {...register('currentPosition')}
        label="Current Position (Optional)"
        placeholder="e.g., Senior Software Engineer"
      />

      <Input
        {...register('currentCompany')}
        label="Current Company (Optional)"
        placeholder="e.g., Tech Company Inc."
      />

      <Input
        {...register('location')}
        label="Location (Optional)"
        placeholder="City, Country"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          {...register('linkedinUrl')}
          type="url"
          label="LinkedIn URL (Optional)"
          placeholder="https://linkedin.com/in/yourprofile"
        />
        <Input
          {...register('twitterUrl')}
          type="url"
          label="Twitter URL (Optional)"
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
        Submit Profile
      </Button>
    </form>
  );
}
