'use client';

import { useTranslations } from 'next-intl';

export function QualitySection() {
  const t = useTranslations('home.quality');

  return (
    <section className="bg-neutral-50 py-section-lg">
      <div className="container-custom">
        <h2 className="heading-2 text-center mb-12">
          {t('title')}
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {(['ingredients', 'process', 'safety'] as const).map((key) => (
            <div key={key} className="card">
              <h3 className="text-lg font-semibold mb-2">
                {t(`${key}.title`)}
              </h3>
              <p className="text-neutral-600">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}