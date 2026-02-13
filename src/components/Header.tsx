'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Globe, ShoppingCart, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const CART_COUNT = 0; // TODO: estado global de carrinho

export function Header() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha menu ao trocar de rota
  // Fecha drawer ao trocar de rota (BottomNav gerencia seu próprio estado)

  function toggleLanguage() {
    const nextLocale = locale === 'pt' ? 'ja' : 'pt';
    const clean = pathname.replace(/^\/(pt|ja)/, '');
    router.replace(`/${nextLocale}${clean}`);
  }

  // ────────────────────────────────────────────────
  // MOBILE HEADER  (oculto em lg+)
  // ────────────────────────────────────────────────
  const mobileHeader = (
    <header
      className={`lg:hidden fixed top-0 left-0 right-0 z-40 bg-white transition-shadow duration-200
        ${scrolled ? 'shadow-md' : 'shadow-sm border-b border-neutral-100'}`}
    >
      <div className="flex h-14 items-center gap-2.5 px-3">

        {/* Logo */}
        <Link href={`/${locale}`} className="flex-shrink-0">
          <Image
            src="/logo.webp"
            alt="Real Pan"
            width={90}
            height={28}
            priority
            className="h-7 w-auto"
          />
        </Link>

        {/* Search bar — flex-1 */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={locale === 'pt' ? 'Buscar produtos...' : '商品を検索...'}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`w-full rounded-full border bg-neutral-50 py-2 pl-4 pr-10 text-sm outline-none transition-all
              ${searchFocused
                ? 'border-primary-400 ring-2 ring-primary-400/20 bg-white'
                : 'border-neutral-200'}`}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        </div>

        {/* Language toggle */}
        <button
          onClick={toggleLanguage}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition"
        >
          <Globe className="h-4 w-4" />
        </button>

      </div>
    </header>
  );

  // ────────────────────────────────────────────────
  // DESKTOP HEADER  (oculto em mobile)
  // ────────────────────────────────────────────────
  const desktopHeader = (
    <header className="hidden lg:block fixed top-0 left-0 right-0 z-40">

      {/* ── TOP BAR ── */}
      <div className="border-b border-neutral-200 bg-neutral-50 text-xs">
        <div className="container-custom flex items-center justify-between h-9 text-neutral-600">

          <div className="flex gap-6">
            <Link href={`/${locale}/about`}   className="hover:text-primary-700 transition">{t('company')}</Link>
            <Link href={`/${locale}/feature`} className="hover:text-primary-700 transition">{t('kodawari')}</Link>
            <Link href={`/${locale}/services`} className="hover:text-primary-700 font-medium transition">
              {locale === 'pt' ? 'Para Empresas' : '法人のお客様'}
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 hover:text-primary-700 transition"
            >
              <Globe className="h-3.5 w-3.5" />
              {locale === 'pt' ? '日本語' : 'Português'}
            </button>
            <Link href={`/${locale}/contact`} className="hover:text-primary-700 transition">
              {t('contact')}
            </Link>
          </div>

        </div>
      </div>

      {/* ── MAIN BAR ── */}
      <div
        className={`transition-all duration-300 bg-white ${
          scrolled ? 'shadow-md h-14' : 'shadow-sm h-16'
        }`}
      >
        <div className="container-custom flex items-center justify-between h-full">

          {/* Logo */}
          <Link href={`/${locale}`}>
            <Image
              src="/logo.webp"
              alt="Real Pan Real Sabor"
              width={180}
              height={40}
              priority
              className={`w-auto transition-all duration-300 ${scrolled ? 'h-8' : 'h-9'}`}
            />
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder={locale === 'pt' ? 'Buscar produtos...' : '商品を検索...'}
                className="w-full rounded-full border border-neutral-300 bg-neutral-50 px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 focus:bg-white transition"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5 text-sm text-neutral-700">
            <Link href="#account" className="flex items-center gap-1.5 hover:text-primary-700 transition">
              <User className="h-4 w-4" />
              <span className="hidden xl:inline">{locale === 'pt' ? 'Conta' : 'アカウント'}</span>
            </Link>
            <Link href="#cart" className="relative flex items-center hover:text-primary-700 transition">
              <ShoppingCart className="h-5 w-5" />
              {CART_COUNT > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-accent-400 text-primary-900 text-[10px] font-bold flex items-center justify-center px-1">
                  {CART_COUNT}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>

      {/* ── PRODUCT NAV ── */}
      <div className="bg-white border-t border-neutral-100 shadow-sm">
        <div className="container-custom flex items-center gap-8 h-11 text-sm text-neutral-700">
          <Link href={`/${locale}/products`}   className="hover:text-primary-700 font-medium transition">{t('products')}</Link>
          <Link href={`/${locale}/services`}   className="hover:text-primary-700 transition">{locale === 'pt' ? 'Serviços B2B' : 'サービス'}</Link>
          <Link href={`/${locale}/order-guide`}className="hover:text-primary-700 transition">{t('orderGuide')}</Link>
          <Link href={`/${locale}/news`}       className="hover:text-primary-700 transition">{t('news')}</Link>
        </div>
      </div>

    </header>
  );

  return (
    <>
      {mobileHeader}
      {desktopHeader}
    </>
  );
}
