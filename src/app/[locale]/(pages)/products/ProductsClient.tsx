'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Search, X, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/catalog/ProductCard';
import { loadAllProducts, loadCategories } from '@/lib/catalog-loader';
import { useCart } from '@/hooks/useCart';
import type { Product, Category } from '@/types/product';

export default function ProductsClient() {
  const locale = useLocale() as 'pt' | 'ja';
  const t = useTranslations('products');
  const router = useRouter();
  const { itemCount } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
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

        // Selecionar primeira categoria se houver
        if (cats.length > 0 && cats[0].id !== 'all') {
          setActiveCategory(cats[0].id);
        }
      } catch (err) {
        console.error('Failed to load catalog:', err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = products;

    // Filtro por categoria
    if (activeCategory !== 'all') {
      list = list.filter(p => p.categoryId === activeCategory);
    }

    // Filtro por busca
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.pt.toLowerCase().includes(q) ||
        p.name.ja.toLowerCase().includes(q) ||
        p.hinban.toLowerCase().includes(q)
      );
    }

    return list;
  }, [products, activeCategory, search]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
          <p className="mt-4 text-sm text-gray-500">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warmGray-50">

      {/* ═══════ HERO ═══════ */}
      <section className="bg-beige-50 py-10 lg:py-16">
        <div className="container-custom text-center">
          <h1 className="font-abril text-3xl lg:text-5xl text-gray-900 mb-3">
            {t('title')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm lg:text-base">
            {t('hero_description')}
          </p>
        </div>
      </section>

      {/* ═══════ FILTROS STICKY ═══════ */}
      <div className="sticky top-16 lg:top-[72px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container-custom">
          {/* Busca + Cart */}
          <div className="flex items-center gap-3 pt-3 pb-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Cart badge */}
            <Link
              href={`/${locale}/cart`}
              className="relative p-2.5 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 text-orange-600" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Categorias */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name[locale]}
              </button>
            ))}
            <span className="ml-auto flex-shrink-0 pl-4 text-sm text-gray-400 font-medium">
              {t('products_count', { count: filtered.length })}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════ GRID DE PRODUTOS ═══════ */}
      <section className="flex-1 py-6 lg:py-12">
        <div className="container-custom">
          {/* Título da categoria */}
          {activeCategory !== 'all' && (
            <div className="mb-4 lg:mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                {categories.find(c => c.id === activeCategory)?.name[locale]}
              </h2>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-6xl mb-4">🍞</div>
              <p className="text-gray-500">{t('no_products')}</p>
            </div>
          ) : (
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:gap-5 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════ BANNER RAKUTEN ═══════ */}
      <section className="bg-cream-50 py-10 lg:py-14 border-t border-orange-100">
        <div className="container-custom text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            🛒 {t('rakuten.badge')}
          </div>
          <h2 className="font-abril text-2xl lg:text-3xl text-gray-900 mb-3">
            {t('rakuten.title')}
          </h2>
          <p className="text-gray-600 mb-5 text-sm lg:text-base">
            {t('rakuten.description')}
          </p>
          <a
            href="https://www.rakuten.co.jp/realsabor/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-orange text-base"
          >
            🛒 {t('rakuten.cta')}
          </a>
        </div>
      </section>

      {/* ═══════ BANNER B2B ═══════ */}
      <section className="bg-gray-900 py-10 lg:py-14">
        <div className="container-custom">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                🏢 {t('b2b.badge')}
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                {t('b2b.title')}
              </h2>
              <p className="text-gray-300 leading-relaxed text-sm lg:text-base">
                {t('b2b.description')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <Link href={`/${locale}/order/business`} className="btn-orange">
                {t('b2b.cta_order')}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="btn-orange-outline bg-transparent border-white text-white hover:bg-white hover:text-gray-900"
              >
                {t('b2b.cta_contact')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
