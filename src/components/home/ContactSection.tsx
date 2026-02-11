'use client';

import { useTranslations } from 'next-intl';

export function ContactSection() {
  const t = useTranslations('home.contact');

  return (
    <section className="bg-primary-50 py-section-lg">
      <div className="container-custom text-center">
        <h2 className="heading-2 mb-6">{t('title')}</h2>
        <p className="text-neutral-700 mb-8">
          {t('description')}
        </p>
        <a href="/contact" className="btn-primary">
          {t('cta')}
        </a>
      </div>
    </section>
  );
}