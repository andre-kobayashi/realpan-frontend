'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search, ShoppingCart, User, X, Menu,
  ChevronRight, LogOut, Home,
  Package, Gift, Info, Star, Headphones,
  ClipboardList, Building2,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

type MenuLink = {
  icon: React.ElementType;
  labelPt: string;
  labelJa: string;
  href: string;
  accent?: boolean;
};

export function Header() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { customer, logout } = useAuth();
  const { itemCount, total } = useCart();

  const isLoggedIn = !!customer;
  const otherLocale = locale === 'pt' ? 'ja' : 'pt';

  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  function switchLanguage() {
    const clean = pathname.replace(/^\/(pt|ja)/, '');
    router.replace(`/${otherLocale}${clean}`);
    setDrawerOpen(false);
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

  const menuLinks: MenuLink[] = [
    { icon: Home,          labelPt: 'Início',            labelJa: 'ホーム',        href: `/${locale}` },
    { icon: Package,       labelPt: 'Produtos',          labelJa: '商品一覧',      href: `/${locale}/products` },
    { icon: Gift,          labelPt: 'Kits Premium',      labelJa: 'キット',        href: `/${locale}/kits` },
    { icon: Star,          labelPt: 'Nosso Diferencial', labelJa: 'こだわり',      href: `/${locale}/feature` },
    { icon: Building2,     labelPt: 'Serviços / B2B',    labelJa: 'サービス',      href: `/${locale}/services`, accent: true },
    { icon: Info,          labelPt: 'A Empresa',         labelJa: '会社案内',      href: `/${locale}/about` },
    { icon: ClipboardList, labelPt: 'Guia de Pedidos',   labelJa: '注文ガイド',    href: `/${locale}/order-guide` },
    { icon: Headphones,    labelPt: 'Contato',           labelJa: 'お問い合わせ',  href: `/${locale}/contact` },
  ];

  /* ════════════════════════════════════════════════════════
     MOBILE HEADER
     ════════════════════════════════════════════════════════ */
  const mobileHeader = (
    <header className={`lg:hidden fixed top-0 left-0 right-0 z-40 bg-white transition-shadow duration-200 ${
      scrolled ? 'shadow-md' : 'shadow-sm border-b border-[#F5EDE0]'
    }`}>
      <div className="flex h-14 items-center justify-between px-3">
        <div className="flex items-center gap-1 w-20">
          <button type="button" onClick={() => setDrawerOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#D4972A] hover:bg-[#FDF8ED] transition active:scale-95"
            aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
          <button type="button"
            onClick={() => { setMobileSearchOpen(o => !o); setTimeout(() => mobileSearchRef.current?.focus(), 100); }}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#D4972A] hover:bg-[#FDF8ED] transition">
            <Search className="h-5 w-5" />
          </button>
        </div>
        <Link href={`/${locale}`} className="flex items-center justify-center flex-1">
          <Image src="/logo-light.svg" alt="Real Pan" width={140} height={40} className="h-9 w-auto object-contain" priority />
        </Link>
        <div className="flex items-center justify-end w-20">
          <button type="button" onClick={switchLanguage}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#FAF7F2] transition"
            aria-label={locale === 'pt' ? '日本語に切り替え' : 'Mudar para Português'}>
            <span className="text-xl leading-none">{locale === 'pt' ? '🇯🇵' : '🇧🇷'}</span>
          </button>
        </div>
      </div>
      {mobileSearchOpen && (
        <div className="px-4 pb-3 bg-white border-b border-[#F5EDE0]">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8099B8]" />
            <input ref={mobileSearchRef} type="text" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} onKeyDown={handleSearchKeyDown}
              placeholder={locale === 'pt' ? 'Buscar produtos...' : '商品を検索...'}
              className="w-full pl-9 pr-9 py-2.5 border border-[#F5EDE0] rounded-full text-base bg-[#FEFCF8]
                         focus:outline-none focus:ring-2 focus:ring-[#D4972A]/30 focus:border-[#D4972A] focus:bg-white transition"
              autoFocus />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8099B8] hover:text-[#1A2740]">
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>
      )}
    </header>
  );

  /* ════════════════════════════════════════════════════════
     MOBILE DRAWER
     ════════════════════════════════════════════════════════ */
  const mobileDrawer = drawerOpen && (
    <div className="lg:hidden fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
      <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-[340px] bg-white shadow-2xl flex flex-col overflow-hidden animate-[slideInLeft_0.25s_ease-out]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F5EDE0] bg-[#FEFCF8]">
          <Image src="/logo-light.svg" alt="Real Pan" width={110} height={32} className="h-8 w-auto object-contain" />
          <button type="button" onClick={() => setDrawerOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#FAF7F2] hover:bg-[#F5EDE0] transition">
            <X className="h-4 w-4 text-[#57749A]" />
          </button>
        </div>
        <div className="px-5 py-4 border-b border-[#F5EDE0] bg-[#FEFCF8]">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4972A]/10 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-[#D4972A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A2740] truncate">{customer?.firstName} {customer?.lastName}</p>
                <Link href={`/${locale}/account`} onClick={() => setDrawerOpen(false)}
                  className="text-xs text-[#D4972A] font-medium hover:underline">
                  {locale === 'pt' ? 'Minha conta →' : 'マイページ →'}
                </Link>
              </div>
            </div>
          ) : (
            <Link href={`/${locale}/login`} onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 w-full rounded-xl bg-[#D4972A] text-white px-4 py-3 transition hover:bg-[#B87A20] active:scale-[0.98]">
              <User className="h-5 w-5" />
              <span className="text-sm font-bold">{locale === 'pt' ? 'Entrar / Cadastrar' : 'ログイン / 新規登録'}</span>
            </Link>
          )}
        </div>
        {itemCount > 0 && (
          <Link href={`/${locale}/cart`} onClick={() => setDrawerOpen(false)}
            className="mx-5 mt-4 flex items-center gap-3 rounded-xl bg-[#FDF8ED] border border-[#ECC76E] px-4 py-3 transition hover:bg-[#FAEFD3]">
            <div className="relative">
              <ShoppingCart className="h-5 w-5 text-[#D4972A]" />
              <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 rounded-full bg-[#D4972A] text-white text-[9px] font-bold flex items-center justify-center px-1">{itemCount}</span>
            </div>
            <span className="flex-1 text-sm font-medium text-[#1A2740]">{locale === 'pt' ? 'Carrinho' : 'カート'}</span>
            <span className="text-sm font-bold text-[#D4972A] tabular-nums">¥{total.toLocaleString('ja-JP')}</span>
            <ChevronRight className="h-4 w-4 text-[#ECC76E]" />
          </Link>
        )}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
          {menuLinks.map(({ icon: Icon, labelPt, labelJa, href, accent }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link key={href} href={href} onClick={() => setDrawerOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors
                  ${active ? 'bg-[#FDF8ED] text-[#D4972A]' : accent ? 'text-[#B87A20] hover:bg-[#FDF8ED]' : 'text-[#1A2740] hover:bg-[#FAF7F2]'}`}>
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg
                  ${active || accent ? 'bg-[#D4972A] text-white' : 'bg-[#FAF7F2] text-[#57749A]'}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="flex-1 text-sm font-medium">{locale === 'pt' ? labelPt : labelJa}</span>
                <ChevronRight className="h-4 w-4 text-[#DFD0B3]" />
              </Link>
            );
          })}
        </div>
        <div className="border-t border-[#F5EDE0] px-5 py-4 space-y-3 bg-[#FEFCF8]">
          <button type="button" onClick={switchLanguage}
            className="flex items-center gap-3 w-full rounded-xl px-4 py-3 bg-[#FAF7F2] hover:bg-[#F5EDE0] transition">
            <span className="text-xl">{locale === 'pt' ? '🇯🇵' : '🇧🇷'}</span>
            <span className="flex-1 text-left text-sm font-medium text-[#1A2740]">
              {locale === 'pt' ? '日本語に切り替え' : 'Mudar para Português'}
            </span>
            <span className="text-xs font-bold text-[#D4972A] bg-[#FDF8ED] px-2 py-0.5 rounded-full">
              {locale === 'pt' ? 'JA' : 'PT'}
            </span>
          </button>
          {isLoggedIn && (
            <button type="button" onClick={() => { logout(); setDrawerOpen(false); }}
              className="flex items-center gap-2 text-sm text-[#8099B8] hover:text-red-500 px-4 py-2 transition">
              <LogOut className="h-4 w-4" />
              {locale === 'pt' ? 'Sair da conta' : 'ログアウト'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════
     FLOATING CART BAR (mobile)
     ════════════════════════════════════════════════════════ */
  const floatingCartBar = itemCount > 0 && (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
      <Link href={`/${locale}/cart`}
        className="flex items-center justify-between mx-3 mb-3 px-4 py-3 bg-[#D4972A] text-white rounded-2xl shadow-lg active:scale-[0.98] transition-transform"
        style={{ marginBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 rounded-full bg-white text-[#D4972A] text-[9px] font-bold flex items-center justify-center px-1">{itemCount}</span>
          </div>
          <span className="text-sm font-semibold">{locale === 'pt' ? 'Ver carrinho' : 'カートを見る'}</span>
        </div>
        <span className="text-base font-bold tabular-nums">
          ¥{total.toLocaleString('ja-JP')}
          <span className="text-[10px] font-normal ml-0.5 text-white/80">(税込)</span>
        </span>
      </Link>
    </div>
  );

  /* ════════════════════════════════════════════════════════
     DESKTOP HEADER — REFINED
     ════════════════════════════════════════════════════════ */
  const desktopHeader = (
    <header className="hidden lg:block fixed top-0 left-0 right-0 z-40">
      {/* ── TOP BAR: warm cream with gold accents ── */}
      <div className="bg-[#1A2740] text-xs">
        <div className="container mx-auto px-6 flex items-center justify-between h-10">
          <div className="flex items-center gap-6 text-white/70">
            <Link href={`/${locale}/about`} className="hover:text-[#ECC76E] transition">{t('company')}</Link>
            <Link href={`/${locale}/feature`} className="hover:text-[#ECC76E] transition">{t('kodawari')}</Link>
            <Link href={`/${locale}/kits`} className="hover:text-[#ECC76E] transition font-medium text-[#ECC76E]">
              {locale === 'pt' ? '🎁 Kits' : '🎁 キット'}
            </Link>
            <Link href={`/${locale}/services`} className="hover:text-[#ECC76E] transition font-medium">
              {locale === 'pt' ? 'Para Empresas' : '法人のお客様'}
            </Link>
          </div>
          <div className="flex items-center gap-5 text-white/70">
            <button type="button" onClick={switchLanguage}
              className="flex items-center gap-2 hover:text-[#ECC76E] transition">
              <span className="text-base">{locale === 'pt' ? '🇯🇵' : '🇧🇷'}</span>
              <span>{locale === 'pt' ? '日本語' : 'Português'}</span>
            </button>
            <span className="w-px h-4 bg-white/20" />
            <Link href={`/${locale}/contact`} className="hover:text-[#ECC76E] transition">{t('contact')}</Link>
          </div>
        </div>
      </div>

      {/* ── MAIN BAR: white with warm accents ── */}
      <div className={`transition-all duration-300 bg-white border-b border-[#F5EDE0] ${scrolled ? 'shadow-lg h-16' : 'h-20'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between h-full gap-8">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center flex-shrink-0 hover:opacity-80 transition">
            <Image src="/logo-light.svg" alt="Real Pan" width={180} height={50}
              className={`w-auto object-contain transition-all ${scrolled ? 'h-10' : 'h-12'}`} priority />
          </Link>

          {/* Search — centered with gold accent */}
          <div className="flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C9B896] group-focus-within:text-[#D4972A] transition" />
              <input ref={searchInputRef} type="text" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} onKeyDown={handleSearchKeyDown}
                placeholder={locale === 'pt' ? 'Buscar produtos...' : '商品を検索...'}
                className="w-full rounded-full border-2 border-[#ECC76E]/40 bg-[#FEFCF8] pl-11 pr-12 py-3 text-sm text-[#1A2740]
                           placeholder:text-[#C9B896]
                           focus:outline-none focus:border-[#D4972A] focus:bg-white focus:shadow-[0_0_0_3px_rgba(212,151,42,0.1)]
                           transition-all" />
              {searchQuery ? (
                <button type="button" onClick={() => setSearchQuery('')}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-[#C9B896] hover:text-[#1A2740] transition">
                  <X className="h-4 w-4" />
                </button>
              ) : null}
              <button type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-[#D4972A] hover:bg-[#B87A20]
                           flex items-center justify-center transition-colors shadow-sm">
                <Search className="h-4 w-4 text-white" />
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Account */}
            <Link href={customer ? `/${locale}/account` : `/${locale}/login`}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-[#1A2740] hover:bg-[#FAF7F2] hover:text-[#D4972A] transition">
              <User className="h-[18px] w-[18px]" />
              <span className="font-medium">{locale === 'pt' ? 'Conta' : 'アカウント'}</span>
            </Link>

            {/* Divider */}
            <span className="w-px h-6 bg-[#F5EDE0]" />

            {/* Cart */}
            <Link href={`/${locale}/cart`}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm text-[#1A2740] hover:bg-[#FDF8ED] hover:text-[#D4972A] transition">
              <ShoppingCart className="h-[18px] w-[18px]" />
              <span className="font-medium">
                {itemCount > 0 ? (
                  <>¥{total.toLocaleString('ja-JP')}</>
                ) : (
                  <>{locale === 'pt' ? 'Carrinho' : 'カート'}</>
                )}
              </span>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 left-7 min-w-[18px] h-[18px] rounded-full bg-[#D4972A] text-white text-[10px] font-bold flex items-center justify-center px-1">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ── PRODUCT NAV: warm gold gradient ── */}
      <div className="bg-gradient-to-r from-[#D4972A] to-[#B87A20] shadow-sm">
        <div className="container mx-auto px-6 flex items-center gap-1 h-11">
          {[
            { href: `/${locale}/products`, label: t('products') },
            { href: `/${locale}/kits`, label: locale === 'pt' ? 'Kits Premium' : 'キット' },
            { href: `/${locale}/services`, label: locale === 'pt' ? 'Serviços B2B' : 'サービス' },
            { href: `/${locale}/news`, label: t('news') },
            { href: `/${locale}/about`, label: t('company') },
            { href: `/${locale}/contact`, label: t('contact') },
          ].map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );

  return (
    <>
      {mobileHeader}
      {desktopHeader}
      {mobileDrawer}
      {floatingCartBar}
    </>
  );
}