'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

/**
 * FloatingCartBar — barra fixa no rodapé mobile
 * Aparece apenas quando há itens no carrinho
 * Estilo inspirado no ec.stylebread.com
 */
export function FloatingCartBar() {
  const locale = useLocale() as 'pt' | 'ja';
  const { itemCount, total } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pb-safe">
      {/* Gradient fade above the bar */}
      <div className="h-6 gradient-cream-t pointer-events-none" />

      {/* Bar */}
      <Link
        href={`/${locale}/cart`}
        className="flex items-center gap-3 mx-3 mb-3
                   bg-navy-800 text-white rounded-2xl
                   px-4 py-3
                   shadow-float
                   active:scale-[0.98] transition-transform"
      >
        {/* Cart icon + count badge */}
        <div className="relative flex-shrink-0">
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -top-1.5 -right-2
                           min-w-[18px] h-[18px] flex items-center justify-center
                           rounded-full bg-bread-500 text-white
                           text-[10px] font-bold leading-none">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        </div>

        {/* Label */}
        <span className="flex-1 text-sm font-medium">
          {locale === 'pt' ? 'Ver carrinho' : 'カートを見る'}
        </span>

        {/* Total */}
        <span className="text-base font-bold tabular-nums">
          ¥{total.toLocaleString('ja-JP')}
        </span>

        <ChevronRight className="h-4 w-4 text-cream-400 flex-shrink-0" />
      </Link>
    </div>
  );
}