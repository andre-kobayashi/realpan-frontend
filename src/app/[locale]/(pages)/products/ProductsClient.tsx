'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Building2, ArrowRight, X, Gift } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/catalog/ProductCard';
import { loadAllProducts, loadCategories } from '@/lib/catalog-loader';
import type { Product, Category } from '@/types/product';

/* ── Category icon map ── */
const CATEGORY_ICON_MAP: Record<string, string> = {
  'outros-produtos': '/categories/outros.svg',
  'pasteis':         '/categories/pastel.svg',
  'salgados':        '/categories/salgados.svg',
  'doces':           '/categories/doces.svg',
  'paes-congelados': '/categories/pao.svg',
  'especiarias':     '/categories/temperos.svg',
  'sorvetes':        '/categories/sorvetes.svg',
  'bolos':           '/categories/bolos.svg',
  'paes':            '/categories/pao.svg',
};

type SearchableProduct = Product & {
  description?: { pt?: string; ja?: string };
  janCode?: string;
  quantityInfo?: string;
};

export default function ProductsClient() {
  const locale = useLocale() as 'pt' | 'ja';
  const t = useTranslations('products');
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('q') || '';
  const urlCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [prods, cats] = await Promise.all([
          loadAllProducts(),
          loadCategories(),
        ]);
        setProducts(prods);
        setCategories(cats);

        // Se veio categoria na URL
        if (urlCategory) {
          const matchCat = cats.find((c: Category) => c.slug === urlCategory);
          if (matchCat) setActiveCategory(matchCat.id);
        } else if (!urlSearch && cats.length > 0 && cats[0].id !== 'all') {
          setActiveCategory(cats[0].id);
        }
      } catch (err) {
        console.error('Failed to load catalog:', err);
      }
      setLoading(false);
    }
    load();
  }, [urlSearch, urlCategory]);

  const normalize = (text: string): string =>
    text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[ー～〜]/g, '').replace(/\s+/g, ' ').trim();

  const filtered = useMemo(() => {
    let list = products;
    const hasSearch = urlSearch.trim().length > 0;

    if (activeCategory !== 'all' && !hasSearch) {
      list = list.filter((p) => p.categoryId === activeCategory);
    }

    if (hasSearch) {
      const terms = normalize(urlSearch).split(' ').filter(Boolean);
      list = list.filter((p) => {
        const product = p as SearchableProduct;
        const searchable = normalize([
          product.name.pt, product.name.ja, product.hinban,
          product.description?.pt || '', product.description?.ja || '',
          product.janCode || '', product.quantityInfo || '',
        ].join(' '));
        return terms.every((term) => searchable.includes(term));
      });
    }

    return list;
  }, [products, activeCategory, urlSearch]);

  const activeCategoryData = categories.find((c) => c.id === activeCategory);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#F5EDE0] border-t-[#D4972A]" />
          <p className="mt-4 text-sm text-[#57749A]">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2]">

      {/* ═══════ HERO ═══════ */}
      <section className="relative bg-gradient-to-br from-[#2A1810] via-[#1A2740] to-[#233550] text-white py-14 lg:py-20 overflow-hidden">
        <Image src="/images/hero-pao-de-queijo.webp" alt="" fill className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2740]/80 via-[#1A2740]/30 to-transparent" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-[#D4972A] rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#ECC76E] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 container-custom text-center">
          <div className="inline-flex items-center gap-2 bg-[#D4972A] px-4 py-1.5 rounded-full text-sm mb-6 shadow-lg">
            <span className="text-white font-semibold">{locale === 'pt' ? 'Catálogo' : '商品カタログ'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            {t('title')}
          </h1>
          <p className="text-white/85 max-w-2xl mx-auto text-sm lg:text-base leading-relaxed">
            {t('hero_description')}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full"><path d="M0 0C480 45 960 45 1440 0V60H0V0Z" fill="#FAF7F2"/></svg>
        </div>
      </section>

      {/* ═══════ CATEGORY PILLS (sticky) ═══════ */}
      <div className="sticky top-14 lg:top-[148px] z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#F5EDE0]">
        <div className="container-custom">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => {
              const isSearching = urlSearch.trim().length > 0;
              const isActive = activeCategory === cat.id && !isSearching;
              const iconPath = CATEGORY_ICON_MAP[cat.slug];

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-[#D4972A] text-white shadow-sm'
                      : isSearching
                        ? 'bg-white/60 text-[#C9B896] border border-[#F5EDE0]'
                        : 'bg-white text-[#1A2740] border border-[#F5EDE0] hover:border-[#D4972A] hover:text-[#D4972A]'
                    }`}
                >
                  {/* Mini icon on active pill */}
                  {iconPath && isActive && (
                    <Image src={iconPath} alt="" width={16} height={16} className="w-4 h-4 brightness-200" />
                  )}
                  {cat.name[locale]}
                </button>
              );
            })}

            {/* Count */}
            <span className="ml-auto flex-shrink-0 pl-3 text-xs text-[#8099B8] font-medium tabular-nums">
              {filtered.length} {locale === 'pt' ? 'produtos' : '商品'}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════ SEARCH RESULT HEADER ═══════ */}
      {urlSearch.trim() && (
        <div className="container-custom pt-5 pb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1A2740]">
              {locale === 'ja' ? `「${urlSearch}」の検索結果` : `Resultados para "${urlSearch}"`}
            </h2>
            <span className="text-sm text-[#8099B8]">({filtered.length})</span>
            <Link href={`/${locale}/products`}
              className="ml-auto text-sm text-[#D4972A] font-medium hover:underline flex items-center gap-1">
              <X className="w-3.5 h-3.5" />
              {locale === 'ja' ? '検索をクリア' : 'Limpar busca'}
            </Link>
          </div>
        </div>
      )}

      {/* ═══════ CATEGORY HEADER ═══════ */}
      {!urlSearch.trim() && activeCategory !== 'all' && activeCategoryData && (
        <div className="container-custom pt-5 pb-2">
          <div className="flex items-center gap-3">
            {CATEGORY_ICON_MAP[activeCategoryData.slug] && (
              <Image
                src={CATEGORY_ICON_MAP[activeCategoryData.slug]}
                alt=""
                width={32}
                height={32}
                className="w-8 h-8"
              />
            )}
            <h2 className="text-lg sm:text-xl font-semibold text-[#1A2740]">
              {activeCategoryData.name[locale]}
            </h2>
          </div>
        </div>
      )}

      {/* ═══════ PRODUCT GRID ═══════ */}
      <section className="flex-1 py-4 sm:py-6 lg:py-10">
        <div className="container-custom">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <span className="text-5xl block mb-4">🍞</span>
              <p className="text-[#57749A] mb-4">{t('no_products')}</p>
              {urlSearch && (
                <Link href={`/${locale}/products`}
                  className="inline-flex items-center gap-2 text-[#D4972A] hover:underline font-medium text-sm">
                  {locale === 'ja' ? 'すべての商品を見る' : 'Ver todos os produtos'}
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:gap-5 xl:grid-cols-4 gap-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>


      {/* ═══════ KITS PREMIUM CTA ═══════ */}
      <section className="bg-gradient-to-r from-[#D4972A] to-[#B87A20] py-8 lg:py-10">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {locale === 'pt' ? 'Kits Premium' : 'プレミアムキット'}
                </h3>
                <p className="text-white/80 text-sm">
                  {locale === 'pt' ? 'Seleções especiais dos nossos melhores produtos' : '厳選された特別セット商品'}
                </p>
              </div>
            </div>
            <Link href={`/${locale}/kits`}
              className="inline-flex items-center gap-2 bg-white text-[#D4972A] hover:bg-white/90
                         px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm whitespace-nowrap">
              {locale === 'pt' ? 'Ver Kits' : 'キットを見る'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ B2B CTA ═══════ */}
      <section className="bg-[#1A2740] py-10 lg:py-14">
        <div className="container-custom">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#D4972A] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                <Building2 className="w-3.5 h-3.5" />
                {t('b2b.badge')}
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-3">{t('b2b.title')}</h2>
              <p className="text-[#8099B8] leading-relaxed text-sm lg:text-base">{t('b2b.description')}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <Link href={`/${locale}/register`}
                className="inline-flex items-center justify-center gap-2 bg-[#D4972A] hover:bg-[#B87A20] text-white
                           px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-sm">
                <Building2 className="w-4 h-4" />
                {locale === 'pt' ? 'Criar Conta Empresarial' : '法人アカウント作成'}
              </Link>
              <Link href={`/${locale}/contact`}
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white
                           px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/10 transition-all">
                {t('b2b.cta_contact')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}