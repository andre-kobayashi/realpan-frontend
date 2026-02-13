'use client';

import { useTranslations } from 'next-intl';
import { Store, Truck, Utensils } from 'lucide-react';

export function ServicesSection() {
  const t = useTranslations('home.services');

  const services = [
    { key: 'foodservice', icon: Utensils },
    { key: 'retail',      icon: Store },
    { key: 'distribution',icon: Truck },
  ];

  return (
    <section className="py-14 lg:py-28 bg-white">
      <div className="container-custom">

        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-16">
          <p className="text-xs tracking-[0.35em] uppercase text-primary-600 font-semibold mb-3 lg:mb-4">
            {t('eyebrow')}
          </p>
          <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-primary-900 mb-4 lg:mb-6">
            {t('title')}
          </h2>
          <p className="text-sm lg:text-base text-neutral-600 leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Mobile: scroll horizontal / Desktop: grid 3 cols */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {services.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="group flex-shrink-0 w-72 lg:w-auto border border-neutral-200 rounded-2xl p-7 lg:p-10 hover:shadow-xl hover:border-primary-200 transition-all duration-300"
            >
              <div className="mb-5 lg:mb-6 inline-flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-700 group-hover:bg-primary-100 transition">
                <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
              </div>
              <h3 className="text-base lg:text-lg font-semibold text-primary-900 mb-2 lg:mb-4">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {t(`items.${key}.description`)}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
