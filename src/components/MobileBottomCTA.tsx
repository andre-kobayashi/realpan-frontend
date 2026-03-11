'use client';

import { useLocale } from 'next-intl';
import { ShoppingCart } from 'lucide-react';

export function MobileBottomCTA() {
  const locale = useLocale();

  return (
    <>
      {/* Spacer para evitar que conteúdo fique escondido */}
      <div className="h-20 lg:hidden" />

      {/* Bottom CTA - Fixo mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-gradient-to-r from-orange-500 to-orange-600 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <button className="w-full bg-white text-orange-600 py-4 rounded-full font-bold text-base shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <ShoppingCart className="w-5 h-5" />
            {locale === 'ja' ? 'はじめてパンセットをお試しする' : 'Experimentar o Set de Pães'}
          </button>
          
          {/* Info adicional */}
          <p className="text-center text-white/90 text-xs mt-2">
            {locale === 'ja' ? '初回のお届けは送料無料' : 'Primeira entrega com frete grátis'}
          </p>
        </div>
      </div>
    </>
  );
}