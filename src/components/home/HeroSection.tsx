'use client';

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const images = [
  '/hero/hero-1.webp',
  '/hero/hero-2.webp',
  '/hero/hero-3.webp',
];

export function HeroSection() {
  const t = useTranslations('home.hero');
  const locale = useLocale();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    /*
      Mobile: h-[44vh] mínimo 300px (compacto, deixa conteúdo abaixo visível)
      Desktop: h-[55vh] mínimo 420px (mais imponente)
    */
    <section className="relative h-[44vh] min-h-[300px] lg:h-[55vh] lg:min-h-[420px] w-full overflow-hidden">

      {/* BACKGROUND IMAGES */}
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          className={`object-cover transition-all duration-[2000ms] ease-out
            ${i === index ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
        />
      ))}

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full items-end lg:items-center">
        <div className="container-custom pb-10 lg:pb-0 text-white">
          <div key={index} className="max-w-2xl animate-fade-in">

            <p className="mb-2 lg:mb-4 text-accent-400 text-xs lg:text-sm tracking-widest uppercase font-semibold">
              Real Pan
            </p>

            <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-3 lg:mb-6 leading-tight">
              {t('title')}
            </h1>

            <p className="mb-5 lg:mb-10 text-sm lg:text-xl text-white/85 leading-relaxed max-w-xl hidden sm:block">
              {t('subtitle')}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href={`/${locale}/products`} className="btn-accent text-sm px-5 py-2.5 lg:px-6 lg:py-3">
                {t('cta')}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="btn-secondary bg-white/10 border-white/30 text-white hover:bg-white/20 text-sm px-5 py-2.5 lg:px-6 lg:py-3"
              >
                {locale === 'pt' ? 'Sobre nós' : '会社案内'}
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* SLIDER INDICATORS */}
      <div className="absolute bottom-3 lg:bottom-8 right-4 lg:left-1/2 lg:right-auto lg:-translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 lg:w-8 bg-accent-400' : 'w-1.5 lg:w-2 bg-white/40'
            }`}
          />
        ))}
      </div>

    </section>
  );
}
