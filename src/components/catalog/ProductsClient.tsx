'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/catalog/ProductCard';
import type { ProductCardProduct } from '@/components/catalog/ProductCard';

/* ─────────────────────────── Types ─────────────────────────── */
interface Category {
  id: string;
  namePt: string;
  nameJa: string;
  slug: string;
  productCount?: number;
}

interface ProductsClientProps {
  initialProducts: ProductCardProduct[];
  categories: Category[];
  initialCategory?: string;
}

/* ─────────────────────────── Sort options ─────────────────────────── */
type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'popular';

const SORT_OPTIONS: { key: SortKey; labelPt: string; labelJa: string }[] = [
  { key: 'newest',    labelPt: 'Mais recentes', labelJa: '新着順' },
  { key: 'popular',   labelPt: 'Populares',     labelJa: '人気順' },
  { key: 'price-asc', labelPt: 'Menor preço',   labelJa: '価格の安い順' },
  { key: 'price-desc',labelPt: 'Maior preço',   labelJa: '価格の高い順' },
];

/* ─────────────────────────── Component ─────────────────────────── */
export default function ProductsClient({
  initialProducts,
  categories,
  initialCategory,
}: ProductsClientProps) {
  const locale = useLocale() as 'pt' | 'ja';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [showSort, setShowSort] = useState(false);

  /* ── Filter & Sort ── */
  const filtered = useMemo(() => {
    let result = [...initialProducts];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.namePt.toLowerCase().includes(q) ||
          p.nameJa.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.originalPrice - b.originalPrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.originalPrice - a.originalPrice);
        break;
      case 'popular':
        result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  const activeSortLabel = SORT_OPTIONS.find((o) => o.key === sortBy);

  return (
    <div className="min-h-screen bg-cream-50">
      {/* ═══════ HERO BANNER ═══════ */}
      <section className="relative bg-navy-800 overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4972A' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container-custom relative z-10 py-10 sm:py-14 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-bread-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              {locale === 'pt' ? 'Produtos' : '商品一覧'}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4 text-balance">
              {locale === 'pt'
                ? 'Sabor autêntico do Brasil,\nentregue no Japão'
                : 'ブラジルの本場の味を\n日本へお届け'}
            </h1>
            <p className="text-cream-300 text-sm sm:text-base max-w-lg leading-relaxed">
              {locale === 'pt'
                ? 'Pão de queijo, pães artesanais e congelados de alta qualidade. Entrega em todo o Japão.'
                : 'ポン・デ・ケイジョ、職人の手作りパン、高品質な冷凍パン。全国配送対応。'}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ TOOLBAR (sticky) ═══════ */}
      <div className="sticky top-0 z-30 bg-cream-50/95 backdrop-blur-md border-b border-cream-200">
        <div className="container-custom">
          {/* ── Category pills (horizontally scrollable on mobile) ── */}
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {/* "All" pill */}
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all
                ${
                  selectedCategory === 'all'
                    ? 'bg-bread-500 text-white shadow-sm'
                    : 'bg-white text-navy-600 border border-cream-300 hover:border-bread-300 hover:text-bread-600'
                }`}
            >
              {locale === 'pt' ? 'Todos' : 'すべて'}
              <span className="ml-1 text-xs opacity-70">({initialProducts.length})</span>
            </button>

            {categories.map((cat) => {
              const catName = locale === 'pt' ? cat.namePt : cat.nameJa;
              const count = initialProducts.filter((p) => p.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all
                    ${
                      selectedCategory === cat.id
                        ? 'bg-bread-500 text-white shadow-sm'
                        : 'bg-white text-navy-600 border border-cream-300 hover:border-bread-300 hover:text-bread-600'
                    }`}
                >
                  {catName}
                  {count > 0 && (
                    <span className="ml-1 text-xs opacity-70">({count})</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Search + Sort row ── */}
          <div className="flex items-center gap-3 pb-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === 'pt' ? 'Buscar produto...' : '商品を検索...'}
                className="w-full rounded-xl border border-cream-300 bg-white
                           pl-10 pr-10 py-2.5 text-sm text-navy-800
                           placeholder:text-navy-300
                           focus:outline-none focus:ring-2 focus:ring-bread-400/50 focus:border-bread-400
                           transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-500"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 rounded-xl border border-cream-300 bg-white
                           px-4 py-2.5 text-sm font-medium text-navy-600
                           hover:border-bread-300 transition-all"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {locale === 'pt' ? activeSortLabel?.labelPt : activeSortLabel?.labelJa}
                </span>
              </button>

              {showSort && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSort(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50
                                  bg-white rounded-xl border border-cream-200 shadow-float
                                  py-1 min-w-[180px] animate-fade-in">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.key);
                          setShowSort(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                          ${
                            sortBy === opt.key
                              ? 'bg-bread-50 text-bread-600 font-medium'
                              : 'text-navy-600 hover:bg-cream-100'
                          }`}
                      >
                        {locale === 'pt' ? opt.labelPt : opt.labelJa}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ PRODUCT GRID ═══════ */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Results count */}
          <p className="text-xs text-navy-400 mb-4">
            {filtered.length}
            {locale === 'pt' ? ' produtos encontrados' : ' 件の商品'}
          </p>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <span className="text-5xl block mb-4">🍞</span>
              <p className="text-navy-400 text-sm">
                {locale === 'pt'
                  ? 'Nenhum produto encontrado.'
                  : '商品が見つかりませんでした。'}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-bread-500 text-sm font-medium hover:underline"
                >
                  {locale === 'pt' ? 'Limpar busca' : '検索をクリア'}
                </button>
              )}
            </div>
          ) : (
            /* ── Grid: 2 col mobile | 3 col md | 4 col xl ── */
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-5 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
