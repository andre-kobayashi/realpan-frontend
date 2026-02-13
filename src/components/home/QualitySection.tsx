'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Leaf, Factory, ShieldCheck } from 'lucide-react';

export function QualitySection() {
  const t = useTranslations('home.quality');

  const items = [
    { key: 'ingredients', icon: Leaf },
    { key: 'process',     icon: Factory },
    { key: 'safety',      icon: ShieldCheck },
  ];

  return (
    <section className="relative py-16 lg:py-32 overflow-hidden">

      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/about/quality-production.webp"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary-900/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/55 via-primary-900/40 to-primary-900/65" />
      </div>

      <div className="container-custom relative z-10 text-white">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-24">
          <p className="text-xs tracking-[0.35em] uppercase text-accent-400 font-semibold mb-3 lg:mb-4">
            REAL PAN QUALITY
          </p>
          <h2 className="text-2xl lg:text-4xl font-bold tracking-tight mb-4 lg:mb-6">
            {t('title')}
          </h2>
          <p className="text-sm lg:text-base text-white/80 leading-loose whitespace-pre-line">
            {t('intro')}
          </p>
        </div>

        {/* Mobile: cards em coluna simples / Desktop: timeline alternada */}

        {/* — MOBILE CARDS — */}
        <div className="lg:hidden space-y-4">
          {items.map(({ key, icon: Icon }, index) => (
            <div key={key} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="text-accent-400 text-xs font-bold tracking-widest">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-semibold mt-1 mb-2">{t(`${key}.title`)}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{t(`${key}.description`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* — DESKTOP TIMELINE — */}
        <div className="hidden lg:block">
          <div className="absolute left-1/2 top-[360px] bottom-20 w-px bg-white/20" />
          <div className="space-y-24">
            {items.map(({ key, icon: Icon }, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div key={key} className="relative flex items-center">
                  {/* Icon no centro */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                      <Icon className="h-7 w-7" />
                    </div>
                  </div>
                  {/* Card */}
                  <div className={`w-1/2 ${isLeft ? 'pr-16 text-right mr-auto' : 'pl-16 text-left ml-auto'}`}>
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-3xl shadow-2xl hover:bg-white/10 transition-all duration-300">
                      <span className="text-accent-400 text-sm tracking-widest font-semibold">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-xl font-semibold mt-3 mb-4">{t(`${key}.title`)}</h3>
                      <p className="text-white/75 leading-relaxed text-sm lg:text-base">{t(`${key}.description`)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
