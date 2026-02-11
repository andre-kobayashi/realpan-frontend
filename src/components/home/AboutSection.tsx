'use client';

import { useTranslations } from 'next-intl';

export function AboutSection() {
  const t = useTranslations('home.about');

  return (
    <section className="py-section-md">
      <div className="container-custom max-w-4xl">
        <h2 className="heading-2 mb-6">{t('title')}</h2>
        <p className="text-lg text-neutral-700 leading-relaxed">
          {t('description')}
        </p>
      </div>
    </section>
  );
}