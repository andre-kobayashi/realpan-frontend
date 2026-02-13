'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Snowflake, Thermometer, Building2, User } from 'lucide-react';
import type { Product } from '@/types/product';

type Props = {
  product: Product;
  onContact?: (productName: string) => void;
};

const storageBadge = {
  frozen:       { Icon: Snowflake,    bg: 'bg-sky-50',   border: 'border-sky-200',   text: 'text-sky-700',   label: { pt: 'Congelado',   ja: '冷凍' } },
  refrigerated: { Icon: Thermometer,  bg: 'bg-blue-50',  border: 'border-blue-200',  text: 'text-blue-700',  label: { pt: 'Refrigerado', ja: '冷蔵' } },
  ambient:      { Icon: Thermometer,  bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: { pt: 'Amb.',         ja: '常温' } },
};

export function ProductCard({ product, onContact }: Props) {
  const locale = useLocale() as 'pt' | 'ja';
  const storage = storageBadge[product.storageType] ?? storageBadge.ambient;
  const { Icon: StorageIcon } = storage;

  return (
    <div className="group flex flex-col rounded-xl lg:rounded-2xl bg-white ring-1 ring-neutral-200 overflow-hidden transition-all duration-300 hover:shadow-card hover:-translate-y-0.5">

      {/* ── Imagem ── */}
      <div className="relative aspect-square bg-neutral-50 overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name[locale]}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-neutral-200">🍞</div>
        )}

        {/* Badges — topo esq */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isBestseller && (
            <span className="rounded-full bg-accent-400 px-2 py-0.5 text-[9px] lg:text-[10px] font-bold text-primary-900 shadow-sm">
              ★ BEST
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-primary-700 px-2 py-0.5 text-[9px] lg:text-[10px] font-bold text-white shadow-sm">
              NEW
            </span>
          )}
        </div>

        {/* Storage — canto inf dir */}
        <div className={`absolute bottom-2 right-2 flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold backdrop-blur-sm ${storage.bg} ${storage.border} ${storage.text}`}>
          <StorageIcon className="h-2.5 w-2.5" />
          <span className="hidden sm:inline">{storage.label[locale]}</span>
          <span className="sm:hidden">{storage.label[locale].slice(0,2)}</span>
        </div>
      </div>

      {/* ── Conteúdo ── */}
      <div className="flex flex-col flex-1 p-3 lg:p-5">

        {/* Nome + subtítulo */}
        <h3 className="font-semibold text-primary-900 text-xs lg:text-sm leading-snug mb-0.5 line-clamp-2">
          {product.name[locale]}
        </h3>
        {product.subtitle && (
          <p className="text-[10px] font-medium text-accent-500 mb-1 line-clamp-1 hidden sm:block">
            {product.subtitle[locale]}
          </p>
        )}
        <p className="text-[11px] lg:text-xs text-neutral-400 leading-relaxed line-clamp-2 flex-1 hidden sm:block">
          {product.description[locale]}
        </p>

        {/* Peso */}
        {product.weight && (
          <p className="mt-2 text-[10px] text-neutral-400 border-t border-neutral-100 pt-2 hidden lg:block">
            {product.weight[locale]}
          </p>
        )}

        {/* Canais */}
        <div className="mt-2 flex flex-wrap gap-1 lg:gap-2">
          {product.sales.pj.enabled && (
            <span className="flex items-center gap-0.5 rounded-md bg-primary-50 border border-primary-100 px-1.5 py-1 text-[9px] lg:text-[10px] font-semibold text-primary-700">
              <Building2 className="h-2.5 w-2.5" />
              {locale === 'pt' ? 'PJ' : '法人'}
            </span>
          )}
          {product.sales.pf.enabled && (
            <span className="flex items-center gap-0.5 rounded-md bg-neutral-50 border border-neutral-200 px-1.5 py-1 text-[9px] lg:text-[10px] font-semibold text-neutral-600">
              <User className="h-2.5 w-2.5" />
              {locale === 'pt' ? 'PF' : '個人'}
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => onContact?.(product.name[locale])}
          className="mt-2.5 lg:mt-4 w-full rounded-full bg-primary-700 py-2 lg:py-2.5 text-[11px] lg:text-sm font-semibold text-white transition hover:bg-primary-800 active:scale-95"
        >
          {locale === 'pt' ? 'Solicitar' : '問い合わせ'}
        </button>
      </div>
    </div>
  );
}
