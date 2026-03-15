'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Globe, ShoppingCart, User, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export function Header() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { customer } = useAuth();
  const { itemCount } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toggleLanguage() {
    const nextLocale = locale === 'pt' ? 'ja' : 'pt';
    const clean = pathname.replace(/^\/(pt|ja)/, '');
    router.replace(`/${nextLocale}${clean}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/${locale}/products?q=${encodeURIComponent(q)}`);
      setMobileSearchOpen(false);
    }
  }

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setSearchQuery('');
      setMobileSearchOpen(false);
    }
  }

  // Cart badge component
  const CartBadge = () => (
    <Link href={`/${locale}/cart`} className="relative flex items-center hover:text-orange-600 transition">
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center px-1 animate-[scale-in_0.2s_ease]">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );

  // ────────────────────────────────────────────────
  // MOBILE HEADER
  // ────────────────────────────────────────────────
  const mobileHeader = (
    <header
      className={`lg:hidden fixed top-0 left-0 right-0 z-40 bg-white transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : 'shadow-sm border-b border-gray-100'
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-3 flex-shrink-0">
          <Image
            src="/logo-light.svg"
            alt="Realpan Logo"
            width={140}
            height={40}
            className="h-10 w-auto object-contain"
            priority
        />
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setMobileSearchOpen(o => !o); setTimeout(() => mobileSearchRef.current?.focus(), 100); }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition"
          >
            <Search className="h-5 w-5" />
          </button>
          <CartBadge />
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-600 transition"
          >
            <Globe className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile search bar (expandable) */}
      {mobileSearchOpen && (
        <div className="px-4 pb-3 bg-white border-b border-gray-100">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              ref={mobileSearchRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={locale === 'pt' ? 'Buscar produtos...' : '商品を検索...'}
              className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              autoFocus
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>
      )}
    </header>
  );

  // ────────────────────────────────────────────────
  // DESKTOP HEADER
  // ────────────────────────────────────────────────
  const desktopHeader = (
    <header className="hidden lg:block fixed top-0 left-0 right-0 z-40">
      {/* TOP BAR */}
      <div className="border-b border-gray-200 bg-[#FAF7F2] text-xs">
        <div className="container mx-auto px-4 flex items-center justify-between h-9 text-gray-600">
          <div className="flex gap-6">
            <Link href={`/${locale}/about`} className="hover:text-orange-600 transition">{t('company')}</Link>
            <Link href={`/${locale}/feature`} className="hover:text-orange-600 transition">{t('kodawari')}</Link>
            <Link href={`/${locale}/services`} className="hover:text-orange-600 font-medium transition">
              {locale === 'pt' ? 'Para Empresas' : '法人のお客様'}
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 hover:text-orange-600 transition"
            >
              <Globe className="h-3.5 w-3.5" />
              {locale === 'pt' ? '日本語' : 'Português'}
            </button>
            <Link href={`/${locale}/contact`} className="hover:text-orange-600 transition">
              {t('contact')}
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN BAR */}
      <div className={`transition-all duration-300 bg-white ${scrolled ? 'shadow-md h-16' : 'shadow-sm h-20'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between h-full">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/logo-light.svg"
              alt="Realpan Logo"
              width={140}
              height={40}
              className="h-10 w-auto object-contain"
              priority
          />
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={locale === 'pt' ? 'Buscar produtos...' : '商品を検索...'}
                className="w-full rounded-full border border-gray-300 bg-[#FAF7F2] px-5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 focus:bg-white transition"
              />
              {searchQuery ? (
                <button type="button" onClick={() => setSearchQuery('')}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              ) : null}
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5 text-sm text-gray-700">
            <Link href={customer ? `/${locale}/account` : `/${locale}/login`} className="flex items-center gap-1.5 hover:text-orange-600 transition">
              <User className="h-4 w-4" />
              <span className="hidden xl:inline">{locale === 'pt' ? 'Conta' : 'アカウント'}</span>
            </Link>
            <CartBadge />
          </div>
        </div>
      </div>

      {/* PRODUCT NAV */}
      <div className="bg-[#E8F5F0] border-t border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 flex items-center gap-8 h-11 text-sm text-gray-700">
          <Link href={`/${locale}/products`} className="hover:text-orange-600 font-medium transition">{t('products')}</Link>
          <Link href={`/${locale}/gifts`} className="hover:text-orange-600 transition">{t('gifts')}</Link>
          <Link href={`/${locale}/services`} className="hover:text-orange-600 transition">
            {locale === 'pt' ? 'Serviços B2B' : 'サービス'}
          </Link>
          <Link href={`/${locale}/news`} className="hover:text-orange-600 transition">{t('news')}</Link>
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