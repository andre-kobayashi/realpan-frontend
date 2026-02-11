'use client';

import { useTranslations } from 'next-intl';

export function ServicesSection() {
  const t = useTranslations('home.services');

  return (
    <section className="py-section-lg">
      <div className="container-custom">
        <h2 className="heading-2 text-center mb-10">
          {t('title')}
        </h2>
        <p className="text-center text-neutral-600 max-w-3xl mx-auto">
          {t('description')}
        </p>
      </div>
    </section>
  );
}