'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { key: 'bread',   image: '/categories/bread.webp' },
  { key: 'frozen',  image: '/categories/frozen.webp' },
  { key: 'savory',  image: '/categories/savory.webp' },
  { key: 'sweets',  image: '/categories/sweets.webp' },
  { key: 'cake',    image: '/categories/cake.webp' },
  { key: 'ice',     image: '/categories/ice.webp' },
  { key: 'spices',  image: '/categories/spices.webp' },
  { key: 'other',   image: '/categories/other.webp' },
];

export function ProductsSection() {
  const t = useTranslations('home.products');
  const locale = useLocale();

  return (
    <section id="products" className="bg-primary-900 text-white py-12 lg:py-20">
      <div className="container-custom">

        {/* Header */}
        <div className="flex items-end justify-between mb-6 lg:mb-12">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-accent-400 font-semibold mb-2">
              {locale === 'pt' ? 'Categorias' : 'カテゴリー'}
            </p>
            <h2 className="text-xl lg:text-4xl font-bold text-white tracking-tight">
              {t('title')}
            </h2>
          </div>
          <Link
            href={`/${locale}/products`}
            className="flex-shrink-0 text-xs lg:text-sm font-semibold text-accent-400 hover:text-accent-300 transition flex items-center gap-1"
          >
            {t('cta')}
            <span>→</span>
          </Link>
        </div>

        {/* 
          Mobile: scroll horizontal com cards compactos
          Desktop: grid 4 colunas (2 linhas de 4)
        */}
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:gap-5">
          {categories.map((category) => (
            <Link
              key={category.key}
              href={`/${locale}/products`}
              className="group relative flex-shrink-0 w-40 lg:w-auto overflow-hidden rounded-2xl bg-primary-800 border border-white/10 shadow-navy transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={category.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-75"
                />
              </div>

              {/* Label overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-900 via-primary-900/80 to-transparent p-3 lg:p-5">
                <h3 className="text-xs lg:text-sm font-semibold tracking-wide text-white group-hover:text-accent-400 transition-colors line-clamp-1">
                  {t(`categories.${category.key}`)}
                </h3>
                <div className="h-[2px] w-6 lg:w-10 bg-accent-400 mt-1.5 lg:mt-2 transition-all duration-300 group-hover:w-10 lg:group-hover:w-16" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA — mobile abaixo do carrossel */}
        <div className="text-center mt-6 lg:mt-12 lg:hidden">
          <Link href={`/${locale}/products`} className="btn-accent text-sm">
            {t('cta')}
          </Link>
        </div>

      </div>
    </section>
  );
}
