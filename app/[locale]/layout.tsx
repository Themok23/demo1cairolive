import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/src/i18n';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import ConditionalLayout from '@/components/layout/ConditionalLayout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const notoArabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-arabic', display: 'swap' });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html suppressHydrationWarning dir={dir} lang={locale} className={`${inter.variable} ${notoArabic.variable} dark`}>
      <body suppressHydrationWarning className="bg-background text-text-primary">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
