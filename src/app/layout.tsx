import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://realpan.co.jp'),
  title: {
    default: 'Real Pan',
    template: '%s | Real Pan',
  },
  description: 'Distribuição de pães premium no Japão.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
