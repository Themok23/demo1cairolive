'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { isValidEmail } from '@/lib/utils';

interface SubscribeFormData {
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function SubscribeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscribeFormData>();

  const onSubmit = async (data: SubscribeFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      if (!isValidEmail(data.email)) {
        setMessage({ type: 'error', text: 'Please enter a valid email address' });
        return;
      }

      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Successfully subscribed! Check your email for confirmation.' });
        reset();
      } else {
        setMessage({ type: 'error', text: result.error || 'Subscription failed' });
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
          {...register('firstName')}
          label="First Name (Optional)"
          placeholder="Your first name"
        />
        <Input
          {...register('lastName')}
          label="Last Name (Optional)"
          placeholder="Your last name"
        />
      </div>

      <Input
        {...register('email', { required: 'Email is required' })}
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        error={errors.email?.message}
      />

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
        Subscribe Now
      </Button>
    </form>
  );
}
