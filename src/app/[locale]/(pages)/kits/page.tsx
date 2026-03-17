'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Gift, ShoppingCart, ArrowRight, Star, Package, Sparkles, Check } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.realpan.jp';

type KitImage = { imageUrl: string; isPrimary: boolean; sortOrder: number };
type KitProduct = {
  id: string; namePt: string; nameJa: string; slug: string;
  images: string[]; originalPrice: number; retailPrice: number;
  retailPriceWithTax: number; storageType: string; unit: string;
};
type KitItem = { id: string; product: KitProduct; quantity: number; sortOrder: number };
type Kit = {
  id: string; slug: string; namePt: string; nameJa: string;
  descriptionPt: string | null; descriptionJa: string | null;
  basePrice: number; promoPrice: number | null;
  effectivePrice: number; savingsAmount: number; savingsPercent: number;
  totalItems: number; primaryImage: string | null;
  giftEnabled: boolean; giftProduct: KitProduct | null;
  isFeatured: boolean;
  items: KitItem[]; images: KitImage[];
};

function getProductImage(product: KitProduct): string | null {
  if (product.images?.length > 0) {
    const img = product.images[0];
    return img.startsWith('http') ? img : `${API_URL}/uploads/products/${img}`;
  }
  return null;
}

function getKitImage(kit: Kit): string | null {
  if (kit.primaryImage) {
    return kit.primaryImage.startsWith('http') ? kit.primaryImage : `${API_URL}/uploads/kits/${kit.primaryImage}`;
  }
  // Fallback: first product image
  if (kit.items?.length > 0) {
    return getProductImage(kit.items[0].product);
  }
  return null;
}

export default function KitsPage() {
  const locale = useLocale() as 'pt' | 'ja';
  const { addItem } = useCart();
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedKit, setAddedKit] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/kits`)
      .then(r => r.json())
      .then(data => { if (data.success) setKits(data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddKit = (kit: Kit) => {
    // Adiciona o kit como item único no carrinho
    addItem({
      id: `kit-${kit.id}`,
      slug: `kits/${kit.slug}`,
      name: { pt: kit.namePt, ja: kit.nameJa },
      image: kit.primaryImage || kit.items?.[0]?.product?.images?.[0] || '',
      retailPrice: kit.effectivePrice,
      wholesalePrice: kit.effectivePrice,
      retailPriceWithTax: Math.ceil(kit.effectivePrice * 1.08),
      hasPromo: false,
      promoPrice: 0,
      stock: 999,
      storageType: 'FROZEN_READY',
      weightGrams: kit.items.reduce((sum: number, item: any) => sum + ((item.product as any)?.weightGrams || 0) * item.quantity, 0),
    } as any);
    setAddedKit(kit.id);
    setTimeout(() => setAddedKit(null), 2000);
  };

  return (
    <div className="flex flex-col bg-[#FAF7F2]">

      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-[#2A1810] via-[#1A2740] to-[#233550] text-white py-16 lg:py-24 overflow-hidden">
        <Image src="/images/hero-presentes.webp" alt="" fill className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2740]/80 via-[#1A2740]/30 to-transparent" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-[#D4972A] rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#ECC76E] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 container-custom text-center">
          <div className="inline-flex items-center gap-2 bg-[#D4972A] px-4 py-1.5 rounded-full text-sm mb-6 shadow-lg">
            <Gift className="h-4 w-4 text-white" />
            <span className="text-white font-semibold">
              {locale === 'pt' ? 'Kits Premium' : 'プレミアムキット'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            {locale === 'pt' ? 'Kits Especiais' : '特別セット'}
          </h1>
          <p className="text-white/85 max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
            {locale === 'pt'
              ? 'Seleções cuidadosas dos nossos melhores produtos, ideais para presentes e ocasiões especiais.'
              : '厳選された特別なセット商品。ギフトや特別な機会にぴったりです。'}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full"><path d="M0 0C480 45 960 45 1440 0V60H0V0Z" fill="#FAF7F2"/></svg>
        </div>
      </section>

      {/* ═══ KITS LIST ═══ */}
      <section className="py-10 sm:py-16 bg-[#FAF7F2]">
        <div className="container-custom">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#F5EDE0] border-t-[#D4972A]" />
                <p className="mt-4 text-sm text-[#57749A]">
                  {locale === 'pt' ? 'Carregando kits...' : 'セットを読み込み中...'}
                </p>
              </div>
            </div>
          ) : kits.length === 0 ? (
            <div className="py-20 text-center">
              <Gift className="h-16 w-16 text-[#DFD0B3] mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#1A2740] mb-2">
                {locale === 'pt' ? 'Em breve!' : '近日公開！'}
              </h2>
              <p className="text-[#57749A] mb-6 text-sm">
                {locale === 'pt'
                  ? 'Estamos preparando kits especiais para você. Volte em breve!'
                  : '特別なキットを準備中です。もうしばらくお待ちください！'}
              </p>
              <Link href={`/${locale}/products`}
                className="inline-flex items-center gap-2 bg-[#D4972A] hover:bg-[#B87A20] text-white px-6 py-3 rounded-full font-semibold text-sm transition-all">
                {locale === 'pt' ? 'Ver Produtos' : '商品一覧'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              {kits.map((kit) => {
                const name = locale === 'pt' ? kit.namePt : kit.nameJa;
                const desc = locale === 'pt' ? kit.descriptionPt : kit.descriptionJa;
                const kitImage = getKitImage(kit);
                const isAdded = addedKit === kit.id;

                return (
                  <div key={kit.id}
                    className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                      kit.isFeatured ? 'border-[#D4972A] shadow-lg' : 'border-[#F5EDE0] shadow-sm'
                    }`}>

                    {/* Featured badge */}
                    {kit.isFeatured && (
                      <div className="bg-gradient-to-r from-[#D4972A] to-[#B87A20] px-4 py-2 flex items-center justify-center gap-2">
                        <Star className="h-4 w-4 text-white fill-white" />
                        <span className="text-white text-xs font-bold uppercase tracking-wider">
                          {locale === 'pt' ? 'Kit mais vendido' : '人気No.1'}
                        </span>
                      </div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-0">
                      {/* ── Image ── */}
                      <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px] bg-[#FAF7F2]">
                        {kitImage ? (
                          <Image src={kitImage} alt={name} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Gift className="h-20 w-20 text-[#DFD0B3]" />
                          </div>
                        )}

                        {/* Savings badge */}
                        {kit.savingsPercent > 0 && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                            -{kit.savingsPercent}% OFF
                          </div>
                        )}

                        {/* Gallery thumbnails */}
                        {kit.images.length > 1 && (
                          <div className="absolute bottom-4 left-4 flex gap-2">
                            {kit.images.slice(0, 3).map((img, i) => (
                              <div key={i} className="w-12 h-12 rounded-lg border-2 border-white overflow-hidden shadow-sm bg-white">
                                <Image
                                  src={img.imageUrl.startsWith('http') ? img.imageUrl : `${API_URL}/uploads/kits/${img.imageUrl}`}
                                  alt="" width={48} height={48} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* ── Content ── */}
                      <div className="p-6 lg:p-8 flex flex-col">
                        {/* Kit name */}
                        <h2 className="text-2xl lg:text-3xl font-bold text-[#1A2740] mb-3">
                          {name}
                        </h2>

                        {/* Description */}
                        {desc && (
                          <p className="text-[#57749A] text-sm leading-relaxed mb-5">
                            {desc}
                          </p>
                        )}

                        {/* Items count */}
                        <div className="flex items-center gap-3 mb-5">
                          <div className="flex items-center gap-1.5 text-xs text-[#8099B8] bg-[#FAF7F2] px-3 py-1.5 rounded-full">
                            <Package className="h-3.5 w-3.5" />
                            {kit.totalItems} {locale === 'pt' ? 'itens' : '点'}
                          </div>
                          {kit.giftEnabled && kit.giftProduct && (
                            <div className="flex items-center gap-1.5 text-xs text-[#D4972A] bg-[#FDF8ED] px-3 py-1.5 rounded-full border border-[#ECC76E]/30">
                              <Sparkles className="h-3.5 w-3.5" />
                              {locale === 'pt' ? 'Brinde incluso!' : 'プレゼント付き！'}
                            </div>
                          )}
                        </div>

                        {/* Products in kit */}
                        <div className="mb-6">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4972A] mb-3">
                            {locale === 'pt' ? 'Conteúdo do Kit' : 'セット内容'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {kit.items.map((item) => {
                              const prodImg = getProductImage(item.product);
                              const prodName = locale === 'pt' ? item.product.namePt : item.product.nameJa;
                              return (
                                <div key={item.id}
                                  className="flex items-center gap-2 bg-[#FAF7F2] rounded-lg px-3 py-2 border border-[#F5EDE0]">
                                  {prodImg && (
                                    <div className="w-8 h-8 rounded overflow-hidden bg-white flex-shrink-0">
                                      <Image src={prodImg} alt="" width={32} height={32} className="w-full h-full object-contain" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium text-[#1A2740] truncate max-w-[140px]">{prodName}</p>
                                    {item.quantity > 1 && (
                                      <p className="text-[10px] text-[#8099B8]">×{item.quantity}</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}

                            {/* Gift product */}
                            {kit.giftEnabled && kit.giftProduct && (
                              <div className="flex items-center gap-2 bg-[#FDF8ED] rounded-lg px-3 py-2 border border-[#ECC76E]/30">
                                <Sparkles className="h-4 w-4 text-[#D4972A] flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-[#D4972A] truncate max-w-[140px]">
                                    {locale === 'pt' ? kit.giftProduct.namePt : kit.giftProduct.nameJa}
                                  </p>
                                  <p className="text-[10px] text-[#B87A20]">
                                    {locale === 'pt' ? 'Brinde' : 'プレゼント'}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1" />

                        {/* Price + CTA */}
                        <div className="flex items-end justify-between gap-4 pt-4 border-t border-[#F5EDE0]">
                          <div>
                            {kit.promoPrice && (
                              <span className="text-sm text-[#C9B896] line-through mr-2">
                                ¥{kit.basePrice.toLocaleString()}
                              </span>
                            )}
                            <span className="text-3xl font-bold text-[#1A2740] tabular-nums">
                              ¥{kit.effectivePrice.toLocaleString()}
                            </span>
                            <span className="text-xs text-[#8099B8] ml-1">(税込)</span>
                            {kit.savingsAmount > 0 && (
                              <p className="text-xs text-red-500 font-medium mt-1">
                                {locale === 'pt'
                                  ? `Economia de ¥${kit.savingsAmount.toLocaleString()}`
                                  : `¥${kit.savingsAmount.toLocaleString()}お得`}
                              </p>
                            )}
                          </div>

                          <button type="button" onClick={() => handleAddKit(kit)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-sm ${
                              isAdded
                                ? 'bg-green-500 text-white'
                                : 'bg-[#D4972A] hover:bg-[#B87A20] text-white active:scale-[0.97]'
                            }`}>
                            {isAdded ? (
                              <><Check className="h-4 w-4" /> {locale === 'pt' ? 'Adicionado!' : '追加済み！'}</>
                            ) : (
                              <><ShoppingCart className="h-4 w-4" /> {locale === 'pt' ? 'Adicionar ao Carrinho' : 'カートに入れる'}</>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-12 bg-[#1A2740] text-center">
        <div className="container-custom">
          <h2 className="text-xl lg:text-3xl font-semibold text-white mb-4">
            {locale === 'pt' ? 'Quer montar um kit personalizado?' : 'オリジナルキットを作りませんか？'}
          </h2>
          <p className="text-white/70 text-sm mb-6 max-w-lg mx-auto">
            {locale === 'pt'
              ? 'Entre em contato para criar kits corporativos com a seleção da sua empresa.'
              : '法人様向けに、オリジナルセットの作成を承ります。'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/${locale}/products`}
              className="inline-flex items-center justify-center gap-2 bg-[#D4972A] hover:bg-[#B87A20] text-white px-8 py-3 rounded-full font-semibold text-sm transition-all shadow-lg">
              {locale === 'pt' ? 'Ver Todos os Produtos' : '全商品を見る'}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-all">
              {locale === 'pt' ? 'Contato' : 'お問い合わせ'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}