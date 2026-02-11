'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="border-t border-[#e7e1d9] bg-[#fbf8f4] text-[#4a3f35]">
      <div className="container-custom py-14">
        <div className="grid gap-10 md:grid-cols-4">
          
          {/* Logo + empresa */}
          <div className="md:col-span-2">
            <Image
              src="/logo.webp"
              alt="Real Pan Real Sabor"
              width={240}
              height={60}
            />

            <p className="mt-4 text-sm leading-relaxed text-[#6b5f52]">
              {t('tagline')}
            </p>

            <div className="mt-4 text-sm text-[#6b5f52]">
              <p>株式会社リアルパン</p>
              <p>静岡県浜松市中央区高塚町1620</p>
              <p>TEL: 053-570-2555</p>
            </div>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-[#3f342b]">
              {t('company')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/about`} className="hover:underline">
                  {t('links.about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products`} className="hover:underline">
                  {t('links.products')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services`} className="hover:underline">
                  {t('links.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-[#3f342b]">
              {t('legal')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/privacy`} className="hover:underline">
                  {t('links.privacy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="hover:underline">
                  {t('links.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-[#e7e1d9] pt-6 text-center text-xs text-[#7a6f63]">
          © 2026 Real Pan Real Sabor. {t('rights')}
        </div>
      </div>
    </footer>
  );
}