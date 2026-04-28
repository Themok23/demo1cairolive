import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/src/i18n';
import { ThemeProvider } from '@/components/ThemeProvider';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import HtmlAttributeSetter from '@/components/layout/HtmlAttributeSetter';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <>
      <HtmlAttributeSetter lang={locale} dir={dir as 'ltr' | 'rtl'} />
      <NextIntlClientProvider messages={messages} locale={locale}>
        <ThemeProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </ThemeProvider>
      </NextIntlClientProvider>
    </>
  );
}
