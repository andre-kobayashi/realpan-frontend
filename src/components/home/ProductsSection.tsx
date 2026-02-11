'use client';

import { useTranslations } from 'next-intl';

export function ProductsSection() {
  const t = useTranslations('home.products');

  return (
    <section id="products" className="bg-neutral-50 py-section-lg">
      <div className="container-custom text-center">
        <h2 className="heading-2 mb-6">{t('title')}</h2>
        <p className="text-neutral-600 mb-8">
          {t('description')}
        </p>
        <a href="/products" className="btn-outline">
          {t('cta')}
        </a>
      </div>
    </section>
  );
}