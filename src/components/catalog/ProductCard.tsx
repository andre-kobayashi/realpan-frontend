'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import type { Product } from '@/types/product';

type Props = {
  product: Product;
  onContact?: (name: string) => void;
};

export function ProductCard({ product, onContact }: Props) {
  const locale = useLocale() as 'pt' | 'ja';

  const name = product.name[locale];
  const description = product.description?.[locale] || '';
  const price = product.price || 0;
  const originalPrice = product.originalPrice;
  const hasDiscount = originalPrice && originalPrice > price;

  const handleBuyClick = () => {
    // Por enquanto, vai para Rakuten
    window.open('https://www.rakuten.co.jp/realsabor/', '_blank');
  };

  const handleContactClick = () => {
    if (onContact) {
      onContact(name);
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      
      {/* IMAGEM - Fundo branco puro */}
      <div className="relative aspect-square bg-white overflow-hidden">
        <Image
          src={product.image}
          alt={name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              NEW
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-yellow-500 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {locale === 'pt' ? 'MAIS VENDIDO' : '人気'}
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {locale === 'pt' ? 'OFERTA' : 'セール'}
            </span>
          )}
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* Nome */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem]">
          {name}
        </h3>

        {/* Quantidade */}
        {product.quantity && (
          <p className="text-xs text-gray-500 mb-2">
            {product.quantity}
          </p>
        )}

        {/* Descrição (opcional, só no hover) */}
        {description && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {description}
          </p>
        )}

        {/* Espaçador */}
        <div className="flex-1" />

        {/* PREÇO */}
        <div className="mb-3">
          {price > 0 ? (
            <div className="flex items-baseline gap-2">
              {hasDiscount && originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ¥{originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-2xl font-bold text-gray-900">
                ¥{price.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">
              {locale === 'pt' ? 'Consultar preço' : '価格はお問い合わせ'}
            </span>
          )}
          
          {product.freeShipping && (
            <span className="inline-block mt-1 text-[10px] font-bold text-orange-600 border border-orange-600 px-2 py-0.5 rounded">
              {locale === 'pt' ? 'FRETE GRÁTIS' : '送料無料'}
            </span>
          )}
        </div>

        {/* CTAs */}
        <div className="flex gap-2">
          {price > 0 ? (
            <button
              onClick={handleBuyClick}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold py-2.5 rounded-full hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              {locale === 'pt' ? '🛒 Rakuten' : '🛒 楽天で購入'}
            </button>
          ) : (
            <button
              onClick={handleContactClick}
              className="flex-1 border-2 border-orange-500 text-orange-600 text-sm font-semibold py-2.5 rounded-full hover:bg-orange-50 active:scale-95 transition-all duration-200"
            >
              {locale === 'pt' ? 'Consultar' : 'お問い合わせ'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}