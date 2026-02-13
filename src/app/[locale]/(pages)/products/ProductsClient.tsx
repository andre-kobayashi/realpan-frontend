'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Snowflake, Building2, User } from 'lucide-react';
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
  const [activeCategory, setActiveCategory] = useState('all');
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
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-700" />
          <p className="mt-4 text-sm text-neutral-500">
            {locale === 'pt' ? 'Carregando produtos...' : '商品を読み込み中...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-safe lg:pb-0">

      {/* ═══════ HERO ═══════ */}
      <section className="bg-primary-800 py-10 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(244,196,48,0.10)_0%,_transparent_60%)]" />
        <div className="container-custom relative z-10">

          <div className="max-w-2xl">
            <p className="text-accent-400 text-xs font-semibold tracking-widest uppercase mb-2 lg:mb-3">
              Products / 商品一覧
            </p>
            <h1 className="text-2xl lg:text-5xl font-bold text-white mb-2 lg:mb-4 tracking-tight">
              {t('title')}
            </h1>
            <p className="text-white/65 text-sm lg:text-lg leading-relaxed hidden sm:block">
              {t('subtitle')}
            </p>
          </div>

          {/* Quick stats — desktop only */}
          <div className="mt-8 hidden lg:flex flex-wrap gap-6 text-sm">
            {[
              { Icon: Snowflake,  label: locale === 'pt' ? 'Congelamento rápido'      : '急速冷凍技術' },
              { Icon: Building2, label: locale === 'pt' ? 'Pedidos corporativos (PJ)' : '法人対応' },
              { Icon: User,      label: locale === 'pt' ? 'Disponível no varejo'      : '個人販売あり' },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-white/60">
                <Icon className="h-4 w-4 text-accent-400" />
                <span>{label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════ FILTROS sticky ═══════ */}
      <div className="sticky top-14 lg:top-[148px] z-30 bg-white/96 backdrop-blur border-b border-neutral-200 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 lg:py-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 rounded-full px-4 py-1.5 lg:px-5 lg:py-2 text-xs lg:text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary-700 text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {cat.name[locale]}
              </button>
            ))}
            <span className="ml-auto flex-shrink-0 pl-4 text-xs text-neutral-400">
              {filtered.length}{locale === 'pt' ? ' produtos' : ' 商品'}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════ GRID ═══════ */}
      <section className="flex-1 py-6 lg:py-14 bg-neutral-50">
        <div className="container-custom">
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-neutral-400">
              <p className="text-5xl mb-4">🍞</p>
              <p>{locale === 'pt' ? 'Nenhum produto encontrado.' : '商品がありません。'}</p>
            </div>
          ) : (
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
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

      {/* ═══════ BANNER B2B ═══════ */}
      <section className="bg-primary-800 py-10 lg:py-16">
        <div className="container-custom grid gap-6 lg:gap-8 lg:grid-cols-2 items-center">
          <div>
            <p className="text-accent-400 text-xs font-semibold tracking-widest uppercase mb-2 lg:mb-3">
              {locale === 'pt' ? 'Para empresas' : '法人のお客様へ'}
            </p>
            <h2 className="text-xl lg:text-3xl font-bold text-white mb-3 lg:mb-4">
              {locale === 'pt'
                ? 'Pedidos em volume com logística especializada'
                : '大量注文・専門物流対応'}
            </h2>
            <p className="text-white/65 text-sm leading-relaxed">
              {locale === 'pt'
                ? 'Atendemos hotéis, restaurantes, redes de supermercados e distribuidores com condições especiais para volumes maiores.'
                : 'ホテル・レストラン・スーパーなど法人様向けに、大量注文・専用物流に対応しています。'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:gap-4 lg:justify-end">
            <Link href={`/${locale}/order/business`} className="btn-accent text-sm">
              {locale === 'pt' ? 'Pedido corporativo (PJ)' : '法人注文フォーム'}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-95"
            >
              {locale === 'pt' ? 'Fale conosco' : 'お問い合わせ'}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ BANNER RAKUTEN ═══════ */}
      <section className="bg-cream-50 py-10 lg:py-14">
        <div className="container-custom text-center max-w-2xl">
          <p className="text-accent-500 text-xs font-semibold tracking-widest uppercase mb-2 lg:mb-3">
            {locale === 'pt' ? 'Pessoa física' : 'ご家庭の方'}
          </p>
          <h2 className="text-xl lg:text-3xl font-bold text-primary-800 mb-3 lg:mb-4">
            {locale === 'pt' ? 'Compre online pela Rakuten' : '楽天ショップでご購入'}
          </h2>
          <p className="text-neutral-600 text-sm mb-5 lg:mb-6">
            {locale === 'pt'
              ? 'Produtos selecionados para consumidor final. Entrega refrigerada em todo o Japão.'
              : '個人のお客様向けの商品を楽天ショップで販売中。冷凍配送でご自宅にお届けします。'}
          </p>
          <a
            href="https://www.rakuten.co.jp"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent"
          >
            {locale === 'pt' ? '🛒 Ir para a Rakuten' : '🛒 楽天ショップへ'}
          </a>
        </div>
      </section>

    </div>
  );
}
