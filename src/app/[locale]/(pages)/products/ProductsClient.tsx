'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Building2 } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/catalog/ProductCard';
import { loadAllProducts, loadCategories } from '@/lib/catalog-loader';
import type { Product, Category } from '@/types/product';

type SearchableProduct = Product & {
  description?: {
    pt?: string;
    ja?: string;
  };
  janCode?: string;
  quantityInfo?: string;
};

export default function ProductsClient() {
  const locale = useLocale() as 'pt' | 'ja';
  const t = useTranslations('products');
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('q') || '';

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

        if (!urlSearch && cats.length > 0 && cats[0].id !== 'all') {
          setActiveCategory(cats[0].id);
        }
      } catch (err) {
        console.error('Failed to load catalog:', err);
      }
      setLoading(false);
    }
    load();
  }, [urlSearch]);

  const normalize = (text: string): string =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[ー～〜]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

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
          product.name.pt,
          product.name.ja,
          product.hinban,
          product.description?.pt || '',
          product.description?.ja || '',
          product.janCode || '',
          product.quantityInfo || '',
        ].join(' '));

        return terms.every((term) => searchable.includes(term));
      });
    }

    return list;
  }, [products, activeCategory, urlSearch]);

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
      <section className="bg-beige-50 py-10 lg:py-16">
        <div className="container-custom text-center">
          <h1 className="font-abril text-3xl lg:text-5xl text-gray-900 mb-3">{t('title')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm lg:text-base">{t('hero_description')}</p>
        </div>
      </section>

      <div className="sticky top-16 lg:top-[72px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => {
              const isSearching = urlSearch.trim().length > 0;
              const isActive = activeCategory === cat.id && !isSearching;
              return (
                <Link
                  key={cat.id}
                  href={`/${locale}/products`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveCategory(cat.id);
                  }}
                  className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md'
                      : isSearching
                      ? 'bg-gray-50 text-gray-400'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name[locale]}
                </Link>
              );
            })}
            <span className="ml-auto flex-shrink-0 pl-4 text-sm text-gray-400 font-medium">
              {t('products_count', { count: filtered.length })}
            </span>
          </div>
        </div>
      </div>

      <section className="flex-1 py-6 lg:py-12">
        <div className="container-custom">
          {urlSearch.trim() ? (
            <div className="mb-4 lg:mb-6 flex items-center gap-2 flex-wrap">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                {locale === 'ja' ? `「${urlSearch}」の検索結果` : `Resultados para "${urlSearch}"`}
              </h2>
              <span className="text-sm text-gray-400">({filtered.length})</span>
              <Link href={`/${locale}/products`} className="ml-auto text-sm text-orange-600 hover:underline">
                {locale === 'ja' ? '検索をクリア' : 'Limpar busca'}
              </Link>
            </div>
          ) : activeCategory !== 'all' && (
            <div className="mb-4 lg:mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                {categories.find((c) => c.id === activeCategory)?.name[locale]}
              </h2>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-6xl mb-4">🍞</div>
              <p className="text-gray-500 mb-4">{t('no_products')}</p>
              {urlSearch && (
                <Link href={`/${locale}/products`} className="inline-flex items-center gap-2 text-orange-600 hover:underline font-medium">
                  {locale === 'ja' ? 'すべての商品を見る' : 'Ver todos os produtos'}
                </Link>
              )}
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

      <section className="bg-gray-900 py-10 lg:py-14">
        <div className="container-custom">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                <Building2 className="w-3.5 h-3.5" />
                {t('b2b.badge')}
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">{t('b2b.title')}</h2>
              <p className="text-gray-300 leading-relaxed text-sm lg:text-base">{t('b2b.description')}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <Link href={`/${locale}/register`} className="btn-orange">
                {locale === 'pt' ? '🏢 Criar Conta Empresarial' : '🏢 法人アカウント作成'}
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