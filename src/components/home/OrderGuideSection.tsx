'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Truck, PackageCheck, CreditCard } from 'lucide-react';

export function OrderGuideSection() {
  const t = useTranslations('home.order');
  const locale = useLocale();

  const steps = [
    { icon: PackageCheck, key: 'step1', num: '01' },
    { icon: Truck,        key: 'step2', num: '02' },
    { icon: CreditCard,   key: 'step3', num: '03' },
  ];

  return (
    <section className="py-14 lg:py-28 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-56 h-56 lg:w-72 lg:h-72 bg-accent-400/10 blur-3xl rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-16">
          <p className="text-xs tracking-[0.35em] uppercase text-accent-400 font-semibold mb-3 lg:mb-4">
            {t('eyebrow')}
          </p>
          <h2 className="text-2xl lg:text-4xl font-bold tracking-tight mb-4 lg:mb-6">
            {t('title')}
          </h2>
          <p className="text-sm lg:text-base text-white/80 leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Steps: scroll horizontal em mobile / grid em desktop */}
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 lg:gap-8 mb-10 lg:mb-16">
          {steps.map(({ icon: Icon, key, num }) => (
            <div
              key={key}
              className="flex-shrink-0 w-64 lg:w-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 text-center hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-accent-400 text-xs font-bold tracking-widest mb-4">{num}</div>
              <div className="mb-4 lg:mb-6 inline-flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl bg-accent-400/20 text-accent-400">
                <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
              </div>
              <h3 className="font-semibold text-base lg:text-lg mb-2">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="text-xs lg:text-sm text-white/70">
                {t(`steps.${key}.description`)}
              </p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 lg:gap-6">
          <Link
            href={`/${locale}/order/business`}
            className="px-7 py-3.5 lg:px-8 lg:py-4 rounded-full bg-accent-400 text-primary-900 font-semibold text-sm lg:text-base hover:scale-105 transition text-center"
          >
            {t('ctaBusiness')}
          </Link>
          <Link
            href={`/${locale}/order/individual`}
            className="px-7 py-3.5 lg:px-8 lg:py-4 rounded-full border border-white/30 text-white font-semibold text-sm lg:text-base hover:bg-white/10 transition text-center"
          >
            {t('ctaIndividual')}
          </Link>
        </div>

      </div>
    </section>
  );
}
