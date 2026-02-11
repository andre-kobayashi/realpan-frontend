'use client';

export const dynamic = 'force-dynamic';

import { useLocale, useTranslations } from 'next-intl';
import productsData from '@/data/products.json';
import { CategoryHeader } from '@/components/catalog/CategoryHeader';
import { ProductGrid } from '@/components/catalog/ProductGrid';

export default function ProductsPage() {
  const t = useTranslations('products');
  const locale = useLocale() as 'pt' | 'ja';

  return (
    <section className="py-16">
      <div className="container-custom">
        <CategoryHeader title={t('title')} />

        <ProductGrid products={productsData.products} />
      </div>
    </section>
  );
}