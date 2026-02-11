import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-ja',
});

type Props = {
  children: ReactNode;
  params: { locale: 'pt' | 'ja' };
};

export function generateStaticParams() {
  return [{ locale: 'pt' }, { locale: 'ja' }];
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  // ✅ ESTE é o modo que você confirmou que FUNCIONA
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${
        locale === 'ja' ? notoSansJP.variable : ''
      }`}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}