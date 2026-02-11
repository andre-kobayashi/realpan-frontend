'use client';

import { useTranslations } from 'next-intl';

export default function FeatureClient() {
  const t = useTranslations('feature');

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container-custom text-center">
          <h1 className="heading-1 mb-4">{t('hero.title')}</h1>
          <p className="text-xl text-neutral-600">{t('hero.subtitle')}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <p className="text-lg text-neutral-700 leading-relaxed">
            {t('intro.text')}
          </p>
        </div>
      </section>

      {/* Section 1 */}
      <section className="bg-neutral-50 py-20">
        <div className="container-custom">
          <h2 className="heading-2 mb-12 text-center">
            {t('section1.title')}
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {(['ingredients', 'method', 'variety'] as const).map((key) => (
              <div key={key} className="card">
                <h3 className="mb-3 text-lg font-semibold">
                  {t(`section1.items.${key}.title`)}
                </h3>
                <p className="text-neutral-600">
                  {t(`section1.items.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="py-20">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="heading-2 mb-6">{t('section2.title')}</h2>
          <p className="text-lg text-neutral-600">
            {t('section2.text')}
          </p>
        </div>
      </section>

      {/* Section 3 */}
      <section className="bg-neutral-50 py-20">
        <div className="container-custom max-w-5xl">
          <h2 className="heading-2 mb-12 text-center">
            {t('section3.title')}
          </h2>

          <ul className="grid gap-6 md:grid-cols-2">
            {(['quality', 'hygiene', 'allergen', 'delivery'] as const).map((key) => (
              <li key={key} className="card">
                <p className="text-neutral-700">
                  {t(`section3.items.${key}`)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing */}
      <section className="py-20">
        <div className="container-custom max-w-4xl text-center">
          <p className="text-xl font-medium text-neutral-800">
            {t('closing.text')}
          </p>
        </div>
      </section>
    </div>
  );
}