'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductCard } from '@/components/catalog/ProductCard';
import { loadAllProducts, loadCategories } from '@/lib/catalog-loader';
import type { Product, Category } from '@/types/product';

export default function ProductsClient() {
  const locale = useLocale() as 'pt' | 'ja';
  const t = useTranslations('products');
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState('breads'); // PÃES PRIMEIRO
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        loadAllProducts(),
        loadCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    }
    load();
  }, []);

  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleContact = useCallback(
    (productName: string) => {
      router.push(`/${locale}/contact?product=${encodeURIComponent(productName)}`);
    },
    [locale, router]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
          <p className="mt-4 text-sm text-gray-500">
            {locale === 'pt' ? 'Carregando produtos...' : '商品を読み込み中...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warmGray-50">

      {/* ═══════ HERO ═══════ */}
      <section className="bg-beige-50 py-12 lg:py-20">
        <div className="container-custom text-center">
          <h1 className="font-abril text-3xl lg:text-5xl text-gray-900 mb-4">
            {locale === 'pt' ? 'Nossos Produtos' : '商品一覧'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {locale === 'pt' 
              ? 'Pães premium brasileiros feitos com ingredientes selecionados. Congelamento rápido para preservar o sabor.'
              : 'ブラジル伝統の高品質パン。厳選された材料で作られ、急速冷凍で美味しさを保ちます。'}
          </p>
        </div>
      </section>

      {/* ═══════ FILTROS STICKY ═══════ */}
      <div className="sticky top-16 lg:top-[148px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name[locale]}
              </button>
            ))}
            <span className="ml-auto flex-shrink-0 pl-4 text-sm text-gray-500 font-medium">
              {filtered.length}
              {locale === 'pt' ? ' produtos' : ' 商品'}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════ GRID DE PRODUTOS ═══════ */}
      <section className="flex-1 py-8 lg:py-16">
        <div className="container-custom">
          
          {/* Título da categoria ativa */}
          {activeCategory !== 'all' && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {categories.find(c => c.id === activeCategory)?.name[locale]}
              </h2>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-6xl mb-4">🍞</div>
              <p className="text-gray-500">
                {locale === 'pt' ? 'Nenhum produto encontrado.' : '商品がありません。'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onContact={handleContact}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════ BANNER RAKUTEN ═══════ */}
      <section className="bg-cream-50 py-12 lg:py-16 border-t border-orange-100">
        <div className="container-custom text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
            {locale === 'pt' ? '🛒 COMPRA ONLINE' : '🛒 オンライン購入'}
          </div>
          
          <h2 className="font-abril text-2xl lg:text-4xl text-gray-900 mb-4">
            {locale === 'pt' ? 'Compre na Rakuten' : '楽天ショップでご購入'}
          </h2>
          
          <p className="text-gray-600 mb-6 lg:mb-8">
            {locale === 'pt'
              ? 'Entrega refrigerada em todo o Japão. Produtos selecionados para consumidor final.'
              : '日本全国に冷凍配送。個人のお客様向けの商品を販売中。'}
          </p>
          
          <a
            href="https://www.rakuten.co.jp/realsabor/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-orange text-base lg:text-lg"
          >
            {locale === 'pt' ? '🛒 Ir para a Rakuten' : '🛒 楽天ショップへ'}
          </a>
        </div>
      </section>

      {/* ═══════ BANNER B2B ═══════ */}
      <section className="bg-gray-900 py-12 lg:py-16">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                {locale === 'pt' ? '🏢 EMPRESAS' : '🏢 法人様'}
              </div>
              
              <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">
                {locale === 'pt'
                  ? 'Pedidos Corporativos'
                  : '法人様向け大量注文'}
              </h2>
              
              <p className="text-gray-300 leading-relaxed">
                {locale === 'pt'
                  ? 'Atendemos restaurantes, hotéis, supermercados e distribuidores com condições especiais para grandes volumes.'
                  : 'レストラン・ホテル・スーパーなど法人様向けに、大量注文・専用物流に対応しています。'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Link 
                href={`/${locale}/order/business`}
                className="btn-orange"
              >
                {locale === 'pt' ? 'Pedido Corporativo' : '法人注文フォーム'}
              </Link>
              
              <Link
                href={`/${locale}/contact`}
                className="btn-orange-outline bg-transparent border-white text-white hover:bg-white hover:text-gray-900"
              >
                {locale === 'pt' ? 'Fale Conosco' : 'お問い合わせ'}
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}