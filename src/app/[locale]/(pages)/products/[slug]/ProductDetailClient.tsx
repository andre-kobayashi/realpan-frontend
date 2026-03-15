'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, ShoppingCart, Check, Minus, Plus,
  Snowflake, Thermometer, Package, Clock, AlertTriangle
} from 'lucide-react';
import { loadProduct, loadAllProducts } from '@/lib/catalog-loader';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { ProductCard } from '@/components/catalog/ProductCard';
import type { Product } from '@/types/product';

const STORAGE_INFO: Record<string, { icon: React.ReactNode; color: string }> = {
  AMBIENT:      { icon: <Package className="h-4 w-4" />,      color: 'text-amber-600' },
  FROZEN_READY: { icon: <Snowflake className="h-4 w-4" />,    color: 'text-sky-600' },
  FROZEN_RAW:   { icon: <Snowflake className="h-4 w-4" />,    color: 'text-blue-600' },
  REFRIGERATED: { icon: <Thermometer className="h-4 w-4" />,  color: 'text-cyan-600' },
};

export default function ProductDetailClient() {
  const locale = useLocale() as 'pt' | 'ja';
  const t = useTranslations('products');
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { customer } = useAuth();
  const isPJ = (customer as any)?.customerType === 'BUSINESS';

  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [buyByBox, setBuyByBox] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const prod = await loadProduct(slug);
      setProduct(prod);

      if (prod) {
        const all = await loadAllProducts();
        setRelated(
          all
            .filter(p => p.categoryId === prod.categoryId && p.id !== prod.id)
            .slice(0, 4)
        );
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  // Reset buyByBox when product changes
  useEffect(() => {
    setBuyByBox(false);
    setQuantity(1);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">🍞</div>
        <p className="text-gray-500 mb-4">{t('no_products')}</p>
        <Link href={`/${locale}/products`} className="btn-orange">
          {t('detail.back')}
        </Link>
      </div>
    );
  }

  const name = product.name[locale];
  const desc = product.description[locale];
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 10;

  // Can buy by box: PJ + product has BOX unit + has boxPrice + has unitsPerBox
  const canBuyByBox = isPJ && product.wholesaleUnit === 'BOX' && product.boxPrice && (product.unitsPerBox || 0) > 0;

  // Prices
  const unitPrice = isPJ ? product.wholesalePrice : product.retailPriceWithTax;
  const boxPrice = product.boxPrice || 0;
  const boxPriceWithTax = isPJ ? boxPrice : Math.ceil(boxPrice * 1.08);

  // Current display price based on selection
  const currentPrice = (canBuyByBox && buyByBox) ? boxPriceWithTax : unitPrice;
  const currentUnitLabel = (canBuyByBox && buyByBox)
    ? (locale === 'ja' ? `箱（${product.unitsPerBox}個入り）` : `Caixa (${product.unitsPerBox} un.)`)
    : (locale === 'ja' ? '個' : 'un.');

  const priceLabel = isPJ ? t('tax_excluded') : t('tax_included');
  const originalRetailWithTax = Math.ceil(product.retailPrice * 1.08);

  const images = product.images.length > 0 ? product.images : [product.image];
  const storageInfo = STORAGE_INFO[product.storageType] || STORAGE_INFO.AMBIENT;

  // Total for display
  const lineTotal = currentPrice * quantity;

  const handleAdd = () => {
    if (outOfStock) return;
    // When buying by box, multiply quantity by unitsPerBox for the cart
    const cartQuantity = (canBuyByBox && buyByBox) ? quantity * (product.unitsPerBox || 1) : quantity;
    addItem(product, cartQuantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container-custom py-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('detail.back')}
        </button>
      </div>

      {/* ═══════ PRODUTO ═══════ */}
      <div className="container-custom pb-12 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

          {/* ── GALERIA ── */}
          <div>
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3">
              <Image
                src={images[selectedImage] || product.image}
                alt={name}
                fill
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {product.isNew && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {t('new_badge')}
                  </span>
                )}
                {product.isBestseller && (
                  <span className="bg-yellow-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                    {t('bestseller_badge')}
                  </span>
                )}
                {product.hasPromo && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {t('promo_badge')}
                  </span>
                )}
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    <Image src={img} alt={`${name} ${idx + 1}`} width={80} height={80}
                      className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── INFO ── */}
          <div className="flex flex-col">
            <p className="text-xs text-orange-600 font-semibold uppercase tracking-wider mb-2">
              {product.categoryName[locale]}
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{name}</h1>
            <p className="text-sm text-gray-400 mb-4">
              {locale === 'pt' ? product.name.ja : product.name.pt}
            </p>
            {product.quantityInfo && (
              <p className="text-sm text-gray-600 mb-4">{product.quantityInfo}</p>
            )}

            {/* ── PREÇO ── */}
            <div className="bg-gray-50 rounded-xl p-4 lg:p-5 mb-6">
              <div className="flex items-baseline gap-3 flex-wrap">
                {product.hasPromo && !isPJ && (
                  <span className="text-lg text-gray-400 line-through">
                    ¥{originalRetailWithTax.toLocaleString()}
                  </span>
                )}
                <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                  ¥{currentPrice.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">
                  / {currentUnitLabel} ({priceLabel})
                </span>
              </div>

              {/* ── SELETOR UNIDADE / CAIXA (PJ only) ── */}
              {canBuyByBox && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setBuyByBox(false); setQuantity(1); }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      !buyByBox
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">🔸</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {locale === 'ja' ? '個単位' : 'Unidade'}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ¥{unitPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {locale === 'ja' ? '1個あたり' : 'por unidade'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setBuyByBox(true); setQuantity(1); }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      buyByBox
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">📦</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {locale === 'ja' ? `箱（${product.unitsPerBox}個入）` : `Caixa (${product.unitsPerBox} un.)`}
                    </span>
                    <span className="text-lg font-bold text-orange-600">
                      ¥{boxPriceWithTax.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {locale === 'ja'
                        ? `1個あたり ¥${Math.ceil(boxPriceWithTax / (product.unitsPerBox || 1)).toLocaleString()}`
                        : `¥${Math.ceil(boxPriceWithTax / (product.unitsPerBox || 1)).toLocaleString()} por un.`
                      }
                    </span>
                  </button>
                </div>
              )}

              {/* Stock indicator */}
              <div className="mt-3 flex items-center gap-2">
                {outOfStock ? (
                  <span className="text-red-600 text-sm font-medium flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" /> {t('out_of_stock')}
                  </span>
                ) : lowStock ? (
                  <span className="text-amber-600 text-sm font-medium">
                    {t('low_stock', { count: product.stock })}
                  </span>
                ) : (
                  <span className="text-green-600 text-sm font-medium">
                    {t('in_stock')}
                  </span>
                )}
              </div>
            </div>

            {/* ── QUANTIDADE + CARRINHO ── */}
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2.5 hover:bg-gray-100 transition-colors"
                  disabled={outOfStock}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2.5 text-sm font-semibold min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.min(q + 1, product.stock))}
                  className="px-3 py-2.5 hover:bg-gray-100 transition-colors"
                  disabled={outOfStock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={outOfStock || added}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-sm transition-all duration-200 ${
                  added
                    ? 'bg-green-500 text-white'
                    : outOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg active:scale-95'
                }`}
              >
                {added ? (
                  <><Check className="h-5 w-5" /> {t('added_to_cart')}</>
                ) : (
                  <><ShoppingCart className="h-5 w-5" /> {t('add_to_cart')}</>
                )}
              </button>
            </div>

            {/* Line total when quantity > 1 or buying by box */}
            {(quantity > 1 || (canBuyByBox && buyByBox)) && (
              <div className="text-right text-sm text-gray-500 mb-6">
                {quantity} × ¥{currentPrice.toLocaleString()} = <span className="font-bold text-gray-900">¥{lineTotal.toLocaleString()}</span>
                {canBuyByBox && buyByBox && (
                  <span className="text-xs text-gray-400 ml-1">
                    ({quantity * (product.unitsPerBox || 1)} {locale === 'ja' ? '個' : 'un.'})
                  </span>
                )}
              </div>
            )}

            {/* ── DESCRIÇÃO ── */}
            {desc && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{t('detail.description')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{desc}</p>
              </div>
            )}

            {/* ── ESPECIFICAÇÕES ── */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('detail.specs')}</h3>
              <dl className="grid grid-cols-2 gap-y-2.5 text-sm">
                {product.weight && (
                  <>
                    <dt className="text-gray-500">{t('detail.weight')}</dt>
                    <dd className="text-gray-900 font-medium">{product.weight}</dd>
                  </>
                )}
                <dt className="text-gray-500">{t('detail.storage_method')}</dt>
                <dd className={`font-medium flex items-center gap-1.5 ${storageInfo.color}`}>
                  {storageInfo.icon} {t(`storage.${product.storageType}`)}
                </dd>
                {product.shelfLife && (
                  <>
                    <dt className="text-gray-500">{t('detail.shelf_life')}</dt>
                    <dd className="text-gray-900 font-medium flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-gray-400" /> {product.shelfLife}
                    </dd>
                  </>
                )}
                {canBuyByBox && (
                  <>
                    <dt className="text-gray-500">{locale === 'ja' ? '販売単位' : 'Unidade de venda'}</dt>
                    <dd className="text-gray-900 font-medium">
                      📦 {locale === 'ja' ? `箱（${product.unitsPerBox}個入り）` : `Caixa (${product.unitsPerBox} un.)`}
                    </dd>
                  </>
                )}
                {product.allergens.length > 0 && (
                  <>
                    <dt className="text-gray-500">{t('detail.allergens')}</dt>
                    <dd className="text-gray-900 font-medium">
                      {product.allergens.join(', ')}
                    </dd>
                  </>
                )}
                {product.janCode && (
                  <>
                    <dt className="text-gray-500">{t('detail.jan_code')}</dt>
                    <dd className="text-gray-900 font-mono text-xs">{product.janCode}</dd>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ PRODUTOS RELACIONADOS ═══════ */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-10 lg:py-14">
          <div className="container-custom">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
              {t('detail.related')}
            </h2>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:gap-5 xl:grid-cols-4">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}