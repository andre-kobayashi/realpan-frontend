'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function TermsPage() {
  const t = useTranslations('terms');

  const sections = [
    'section1',
    'section2',
    'section3',
    'section4',
    'section5',
    'section6',
    'section7',
  ];

  return (
    <div className="flex flex-col">

      {/* HERO */}
      <section className="relative h-[260px] sm:h-[320px] flex items-center overflow-hidden">

        <Image
          src="/hero/terms.webp"
          alt="Terms"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/85 via-primary-800/80 to-primary-800/70" />

        <div className="relative z-10 container-custom pt-20">
          <div className="max-w-3xl">
            <h1 className="heading-2 sm:heading-1 text-white mb-3">
              {t('title')}
            </h1>
            <p className="text-white/70 text-sm sm:text-base">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20 bg-neutral-50">
        <div className="container-custom max-w-4xl">

          <div className="bg-white rounded-2xl shadow-soft p-10 sm:p-14 space-y-12">

            <p className="text-neutral-700 leading-loose">
              {t('intro')}
            </p>

            <div className="border-t border-neutral-200 pt-10 space-y-10">
              {sections.map((key) => (
                <div key={key}>
                  <h2 className="heading-3 mb-4 text-primary-800">
                    {t(`${key}.title`)}
                  </h2>
                  <p className="text-neutral-600 leading-loose whitespace-pre-line">
                    {t(`${key}.content`)}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}