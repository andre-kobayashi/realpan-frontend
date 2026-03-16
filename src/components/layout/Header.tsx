'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu, X, ShoppingCart, User, Globe,
  Package, Gift, BookOpen, HelpCircle, Phone,
  ChevronRight, LogOut, Home,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';

/* ─────────────────────────── Menu Items ─────────────────────────── */
interface MenuItem {
  href: string;
  labelPt: string;
  labelJa: string;
  icon: typeof Package;
  highlight?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { href: '/products',      labelPt: 'Produtos',         labelJa: '商品一覧',     icon: Package },
  { href: '/products/sets',  labelPt: 'Kits & Sets',      labelJa: 'セット商品',   icon: Gift,      highlight: true },
  { href: '/kodawari',       labelPt: 'Nosso Compromisso', labelJa: 'こだわり',     icon: BookOpen },
  { href: '/services',       labelPt: 'Serviços',         labelJa: 'サービス案内', icon: HelpCircle },
  { href: '/order-guide',    labelPt: 'Como Comprar',     labelJa: 'ご利用ガイド', icon: BookOpen },
  { href: '/contact',        labelPt: 'Contato',          labelJa: 'お問い合わせ', icon: Phone },
];

/* ─────────────────────────── Component ─────────────────────────── */
export function Header() {
  const locale = useLocale() as 'pt' | 'ja';
  const pathname = usePathname();
  const router = useRouter();
  const { items: cartItems } = useCart();
  const { customer, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const isLoggedIn = !!customer;
  const otherLocale = locale === 'pt' ? 'ja' : 'pt';

  // ── Scroll detection ──
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Lock body when menu open ──
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // ── Language switch ──
  const switchLanguage = () => {
    const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`);
    router.push(newPath);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* ═══ ANNOUNCEMENT BAR ═══ */}
      <div className="bg-bread-500 text-white text-center py-1.5 px-4">
        <p className="text-xs font-medium">
          {locale === 'pt'
            ? '🍞 Novos kits disponíveis! Confira os sets especiais'
            : '🍞 新セット登場！特別セット商品をチェック'}
        </p>
      </div>

      {/* ═══ HEADER ═══ */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300
          ${scrolled
            ? 'bg-white/98 backdrop-blur-lg shadow-card border-b border-cream-200'
            : 'bg-white border-b border-cream-100'
          }`}
      >
        <nav className="container-custom">
          <div className="flex h-14 sm:h-16 items-center justify-between gap-4">
            {/* ── LEFT: Hamburger (mobile) + Logo ── */}
            <div className="flex items-center gap-3">
              {/* Hamburger — mobile only */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden flex items-center justify-center w-10 h-10
                           rounded-xl text-navy-600 hover:bg-cream-100
                           transition-colors active:scale-95"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Logo */}
              <Link
                href={`/${locale}`}
                className="flex items-center gap-2 transition-opacity hover:opacity-80"
                onClick={() => setIsMenuOpen(false)}
              >
                <Image
                  src="/logo.png"
                  alt="Real Pan"
                  width={120}
                  height={40}
                  className="h-8 sm:h-10 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* ── CENTER: Desktop Navigation ── */}
            <div className="hidden lg:flex items-center gap-1">
              {MENU_ITEMS.map((item) => {
                const label = locale === 'pt' ? item.labelPt : item.labelJa;
                const isActive = pathname.includes(item.href);
                return (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${isActive
                        ? 'text-bread-600 bg-bread-50'
                        : 'text-navy-600 hover:text-bread-600 hover:bg-cream-100'
                      }`}
                  >
                    {label}
                    {item.highlight && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-bread-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ── RIGHT: Actions ── */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Language toggle */}
              <button
                type="button"
                onClick={switchLanguage}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-2
                           text-sm font-medium text-navy-500
                           hover:bg-cream-100 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-semibold">
                  {locale === 'pt' ? '日本語' : 'PT'}
                </span>
              </button>

              {/* Account */}
              <Link
                href={`/${locale}/${isLoggedIn ? 'account' : 'login'}`}
                className="flex items-center justify-center w-10 h-10
                           rounded-xl text-navy-500 hover:bg-cream-100
                           transition-colors"
                aria-label={isLoggedIn ? 'Account' : 'Login'}
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <Link
                href={`/${locale}/cart`}
                className="relative flex items-center justify-center w-10 h-10
                           rounded-xl text-navy-500 hover:bg-cream-100
                           transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5
                                   min-w-[18px] h-[18px] flex items-center justify-center
                                   rounded-full bg-bread-500 text-white
                                   text-[10px] font-bold
                                   animate-fade-in">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ═══ MOBILE MENU OVERLAY ═══ */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-[360px]
                          bg-white shadow-float animate-slide-in-right
                          flex flex-col overflow-hidden">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200">
              <Image
                src="/logo.png"
                alt="Real Pan"
                width={100}
                height={32}
                className="h-8 w-auto"
              />
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center
                           rounded-lg hover:bg-cream-100 transition-colors"
              >
                <X className="h-5 w-5 text-navy-500" />
              </button>
            </div>

            {/* Menu items */}
            <div className="flex-1 overflow-y-auto py-2">
              {/* Home link */}
              <Link
                href={`/${locale}`}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 px-5 py-3.5
                           text-navy-700 hover:bg-cream-50 transition-colors"
              >
                <Home className="h-5 w-5 text-bread-500" />
                <span className="text-sm font-medium">
                  {locale === 'pt' ? 'Início' : 'ホーム'}
                </span>
              </Link>

              <div className="h-px bg-cream-200 mx-5 my-1" />

              {/* Navigation items */}
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const label = locale === 'pt' ? item.labelPt : item.labelJa;
                const isActive = pathname.includes(item.href);

                return (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-4 px-5 py-3.5
                      transition-colors
                      ${isActive
                        ? 'bg-bread-50 text-bread-600'
                        : 'text-navy-700 hover:bg-cream-50'
                      }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-bread-500' : 'text-navy-400'}`} />
                    <span className="flex-1 text-sm font-medium">{label}</span>
                    {item.highlight && (
                      <span className="px-2 py-0.5 rounded-full bg-bread-500 text-white text-[10px] font-bold">
                        NEW
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-cream-400" />
                  </Link>
                );
              })}

              <div className="h-px bg-cream-200 mx-5 my-1" />

              {/* Language switch */}
              <button
                type="button"
                onClick={switchLanguage}
                className="flex items-center gap-4 px-5 py-3.5 w-full
                           text-navy-700 hover:bg-cream-50 transition-colors"
              >
                <Globe className="h-5 w-5 text-navy-400" />
                <span className="flex-1 text-left text-sm font-medium">
                  {locale === 'pt' ? '日本語に切り替え' : 'Mudar para Português'}
                </span>
                <span className="text-xs font-bold text-bread-500 bg-bread-50 px-2 py-0.5 rounded-full">
                  {locale === 'pt' ? 'JA' : 'PT'}
                </span>
              </button>
            </div>

            {/* Drawer footer — auth */}
            <div className="border-t border-cream-200 p-5">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <Link
                    href={`/${locale}/account`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-cream-50
                               text-navy-700 hover:bg-cream-100 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-bread-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-bread-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {customer?.firstName} {customer?.lastName}
                      </p>
                      <p className="text-[11px] text-navy-400 truncate">{customer?.email}</p>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="flex items-center gap-2 text-sm text-navy-400 hover:text-red-500 px-3 py-2 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {locale === 'pt' ? 'Sair' : 'ログアウト'}
                  </button>
                </div>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-bread w-full text-center"
                >
                  <User className="h-4 w-4" />
                  {locale === 'pt' ? 'Entrar / Cadastrar' : 'ログイン / 新規登録'}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
