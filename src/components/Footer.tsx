'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="bg-gradient-to-b from-primary-900 to-primary-800 text-white pb-20 lg:pb-0">

      {/* Linha dourada superior */}
      <div className="h-[3px] bg-accent-400 w-full" />

      <div className="container-custom py-14">

        <div className="grid gap-12 md:grid-cols-3 items-start">

          {/* LOGO + INFO */}
          <div className="space-y-6 max-w-sm">

            <Image
              src="/logo.webp"
              alt="Real Pan Real Sabor"
              width={180}
              height={48}
              className="object-contain"
            />

            <p className="text-sm text-white/80 leading-relaxed">
              {t('tagline')}
            </p>

            <div className="text-sm text-white/60 space-y-1">
              <p>株式会社リアルパン</p>
              <p>〒435-0016 静岡県浜松市中央区高塚町1620</p>
              <p>TEL 053-570-2555</p>
            </div>

            {/* SOCIAL */}
            <div className="flex items-center gap-4 pt-2">

              <a
                href="https://www.instagram.com/realpan_realsabor/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full 
                                bg-white/10 border border-white/10
                                transition-all duration-300
                                group-hover:bg-accent-400
                                group-hover:scale-110
                                group-hover:shadow-lg">
                  <Instagram className="h-5 w-5 text-white group-hover:text-primary-900 transition-colors duration-300" />
                </div>
              </a>

              <a
                href="https://www.facebook.com/michiko.servi"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full 
                                bg-white/10 border border-white/10
                                transition-all duration-300
                                group-hover:bg-accent-400
                                group-hover:scale-110
                                group-hover:shadow-lg">
                  <Facebook className="h-5 w-5 text-white group-hover:text-primary-900 transition-colors duration-300" />
                </div>
              </a>

            </div>
          </div>

          {/* EMPRESA */}
          <div>
            <h3 className="text-sm font-semibold text-accent-300 mb-5 tracking-wide">
              {t('company')}
            </h3>

            <ul className="space-y-3 text-sm">
              {[
                { href: 'about', label: t('links.about') },
                { href: 'products', label: t('links.products') },
                { href: 'services', label: t('links.contact') },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${locale}/${item.href}`}
                    className="relative text-white/70 transition duration-300 hover:text-accent-400"
                  >
                    <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-accent-400 after:transition-all after:duration-300 hover:after:w-full">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="text-sm font-semibold text-accent-300 mb-5 tracking-wide">
              {t('legal')}
            </h3>

            <ul className="space-y-3 text-sm">
              {[
                { href: 'privacy', label: t('links.privacy') },
                { href: 'terms', label: t('links.terms') },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${locale}/${item.href}`}
                    className="relative text-white/70 transition duration-300 hover:text-accent-400"
                  >
                    <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-accent-400 after:transition-all after:duration-300 hover:after:w-full">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* DIVISÓRIA */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          © 2026 Real Pan Co., Ltd. {t('rights')}
        </div>

      </div>
    </footer>
  );
}