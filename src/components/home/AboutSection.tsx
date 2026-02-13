'use client';

import { useTranslations } from 'next-intl';

export function AboutSection() {
  const t = useTranslations('home.about');

  return (
    <section className="py-14 lg:py-28 bg-gradient-to-b from-neutral-50 to-white">
      <div className="container-custom max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* TEXTO */}
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-accent-500 font-semibold mb-3 lg:mb-4">
              {t('eyebrow')}
            </p>
            <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-primary-900 mb-4 lg:mb-8">
              {t('title')}
            </h2>
            <p className="text-base lg:text-xl text-primary-800 font-medium leading-relaxed whitespace-pre-line mb-4 lg:mb-6">
              {t('intro')}
            </p>
            <p className="text-sm lg:text-base text-neutral-700 leading-loose whitespace-pre-line mb-6 lg:mb-8">
              {t('description')}
            </p>
            <div className="border-l-4 border-accent-400 pl-5 text-xs lg:text-sm text-neutral-600 leading-relaxed">
              {t('corporate')}
            </div>
          </div>

          {/* BLOCO VISUAL */}
          <div className="relative">
            <div className="rounded-2xl lg:rounded-3xl bg-primary-900 text-white p-8 lg:p-12 shadow-xl">
              <h3 className="text-xl lg:text-2xl font-semibold mb-3 lg:mb-4">
                {t('highlight.title')}
              </h3>
              <p className="text-sm lg:text-base text-white/80 leading-relaxed">
                {t('highlight.description')}
              </p>
              <div className="mt-6 lg:mt-8 h-1 w-12 lg:w-16 bg-accent-400 rounded-full" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 lg:w-32 lg:h-32 bg-accent-400/20 rounded-full blur-3xl pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
