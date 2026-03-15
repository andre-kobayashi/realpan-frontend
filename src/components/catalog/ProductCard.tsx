'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import type { Product } from '@/types/product';

type Props = {
  product: Product;
};

const STORAGE_ICONS: Record<string, string> = {
  AMBIENT: '🏠',
  FROZEN_READY: '❄️',
  FROZEN_RAW: '❄️',
  REFRIGERATED: '🧊',
};

export function ProductCard({ product }: Props) {
  const locale = useLocale() as 'pt' | 'ja';
  const t = useTranslations('products');
  const { addItem } = useCart();
  const { customer } = useAuth();
  const isPJ = customer?.type === 'BUSINESS';
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { name, outOfStock, displayPrice, originalRetailWithTax, hasDiscount, priceLabel } = useMemo(() => {
    const productName = product.name[locale];
    const isOutOfStock = product.stock <= 0;
    const price = isPJ ? product.wholesalePrice : product.retailPriceWithTax;
    const originalPrice = Math.ceil(product.retailPrice * 1.08);
    const discount = Boolean(product.hasPromo && product.promoPrice);
    const label = isPJ ? t('tax_excluded') : t('tax_included');

    return {
      name: productName,
      outOfStock: isOutOfStock,
      displayPrice: price,
      originalRetailWithTax: originalPrice,
      hasDiscount: discount,
      priceLabel: label,
    };
  }, [product, locale, isPJ, t]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (outOfStock) return;

    addItem(product, 1);
    setAdded(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-square bg-white overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={name}
            fill
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            loading="lazy"
            quality={75}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl text-gray-200">
            🍞
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {t('new_badge')}
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-yellow-500 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {t('bestseller_badge')}
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {t('promo_badge')}
            </span>
          )}
        </div>

        <div className="absolute top-2 right-2">
          <span className="bg-white/90 backdrop-blur-sm text-[10px] px-1.5 py-0.5 rounded-full border border-gray-200">
            {STORAGE_ICONS[product.storageType] || '📦'} {t(`storage.${product.storageType}`)}
          </span>
        </div>

        {outOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-full">
              {t('out_of_stock')}
            </span>
          </div>
        )}
      </div>

      <div className="p-3 lg:p-4 flex flex-col flex-1">
        <p className="text-[10px] text-orange-600 font-semibold uppercase tracking-wider mb-1">
          {product.categoryName[locale]}
        </p>

        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem]">
          {name}
        </h3>

        {product.quantityInfo && (
          <p className="text-xs text-gray-500 mb-2">{product.quantityInfo}</p>
        )}

        <div className="flex-1" />

        <div className="mb-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ¥{originalRetailWithTax.toLocaleString()}
              </span>
            )}
            <span className="text-xl lg:text-2xl font-bold text-gray-900">
              ¥{displayPrice.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-gray-400">{priceLabel}</span>

          {isPJ && product.wholesaleUnit === 'BOX' && product.boxPrice && (
            <div className="mt-1 bg-orange-50 rounded px-2 py-1">
              <span className="text-xs text-orange-700 font-medium">
                📦 {t('box_price', { count: product.unitsPerBox || 0 })}: ¥{product.boxPrice.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock || added}
            className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-full transition-all duration-200 active:scale-95 ${
              added
                ? 'bg-green-500 text-white'
                : outOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" /> {t('added_to_cart')}
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" /> {t('add_to_cart')}
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}