'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  Minus, Plus, ShoppingCart, ChevronLeft,
  Snowflake, Thermometer, Sun, Share2,
  Clock, Flame, Info,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/types/product';
import { useAuth } from '@/contexts/AuthContext';
import type { ProductCardProduct } from '@/components/catalog/ProductCard';

/* ─────────────────────────── Types ─────────────────────────── */
interface ProductDetail extends ProductCardProduct {
  ingredientsPt?: string;
  ingredientsJa?: string;
  allergyPt?: string;
  allergyJa?: string;
  preparationPt?: string;
  preparationJa?: string;
  shelfLife?: string;
  origin?: string;
  boxQuantity?: number;
}

interface ProductDetailClientProps {
  product: ProductDetail;
  relatedProducts?: ProductCardProduct[];
}

/* ─────────────────────────── Tabs ─────────────────────────── */
type TabKey = 'info' | 'preparation' | 'ingredients';

const TAB_CONFIG: { key: TabKey; labelPt: string; labelJa: string; icon: typeof Info }[] = [
  { key: 'info',        labelPt: 'Informações',        labelJa: '商品情報',       icon: Info },
  { key: 'preparation', labelPt: 'Como preparar',      labelJa: 'お召し上がり方', icon: Flame },
  { key: 'ingredients', labelPt: 'Ingredientes',       labelJa: '原材料',         icon: Clock },
];

/* ─────────────────────────── Storage ─────────────────────────── */
const STORAGE_CONFIG: Record<string, {
  icon: typeof Snowflake;
  label: { pt: string; ja: string };
  className: string;
  instruction: { pt: string; ja: string };
}> = {
  FROZEN_READY: {
    icon: Snowflake,
    label: { pt: 'Congelado', ja: '冷凍' },
    className: 'bg-sky-50 text-sky-700 border-sky-200',
    instruction: { pt: 'Manter congelado (-18°C)', ja: '-18°C以下で保存' },
  },
  FROZEN_RAW: {
    icon: Snowflake,
    label: { pt: 'Congelado (cru)', ja: '冷凍（生地）' },
    className: 'bg-sky-50 text-sky-700 border-sky-200',
    instruction: { pt: 'Manter congelado (-18°C)', ja: '-18°C以下で保存' },
  },
  REFRIGERATED: {
    icon: Thermometer,
    label: { pt: 'Refrigerado', ja: '冷蔵' },
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    instruction: { pt: 'Manter refrigerado (0~10°C)', ja: '10°C以下で保存' },
  },
  AMBIENT: {
    icon: Sun,
    label: { pt: 'Ambiente', ja: '常温' },
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    instruction: { pt: 'Armazenar em local fresco e seco', ja: '直射日光を避けて常温保存' },
  },
};

/* ─────────────────────────── Component ─────────────────────────── */
export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const locale = useLocale() as 'pt' | 'ja';
  const { addItem } = useCart();
  const { customer } = useAuth();

  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<TabKey>('info');
  const [quantity, setQuantity] = useState(1);

  const isPJ = customer?.type === 'BUSINESS';
  const name = locale === 'pt' ? product.namePt : product.nameJa;
  const description = locale === 'pt' ? product.descriptionPt : product.descriptionJa;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  // Price
  const displayPrice = isPJ
    ? product.originalPrice
    : (product.retailPriceWithTax ?? product.retailPrice ?? product.originalPrice);
  const taxLabel = isPJ ? '税抜' : '税込';

  // Storage
  const storage = STORAGE_CONFIG[product.storageType] ?? STORAGE_CONFIG.AMBIENT;
  const StorageIcon = storage.icon;

  // Cart

  const images = product.images?.length
    ? product.images.map((img: string) => `${apiUrl}/uploads/products/${img}`)
    : [];

  const handleAddToCart = () => {
    addItem(product as unknown as Product, quantity);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* ── Breadcrumb ── */}
      <div className="container-custom pt-4 pb-2">
        <Link
          href={`/${locale}/products`}
          className="inline-flex items-center gap-1 text-sm text-navy-400 hover:text-bread-500 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {locale === 'pt' ? 'Voltar aos produtos' : '商品一覧に戻る'}
        </Link>
      </div>

      <div className="container-custom pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* ═══ LEFT: Gallery ═══ */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-cream-200">
              {images[selectedImage] ? (
                <Image
                  src={images[selectedImage]}
                  alt={name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-cream-100">
                  <span className="text-7xl">🍞</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {product.isNew && (
                  <span className="badge-new">NEW</span>
                )}
                {product.isBestseller && (
                  <span className="badge-popular">
                    {locale === 'pt' ? 'Popular' : '人気'}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20
                                rounded-xl overflow-hidden border-2 transition-all
                                ${selectedImage === idx
                                  ? 'border-bread-500 ring-2 ring-bread-200'
                                  : 'border-cream-200 hover:border-cream-400'
                                }`}
                  >
                    <Image
                      src={img}
                      alt={`${name} ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ═══ RIGHT: Product info ═══ */}
          <div className="flex flex-col">
            {/* Category */}
            {product.category && (
              <span className="text-xs font-semibold text-bread-500 tracking-[0.15em] uppercase mb-2">
                {locale === 'pt' ? product.category.namePt : product.category.nameJa}
              </span>
            )}

            {/* Name */}
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-navy-800 mb-3 text-balance">
              {name}
            </h1>

            {/* Storage + Unit */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                                border text-xs font-semibold ${storage.className}`}>
                <StorageIcon className="h-3.5 w-3.5" />
                {storage.label[locale]}
              </span>
              {product.unit && (
                <span className="text-sm text-navy-400">{product.unit}</span>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="text-sm text-navy-500 leading-relaxed mb-6">{description}</p>
            )}

            {/* ── Price block ── */}
            <div className="bg-white rounded-2xl border border-cream-200 p-5 mb-6">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-navy-800 tabular-nums">
                  ¥{displayPrice.toLocaleString('ja-JP')}
                </span>
                <span className="text-sm text-navy-400">({taxLabel})</span>
              </div>

              {/* Storage instruction */}
              <div className="flex items-center gap-2 text-xs text-navy-400 mb-5 pb-4 border-b border-cream-200">
                <StorageIcon className="h-3.5 w-3.5" />
                {storage.instruction[locale]}
              </div>

              {/* Quantity + Add to cart */}
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border-2 border-cream-300 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center
                               text-navy-500 hover:bg-cream-100 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-base font-bold text-navy-800 tabular-nums select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-11 flex items-center justify-center
                               text-navy-500 hover:bg-cream-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn-bread flex-1 py-3"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {locale === 'pt' ? 'Adicionar ao carrinho' : 'カートに入れる'}
                </button>
              </div>

              {/* Subtotal hint */}
              {quantity > 1 && (
                <p className="text-xs text-navy-400 mt-2 text-right">
                  {locale === 'pt' ? 'Subtotal' : '小計'}: ¥{(displayPrice * quantity).toLocaleString('ja-JP')}
                </p>
              )}
            </div>

            {/* Share */}
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm text-navy-400 hover:text-bread-500 transition-colors self-start"
            >
              <Share2 className="h-4 w-4" />
              {locale === 'pt' ? 'Compartilhar' : '共有する'}
            </button>
          </div>
        </div>

        {/* ═══ TABS ═══ */}
        <div className="mt-10 lg:mt-14">
          {/* Tab buttons */}
          <div className="flex border-b border-cream-200 overflow-x-auto scrollbar-hide">
            {TAB_CONFIG.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium
                              whitespace-nowrap border-b-2 transition-all
                    ${isActive
                      ? 'border-bread-500 text-bread-600'
                      : 'border-transparent text-navy-400 hover:text-navy-600'
                    }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {locale === 'pt' ? tab.labelPt : tab.labelJa}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="py-6 sm:py-8">
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                {product.category && (
                  <InfoRow
                    label={locale === 'pt' ? 'Categoria' : 'カテゴリ'}
                    value={locale === 'pt' ? product.category.namePt : product.category.nameJa}
                  />
                )}
                <InfoRow
                  label={locale === 'pt' ? 'Armazenamento' : '保存方法'}
                  value={storage.instruction[locale]}
                />
                {product.shelfLife && (
                  <InfoRow
                    label={locale === 'pt' ? 'Validade' : '賞味期限'}
                    value={product.shelfLife}
                  />
                )}
                {product.origin && (
                  <InfoRow
                    label={locale === 'pt' ? 'Origem' : '原産地'}
                    value={product.origin}
                  />
                )}
                {product.weightGrams && (
                  <InfoRow
                    label={locale === 'pt' ? 'Peso' : '重量'}
                    value={`${product.weightGrams}g`}
                  />
                )}
                {product.boxQuantity && (
                  <InfoRow
                    label={locale === 'pt' ? 'Qtd por caixa' : '入数'}
                    value={`${product.boxQuantity}${locale === 'pt' ? ' unidades' : '個'}`}
                  />
                )}
              </div>
            )}

            {activeTab === 'preparation' && (
              <div className="prose prose-sm max-w-2xl text-navy-600">
                {(locale === 'pt' ? product.preparationPt : product.preparationJa) ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: (locale === 'pt' ? product.preparationPt : product.preparationJa) || '',
                    }}
                  />
                ) : (
                  <div className="bg-cream-100 rounded-xl p-6 text-center">
                    <Flame className="h-8 w-8 text-bread-400 mx-auto mb-3" />
                    <p className="text-navy-400 text-sm">
                      {locale === 'pt'
                        ? 'Instruções de preparo em breve.'
                        : '準備方法は近日公開予定です。'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="max-w-2xl space-y-4">
                {(locale === 'pt' ? product.ingredientsPt : product.ingredientsJa) && (
                  <div>
                    <h4 className="text-sm font-semibold text-navy-700 mb-2">
                      {locale === 'pt' ? 'Ingredientes' : '原材料'}
                    </h4>
                    <p className="text-sm text-navy-500 leading-relaxed">
                      {locale === 'pt' ? product.ingredientsPt : product.ingredientsJa}
                    </p>
                  </div>
                )}
                {(locale === 'pt' ? product.allergyPt : product.allergyJa) && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-red-700 mb-1">
                      {locale === 'pt' ? 'Alérgenos' : 'アレルギー物質'}
                    </h4>
                    <p className="text-sm text-red-600">
                      {locale === 'pt' ? product.allergyPt : product.allergyJa}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helper component ── */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-cream-200">
      <span className="text-xs font-semibold text-navy-400 min-w-[100px]">{label}</span>
      <span className="text-sm text-navy-700">{value}</span>
    </div>
  );
}
