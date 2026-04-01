'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import type { Route } from 'next';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const rawCallback = searchParams.get('callbackUrl') || `/${locale}/admin`;
  // Prevent open redirect: only allow relative paths, block protocol-relative URLs
  const callbackUrl = rawCallback.startsWith('/') && !rawCallback.startsWith('//') ? rawCallback : `/${locale}/admin`;
  const isAr = locale === 'ar';

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || (isAr ? 'فشل تسجيل الدخول' : 'Failed to sign in'));
      } else if (result?.ok) {
        router.push(callbackUrl as Route);
      }
    } catch (err) {
      setError(isAr ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/30 bg-gold/5">
            <Lock className="h-8 w-8 text-gold" />
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">Cairo Live</h1>
          <h2 className="text-xl font-semibold text-text-secondary mb-2">
            {isAr ? 'لوحة التحكم الإدارية' : 'Admin Dashboard'}
          </h2>
          <p className="text-sm text-text-secondary">
            {isAr ? 'سجل دخول إلى حسابك الإداري' : 'Sign in to your admin account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-900/20 border border-red-700/50 p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                {isAr ? 'عنوان البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-surface border border-border/50 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition-all"
                  placeholder="mokhtar@themok.company"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                {isAr ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-surface border border-border/50 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition-all"
                  placeholder={isAr ? 'أدخل كلمة المرور' : 'Enter your password'}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gold text-background font-semibold py-3 px-4 hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              <>
                {isAr ? 'دخول' : 'Sign In'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border/30 text-center">
          <p className="text-sm text-text-secondary">
            {isAr ? 'لا تملك حسابا؟' : "Don't have an account?"}{' '}
            <Link href={`/${locale}`} className="text-gold hover:text-gold/80 font-semibold transition-colors">
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-border/30">
          <p className="text-xs text-text-secondary/60 text-center">
            {isAr
              ? 'هذا النموذج محمي بواسطة NextAuth.js. تسجيل الدخول الخاص بك آمن.'
              : 'This form is protected by NextAuth.js. Your login is secure.'}
          </p>
        </div>
      </div>
    </div>
  );
}
