'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, Snowflake, Truck, ShieldCheck } from 'lucide-react';
import { HeroSection } from '@/components/home/HeroSection';
import { ProductCard } from '@/components/catalog/ProductCard';
import { loadAllProducts, loadCategories } from '@/lib/catalog-loader';
import type { Product, Category } from '@/types/product';

/* ─────────────────────────── Category Emoji Map ─────────────────────────── */
// Mapeia slug ou nome parcial da categoria para emoji + cor temática
// Quando você tiver vetores SVG, basta trocar por <Image src="/categories/slug.svg" />
const CATEGORY_STYLE: Record<string, { emoji: string; bg: string }> = {
  // Por slug
  'pao':        { emoji: '🥖', bg: 'bg-amber-50' },
  'bread':      { emoji: '🥖', bg: 'bg-amber-50' },
  'pan':        { emoji: '🥖', bg: 'bg-amber-50' },
  'pastel':     { emoji: '🥟', bg: 'bg-yellow-50' },
  'salgado':    { emoji: '🧆', bg: 'bg-[#FDF8ED]' },
  'doce':       { emoji: '🍰', bg: 'bg-pink-50' },
  'sweet':      { emoji: '🍰', bg: 'bg-pink-50' },
  'okashi':     { emoji: '🍪', bg: 'bg-pink-50' },
  'cookie':     { emoji: '🍪', bg: 'bg-pink-50' },
  'souzai':     { emoji: '🍱', bg: 'bg-green-50' },
  'side':       { emoji: '🍱', bg: 'bg-green-50' },
  'spice':      { emoji: '🌶️', bg: 'bg-red-50' },
  'koshinryo':  { emoji: '🌶️', bg: 'bg-red-50' },
  'tempero':    { emoji: '🌶️', bg: 'bg-red-50' },
  'bebida':     { emoji: '🥤', bg: 'bg-cyan-50' },
  'drink':      { emoji: '🥤', bg: 'bg-cyan-50' },
  'frozen':     { emoji: '❄️', bg: 'bg-sky-50' },
  'congelado':  { emoji: '❄️', bg: 'bg-sky-50' },
  'other':      { emoji: '🛒', bg: 'bg-gray-50' },
  'outros':     { emoji: '🛒', bg: 'bg-gray-50' },
  'sonota':     { emoji: '🛒', bg: 'bg-gray-50' },
  'queijo':     { emoji: '🧀', bg: 'bg-yellow-50' },
  'cheese':     { emoji: '🧀', bg: 'bg-yellow-50' },
};

function getCategoryStyle(cat: Category): { emoji: string; bg: string } {
  // Tenta match por slug
  const slug = cat.slug?.toLowerCase() || '';
  for (const [key, style] of Object.entries(CATEGORY_STYLE)) {
    if (slug.includes(key)) return style;
  }
  // Tenta match pelo nome pt
  const namePt = cat.name.pt?.toLowerCase() || '';
  for (const [key, style] of Object.entries(CATEGORY_STYLE)) {
    if (namePt.includes(key)) return style;
  }
  // Tenta match pelo nome ja
  const nameJa = cat.name.ja || '';
  if (nameJa.includes('パン')) return CATEGORY_STYLE['pao'];
  if (nameJa.includes('パステル')) return CATEGORY_STYLE['pastel'];
  if (nameJa.includes('惣菜')) return CATEGORY_STYLE['souzai'];
  if (nameJa.includes('菓子')) return CATEGORY_STYLE['okashi'];
  if (nameJa.includes('香辛料')) return CATEGORY_STYLE['spice'];
  if (nameJa.includes('その他')) return CATEGORY_STYLE['other'];

  // Fallback
  return { emoji: '📦', bg: 'bg-cream-100' };
}

/* ─────────────────────────── Shuffle helper ─────────────────────────── */
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/* ─────────────────────────── Component ─────────────────────────── */
export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale();
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);





  // ── Load data ──
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [allProducts, allCategories] = await Promise.all([
          loadAllProducts(),
          loadCategories(),
        ]);

        // 6 produtos aleatórios
        const shuffled = shuffleArray(allProducts);
        setRandomProducts(shuffled.slice(0, 6));

        // Categorias sem "Todos"
        setCategories(allCategories.filter((c: Category) => c.id !== 'all'));
      } catch (err) {
        console.error('Failed to load:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);



  // ── Value props ──
  const valueProps = [
    {
      icon: Snowflake,
      titlePt: 'Congelamento Rápido',
      titleJa: '急速冷凍',
      descPt: 'Preserva sabor e textura',
      descJa: '焼きたての美味しさをそのまま',
    },
    {
      icon: Truck,
      titlePt: 'Entrega Nacional',
      titleJa: '全国配送',
      descPt: 'Enviamos para todo o Japão',
      descJa: '日本全国にお届けします',
    },
    {
      icon: ShieldCheck,
      titlePt: 'Qualidade Premium',
      titleJa: '高品質',
      descPt: 'Ingredientes selecionados',
      descJa: '厳選素材を使用',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">

      <HeroSection />

      {/* ═══════════════════ VALUE PROPS ═══════════════════ */}
      <section className="bg-white border-b border-[#F5EDE0]">
        <div className="container-custom py-6">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {valueProps.map((prop, i) => {
              const Icon = prop.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FDF8ED] flex items-center justify-center">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4972A]" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-[#1A2740]">
                    {locale === 'pt' ? prop.titlePt : prop.titleJa}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[#57749A] hidden sm:block">
                    {locale === 'pt' ? prop.descPt : prop.descJa}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CATEGORIAS ═══════════════════ */}
      {categories.length > 0 && (
        <section className="py-8 sm:py-12 bg-[#FAF7F2]">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg sm:text-2xl font-semibold text-[#1A2740]">
                {locale === 'pt' ? 'Categorias' : 'カテゴリ'}
              </h2>
              <Link href={`/${locale}/products`}
                className="text-sm text-[#D4972A] font-medium hover:underline flex items-center gap-1">
                {locale === 'pt' ? 'Ver tudo' : 'すべて見る'}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4
                            sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {categories.map((cat) => {
                const style = getCategoryStyle(cat);
                const hasImage = !!cat.image;
                return (
                  <Link
                    key={cat.id}
                    href={`/${locale}/products?category=${cat.slug}`}
                    className="flex-shrink-0 w-[110px] sm:w-auto flex flex-col items-center gap-2.5 p-4
                               rounded-2xl bg-white border border-[#F5EDE0]
                               hover:border-[#D4972A] hover:shadow-md
                               transition-all group"
                  >
                    {hasImage ? (
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-[#FAF7F2]">
                        <Image
                          src={cat.image!.startsWith('http') ? cat.image! : `${process.env.NEXT_PUBLIC_API_URL || ''}/uploads/categories/${cat.image}`}
                          alt={locale === 'pt' ? cat.name.pt : cat.name.ja}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${style.bg}
                                       flex items-center justify-center
                                       group-hover:scale-110 transition-transform`}>
                        <span className="text-2xl sm:text-3xl">{style.emoji}</span>
                      </div>
                    )}
                    <span className="text-[11px] sm:text-sm font-medium text-[#1A2740] text-center leading-tight
                                     group-hover:text-[#D4972A] transition-colors">
                      {locale === 'pt' ? cat.name.pt : cat.name.ja}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ PRODUTOS — 6 ALEATÓRIOS ═══════════════════ */}
      <section className="py-10 sm:py-16 bg-[#FAF7F2]">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-3xl font-semibold text-[#1A2740] mb-1">
                {locale === 'pt' ? 'Nossos Produtos' : 'おすすめ商品'}
              </h2>
              <p className="text-sm text-[#57749A]">
                {locale === 'pt'
                  ? 'Descubra sabores autênticos do Brasil'
                  : 'ブラジルの本格的な味をお楽しみください'}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#F5EDE0] border-t-[#D4972A] mb-3" />
                <p className="text-sm text-[#57749A]">
                  {locale === 'pt' ? 'Carregando...' : '読み込み中...'}
                </p>
              </div>
            </div>
          ) : randomProducts.length > 0 ? (
            <>
              {/* Grid: 2 col mobile, 3 col tablet, 3 col desktop (6 produtos) */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                {randomProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* CTA — Ver todos */}
              <div className="mt-10 text-center">
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex items-center gap-2 bg-[#D4972A] hover:bg-[#B87A20] text-white
                             px-10 py-3.5 rounded-full text-sm font-bold transition-all
                             shadow-md hover:shadow-lg active:scale-[0.97]"
                >
                  {locale === 'pt' ? 'Ver Todos os Produtos' : 'すべての商品を見る'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-xs text-[#8099B8] mt-2">
                  {locale === 'pt' ? '280+ produtos disponíveis' : '280以上の商品をご用意'}
                </p>
              </div>
            </>
          ) : (
            <div className="py-16 text-center">
              <span className="text-4xl block mb-3">🍞</span>
              <p className="text-[#57749A]">
                {locale === 'pt' ? 'Nenhum produto disponível' : '商品がありません'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════ ABOUT ═══════════════════ */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/about/process.webp"
                alt={locale === 'pt' ? 'Processo de fabricação' : '製造工程'}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4972A] mb-3">
                {locale === 'pt' ? 'Nosso Compromisso' : 'こだわり'}
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A2740] mb-5 leading-snug">
                {locale === 'pt'
                  ? 'Pão fresco congelado,\nsabor de padaria em casa'
                  : '新鮮な冷凍パン\n焼きたてのおいしさをご家庭で'}
              </h2>
              <p className="text-sm sm:text-base text-[#57749A] leading-relaxed mb-6">
                {locale === 'pt'
                  ? 'Nossos pães são feitos com ingredientes premium e congelados rapidamente para preservar a frescura. Basta aquecer no forno para ter o sabor autêntico do Brasil na sua mesa.'
                  : '素材と製法にこだわった上質なパンを、冷凍庫にストックできる安心感。焼きたての鮮度をそのまま閉じ込めて直送するから、ひとくち食べれば外はカリッと、中はふんわり。'}
              </p>
              <Link
                href={`/${locale}/feature`}
                className="inline-flex items-center gap-2 border-2 border-[#D4972A] text-[#D4972A]
                           px-6 py-2.5 rounded-full text-sm font-semibold
                           hover:bg-[#D4972A] hover:text-white transition-all"
              >
                {locale === 'pt' ? 'Saiba mais' : 'こだわりを見る'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ B2B CTA ═══════════════════ */}
      <section className="py-12 sm:py-16 bg-[#1A2740]">
        <div className="container-custom text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ECC76E] mb-3">
            {locale === 'pt' ? 'Para Empresas' : '法人のお客様'}
          </p>
          <h2 className="text-xl sm:text-3xl font-semibold text-white mb-4 leading-snug">
            {locale === 'pt'
              ? 'Hotéis, restaurantes e supermercados'
              : 'ホテル・レストラン・スーパーなど'}
          </h2>
          <p className="text-sm text-[#8099B8] max-w-lg mx-auto mb-8 leading-relaxed">
            {locale === 'pt'
              ? 'Atendemos pedidos em volume com logística especializada para todo o Japão.'
              : '大量注文・専用物流に対応。法人様向けに特別価格でご提供しています。'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center gap-2 bg-[#D4972A] hover:bg-[#B87A20] text-white
                         px-8 py-3 rounded-full text-sm font-semibold transition-all shadow-lg"
            >
              {locale === 'pt' ? 'Serviços B2B' : 'サービス案内'}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white
                         px-8 py-3 rounded-full text-sm font-semibold
                         hover:bg-white/10 transition-all"
            >
              {locale === 'pt' ? 'Contato' : 'お問い合わせ'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}