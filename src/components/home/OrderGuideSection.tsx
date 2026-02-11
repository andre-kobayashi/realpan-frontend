'use client';

import { useTranslations } from 'next-intl';

export function OrderGuideSection() {
  const t = useTranslations('home.order');

  return (
    <section className="py-section-lg">
      <div className="container-custom max-w-4xl text-center">
        <h2 className="heading-2 mb-6">{t('title')}</h2>
        <p className="text-neutral-600 mb-8">
          {t('description')}
        </p>
        <a href="/order-guide" className="btn-primary">
          {t('cta')}
        </a>
      </div>
    </section>
  );
}