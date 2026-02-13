'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  Home, LayoutGrid, ShoppingCart, User,
  Menu, X, ChevronRight, Globe,
  Package, Info, Star, Headphones,
  ClipboardList, Building2,
} from 'lucide-react';

const CART_COUNT = 0; // TODO: integrar estado global de carrinho

type DrawerLink = {
  icon: React.ElementType;
  labelPt: string;
  labelJa: string;
  href: string;
  accent?: boolean;
};

export function BottomNav() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function toggleLanguage() {
    const nextLocale = locale === 'pt' ? 'ja' : 'pt';
    const clean = pathname.replace(/^\/(pt|ja)/, '');
    router.replace(`/${nextLocale}${clean}`);
  }

  const drawerLinks: DrawerLink[] = [
    { icon: Star,          labelPt: 'Nosso Diferencial', labelJa: 'こだわり',      href: `/${locale}/feature` },
    { icon: Package,       labelPt: 'Produtos',          labelJa: '商品一覧',      href: `/${locale}/products` },
    { icon: Building2,     labelPt: 'Serviços / B2B',    labelJa: 'サービス',      href: `/${locale}/services`, accent: true },
    { icon: Info,          labelPt: 'A Empresa',         labelJa: '会社案内',      href: `/${locale}/about` },
    { icon: ClipboardList, labelPt: 'Guia de Pedidos',   labelJa: '注文ガイド',    href: `/${locale}/order-guide` },
    { icon: Headphones,    labelPt: 'Contato',           labelJa: 'お問い合わせ',  href: `/${locale}/contact` },
  ];

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const tabs = [
    { icon: Home,         labelPt: 'Início',   labelJa: 'ホーム',    href: `/${locale}` },
    { icon: LayoutGrid,   labelPt: 'Produtos', labelJa: '商品',      href: `/${locale}/products` },
    { icon: ShoppingCart, labelPt: 'Carrinho', labelJa: 'カート',    href: '#cart', badge: CART_COUNT },
    { icon: User,         labelPt: 'Conta',    labelJa: 'アカウント',href: '#account' },
  ];

  return (
    <>
      {/* ══════════════ BOTTOM NAV BAR ══════════════ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-stretch h-16">

          {tabs.map(({ icon: Icon, labelPt, labelJa, href, badge }) => {
            const active = href !== '#cart' && href !== '#account' && isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors relative
                  ${active ? 'text-primary-700' : 'text-neutral-500 active:bg-neutral-50'}`}
              >
                <span className="relative">
                  <Icon className={`h-5 w-5 ${active ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  {badge !== undefined && badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-accent-400 text-primary-900 text-[9px] font-bold flex items-center justify-center px-1">
                      {badge}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-medium leading-none">
                  {locale === 'pt' ? labelPt : labelJa}
                </span>
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-b-full bg-primary-700" />
                )}
              </Link>
            );
          })}

          {/* Menu button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors relative
              ${drawerOpen ? 'text-primary-700' : 'text-neutral-500 active:bg-neutral-50'}`}
          >
            <Menu className="h-5 w-5 stroke-[1.8]" />
            <span className="text-[10px] font-medium leading-none">
              {locale === 'pt' ? 'Menu' : 'メニュー'}
            </span>
          </button>

        </div>
        {/* Safe area iOS */}
        <div className="h-safe-bottom bg-white" style={{ height: 'env(safe-area-inset-bottom)' }} />
      </nav>

      {/* ══════════════ DRAWER OVERLAY ══════════════ */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ══════════════ DRAWER SLIDE-UP ══════════════ */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-xl transition-transform duration-300 ease-out
          ${drawerOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-neutral-200" />
        </div>

        {/* Header do drawer */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
          <span className="font-semibold text-primary-900">
            {locale === 'pt' ? 'Menu' : 'メニュー'}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700"
            >
              <Globe className="h-3.5 w-3.5" />
              {locale === 'pt' ? '日本語' : 'Português'}
            </button>
            <button
              onClick={() => setDrawerOpen(false)}
              className="rounded-full bg-neutral-100 p-2 text-neutral-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="px-4 py-3 space-y-1">
          {drawerLinks.map(({ icon: Icon, labelPt, labelJa, href, accent }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setDrawerOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3.5 transition-colors
                ${accent
                  ? 'bg-primary-50 text-primary-800 hover:bg-primary-100'
                  : 'text-neutral-700 hover:bg-neutral-50'
                }`}
            >
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl
                ${accent ? 'bg-primary-700 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="flex-1 font-medium text-sm">
                {locale === 'pt' ? labelPt : labelJa}
              </span>
              <ChevronRight className="h-4 w-4 text-neutral-300" />
            </Link>
          ))}
        </div>

        {/* CTA de pedido */}
        <div className="px-4 pb-4 pt-2">
          <Link
            href={`/${locale}/order/business`}
            onClick={() => setDrawerOpen(false)}
            className="btn-accent w-full justify-center"
          >
            {locale === 'pt' ? '🛒 Fazer pedido' : '🛒 ご注文はこちら'}
          </Link>
        </div>

        {/* Safe area iOS */}
        <div style={{ height: 'env(safe-area-inset-bottom)' }} />
      </div>
    </>
  );
}
