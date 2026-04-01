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
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html suppressHydrationWarning dir={dir} lang={locale} className={`${inter.variable} ${notoArabic.variable}`}>
      <head>
        {/* Inline theme script in <head> — React 19 executes scripts placed here
            before hydration, preventing flash of wrong theme (FART). */}
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=(t==='light'||t==='dark')?t:(t==='system'?(m?'dark':'light'):'dark');document.documentElement.classList.add(resolved);}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning className="bg-background text-text-primary transition-colors duration-300">
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
