'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Minus, Plus, Snowflake, Thermometer, Sun } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import type { Product } from '@/types/product';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProductCardProduct = Record<string, any>;

interface ProductCardProps {
  product: ProductCardProduct;
  onContact?: (name: string) => void;
}

function getName(p: ProductCardProduct, locale: string): string {
  if (typeof p.namePt === 'string' && typeof p.nameJa === 'string') return locale === 'pt' ? p.namePt : p.nameJa;
  if (p.name && typeof p.name === 'object') return locale === 'pt' ? p.name.pt : p.name.ja;
  if (typeof p.name === 'string') return p.name;
  return p.namePt || p.nameJa || 'Produto';
}

function getImage(p: ProductCardProduct): string | null {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  if (Array.isArray(p.images) && p.images.length > 0) {
    const img = p.images[0];
    return typeof img === 'string' ? (img.startsWith('http') ? img : `${apiUrl}/uploads/products/${img}`) : null;
  }
  if (typeof p.image === 'string' && p.image) return p.image.startsWith('http') ? p.image : `${apiUrl}/uploads/products/${p.image}`;
  return null;
}

function getDisplayPrice(p: ProductCardProduct, isPJ: boolean): number {
  if (isPJ) return Number(p.wholesalePrice) || Number(p.originalPrice) || 0;
  if (p.hasPromo && p.promoPrice) return Number(p.promoPrice);
  return Number(p.retailPriceWithTax) || Number(p.retailPrice) || Number(p.originalPrice) || 0;
}

function getCategoryLabel(p: ProductCardProduct, locale: string): string | null {
  if (!p.category) return null;
  if (typeof p.category === 'string') return p.category;
  if (typeof p.category === 'object') return locale === 'pt' ? (p.category.namePt || null) : (p.category.nameJa || null);
  return null;
}

const STORAGE_MAP: Record<string, { icon: typeof Snowflake; label: { pt: string; ja: string }; css: string }> = {
  FROZEN_READY:  { icon: Snowflake,   label: { pt: 'Congelado', ja: '冷凍' },   css: 'bg-sky-50 text-sky-600 border-sky-200' },
  FROZEN_RAW:    { icon: Snowflake,   label: { pt: 'Congelado', ja: '冷凍' },   css: 'bg-sky-50 text-sky-600 border-sky-200' },
  REFRIGERATED:  { icon: Thermometer, label: { pt: 'Refrigerado', ja: '冷蔵' }, css: 'bg-blue-50 text-blue-600 border-blue-200' },
  AMBIENT:       { icon: Sun,         label: { pt: 'Ambiente', ja: '常温' },    css: 'bg-amber-50 text-amber-600 border-amber-200' },
  frozen:        { icon: Snowflake,   label: { pt: 'Congelado', ja: '冷凍' },   css: 'bg-sky-50 text-sky-600 border-sky-200' },
  chilled:       { icon: Thermometer, label: { pt: 'Refrigerado', ja: '冷蔵' }, css: 'bg-blue-50 text-blue-600 border-blue-200' },
  ambient:       { icon: Sun,         label: { pt: 'Ambiente', ja: '常温' },    css: 'bg-amber-50 text-amber-600 border-amber-200' },
};

export function ProductCard({ product, onContact }: ProductCardProps) {
  const locale = useLocale() as 'pt' | 'ja';
  const { addItem, updateQuantity, items } = useCart();
  const { customer } = useAuth();
  const [imgError, setImgError] = useState(false);

  const isPJ = customer?.type === 'BUSINESS';
  const name = getName(product, locale);
  const imageUrl = getImage(product);
  const slug = product.slug || product.id || '';
  const categoryName = getCategoryLabel(product, locale);
  const displayPrice = getDisplayPrice(product, isPJ);
  const taxLabel = isPJ ? '税抜' : '税込';

  const cartItem = items.find((i: { productId: string }) => i.productId === product.id);
  const qty = cartItem?.quantity ?? 0;

  const storageKey = product.storageType || '';
  const storage = STORAGE_MAP[storageKey] || null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product as unknown as Product, 1);
  };

  const handleQty = (e: React.MouseEvent, delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    const newQty = qty + delta;
    if (newQty <= 0) updateQuantity(product.id, 0);
    else updateQuantity(product.id, newQty);
  };

  return (
    <Link
      href={`/${locale}/products/${slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden
                 border border-cream-200 shadow-sm transition-all duration-300
                 hover:shadow-bread hover:-translate-y-0.5 active:scale-[0.98]"
    >
      {/* IMAGE */}
      <div className="relative aspect-square bg-cream-50 overflow-hidden">
        {imageUrl && !imgError ? (
          <Image src={imageUrl} alt={name} fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"><span className="text-5xl">🍞</span></div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold tracking-wide uppercase shadow-sm">NEW</span>
          )}
          {product.isBestseller && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold tracking-wide shadow-sm">
              {locale === 'pt' ? 'Popular' : '人気'}
            </span>
          )}
        </div>

        {storage && (
          <span className={`absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold backdrop-blur-sm ${storage.css}`}>
            <storage.icon className="h-3 w-3" />
            {storage.label[locale]}
          </span>
        )}
      </div>

      {/* INFO */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        {categoryName && (
          <span className="text-[10px] font-medium text-bread-400 uppercase tracking-wider mb-0.5">{categoryName}</span>
        )}

        <h3 className="text-sm sm:text-base font-semibold text-navy-800 leading-snug line-clamp-2 mb-1.5 group-hover:text-bread-600 transition-colors min-h-[2.5rem]">
          {name}
        </h3>

        {displayPrice > 0 ? (
          <div className="mb-3">
            <span className="text-lg sm:text-xl font-bold text-navy-800 tabular-nums">¥{displayPrice.toLocaleString('ja-JP')}</span>
            <span className="ml-1 text-[10px] text-navy-400 font-medium">({taxLabel})</span>
          </div>
        ) : (
          <div className="mb-3">
            <span className="text-sm font-medium text-navy-400">{locale === 'pt' ? 'Sob consulta' : 'お問い合わせ'}</span>
          </div>
        )}

        {/* ── QUANTITY: Style Bread style — vivid gold colors ── */}
        {displayPrice > 0 ? (
          <div className={`flex items-center rounded-xl overflow-hidden mt-auto border-2 transition-colors
            ${qty > 0 ? 'border-[#D4972A] bg-[#FDF8ED]' : 'border-[#ECC76E] bg-white'}`}>
            <button
              type="button"
              onClick={(e) => qty > 0 ? handleQty(e, -1) : e.preventDefault()}
              className={`flex items-center justify-center w-11 h-10 transition-all font-bold text-lg
                ${qty > 0
                  ? 'text-[#B87A20] hover:bg-[#D4972A] hover:text-white active:bg-[#965C1C]'
                  : 'text-[#DFD0B3] cursor-default'
                }`}
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className={`flex-1 text-center text-base font-bold tabular-nums select-none
              ${qty > 0 ? 'text-[#1A2740]' : 'text-[#C9B896]'}`}>
              {qty}
            </span>

            <button
              type="button"
              onClick={(e) => qty === 0 ? handleAdd(e) : handleQty(e, 1)}
              className="flex items-center justify-center w-11 h-10
                         text-[#B87A20] hover:bg-[#D4972A] hover:text-white active:bg-[#965C1C]
                         transition-all font-bold text-lg"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onContact?.(name); }}
            className="w-full rounded-xl py-2.5 border-2 border-navy-200 text-sm font-semibold text-navy-600 hover:bg-navy-50 transition-colors active:scale-[0.97] mt-auto"
          >
            {locale === 'pt' ? 'Solicitar orçamento' : 'お問い合わせ'}
          </button>
        )}
      </div>
    </Link>
  );
}