'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
<<<<<<< HEAD
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
=======
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const [email, setEmail] = useState('mokhtar@themok.company');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const callbackUrl: string = searchParams.get('callbackUrl') || `/${locale}/admin`;
<<<<<<< HEAD
  const isAr = locale === 'ar';
=======
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126

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
<<<<<<< HEAD
        setError(result.error || (isAr ? 'فشل تسجيل الدخول' : 'Failed to sign in'));
=======
        setError(result.error || 'Failed to sign in');
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
      } else if (result?.ok) {
        router.push(callbackUrl as any);
      }
    } catch (err) {
<<<<<<< HEAD
      setError(isAr ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
=======
      setError('An unexpected error occurred');
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
    } finally {
      setLoading(false);
    }
  }

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Cairo Live</h1>
          <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
          <p className="mt-2 text-gray-400">Sign in to your admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-900/20 border border-red-700/50 p-4">
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
              <p className="text-sm font-medium text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
<<<<<<< HEAD
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
=======
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1f] border border-[#D4A853]/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A853] transition-colors"
                placeholder="mokhtar@themok.company"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1f] border border-[#D4A853]/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A853] transition-colors"
                placeholder="Enter your password"
              />
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
<<<<<<< HEAD
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
=======
            className="w-full py-3 px-4 rounded-lg bg-[#D4A853] text-[#0a0a0f] font-semibold hover:bg-[#e8b967] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <Link href={`/${locale}`} className="text-sm text-[#D4A853] hover:text-[#e8b967]">
            Back to home
          </Link>
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
