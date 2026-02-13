import type { Metadata } from 'next';
import './globals.css';

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
    <html>
      <body>{children}</body>
    </html>
  );
}