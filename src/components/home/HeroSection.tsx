'use client';

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

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
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
      {/* Background images */}
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Real Pan"
          fill
          priority={i === 0}
          className={`object-cover transition-opacity duration-1000 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container-custom text-center text-white">
          <h1 className="heading-1 mb-6">
            {t('title')}
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
            {t('subtitle')}
          </p>

          <a
            href={`/${locale}/products`}
            className="inline-flex items-center rounded-full bg-primary-600 px-8 py-4 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            {t('cta')}
          </a>
        </div>
      </div>
    </section>
  );
}