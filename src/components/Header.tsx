'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Globe, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export function Header() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* =======================
     SCROLL EFFECT
  ======================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* =======================
     NAVIGATION
  ======================= */
  const navigation = [
    { name: t('kodawari'), href: 'feature' },
    { name: t('products'), href: 'products' },
    { name: t('services'), href: 'services' },
    { name: t('orderGuide'), href: 'order-guide' },
    { name: t('company'), href: 'about' },
    { name: t('news'), href: 'news' },
  ];

  /* =======================
     LANGUAGE SWITCH
  ======================= */
  function toggleLanguage() {
    const nextLocale = locale === 'pt' ? 'ja' : 'pt';

    // remove /pt ou /ja do início
    const pathnameWithoutLocale = pathname.replace(/^\/(pt|ja)/, '');

    router.replace(`/${nextLocale}${pathnameWithoutLocale}`);
  }

  return (
    <header className="fixed top-0 z-50 w-full">
      {/* TOP BAR */}
      <div className="hidden sm:block border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="container-custom flex h-12 items-center justify-end gap-4 text-sm text-neutral-700">
          <Link
            href={`/${locale}/order/business`}
            className="font-medium hover:text-primary-600"
          >
            {t('orderBusiness')}
          </Link>

          <Link
            href={`/${locale}/order/individual`}
            className="font-medium hover:text-primary-600"
          >
            {t('orderIndividual')}
          </Link>

          <Link
            href={`/${locale}/contact`}
            className="flex items-center gap-1 font-semibold text-accent-600 hover:text-accent-700"
          >
            <Mail className="h-4 w-4" />
            {t('contact')}
          </Link>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-sm'
            : 'bg-black/30 backdrop-blur-md'
        }`}
      >
        <div className="container-custom">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href={`/${locale}`} aria-label="Real Pan Home">
              <Image
                src="/logo.webp"
                alt="Real Pan"
                width={260}
                height={60}
                priority
              />
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={`/${locale}/${item.href}`}
                  className={`text-sm font-medium transition-colors ${
                    scrolled
                      ? 'text-neutral-700 hover:text-primary-600'
                      : 'text-white hover:text-primary-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Language switch */}
              <button
                onClick={toggleLanguage}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                  scrolled
                    ? 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                    : 'border-white/40 text-white hover:bg-white/10'
                }`}
                aria-label="Change language"
              >
                <Globe className="h-4 w-4" />
                {locale === 'pt' ? '日本語' : 'PT'}
              </button>

              {/* Contact button */}
              <Link
                href={`/${locale}/contact`}
                className="btn-primary"
              >
                {t('contact')}
              </Link>
            </nav>

            {/* Mobile */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 text-white"
              aria-label="Open menu"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}