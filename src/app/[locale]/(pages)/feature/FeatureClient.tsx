'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function FeatureClient() {
  const t = useTranslations('feature');
  const locale = useLocale();

  return (
    <div className="flex flex-col">

      {/* ───────── HERO ───────── */}
      <section className="relative min-h-[520px] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/features/feature_lead_img01.webp"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary-900/70" />
        <div className="relative z-10 container-custom text-white py-24">
          <h1 className="heading-1 mb-6">{t('hero.title')}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* ───────── 01 素材・製造 ───────── */}
      <section className="py-24 bg-cream-50">
        <div className="container-custom">

          <div className="flex items-center gap-6 mb-12">
            <span className="section-number">01</span>
            <h2 className="heading-2 text-primary-800">
              {t('section1.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">

            {/* Ingredientes */}
            <div>
              <Image
                src="/features/feature_01_img01.webp"
                alt=""
                width={800}
                height={600}
                className="rounded-2xl shadow-card mb-6"
              />
              <h3 className="text-xl font-semibold text-primary-800 mb-3">
                {t('section1.items.ingredients.title')}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {t('section1.items.ingredients.description')}
              </p>
            </div>

            {/* Método */}
            <div>
              <Image
                src="/features/feature_01_img02.webp"
                alt=""
                width={800}
                height={600}
                className="rounded-2xl shadow-card mb-6"
              />
              <h3 className="text-xl font-semibold text-primary-800 mb-3">
                {t('section1.items.method.title')}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {t('section1.items.method.description')}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ───────── 02 急速冷凍 ───────── */}
      <section className="py-24 bg-white">
        <div className="container-custom">

          <div className="flex items-center gap-6 mb-12">
            <span className="section-number">02</span>
            <h2 className="heading-2 text-primary-800">
              {t('section2.title')}
            </h2>
          </div>

          <p className="text-neutral-600 max-w-3xl mb-16">
            {t('section2.intro')}
          </p>

          <div className="grid md:grid-cols-3 items-center gap-8">

            {/* Normal */}
            <div className="text-center">
              <div className="relative w-64 h-64 mx-auto mb-6">
                <Image
                  src="/features/feature_02_img01.webp"
                  alt=""
                  fill
                  className="object-cover rounded-full shadow-card"
                />
              </div>
              <p className="text-neutral-600 text-sm">
                {t('section2.comparison.normal.description')}
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex justify-center">
              <span className="text-4xl text-accent-400">▶</span>
            </div>

            {/* Frozen */}
            <div className="text-center">
              <div className="relative w-64 h-64 mx-auto mb-6">
                <Image
                  src="/features/feature_02_img02.webp"
                  alt=""
                  fill
                  className="object-cover rounded-full shadow-card"
                />
              </div>
              <p className="text-neutral-600 text-sm">
                {t('section2.comparison.frozen.description')}
              </p>
            </div>

          </div>

          {/* Processo */}
          <div className="mt-20 grid md:grid-cols-2 gap-12">
            <Image
              src="/features/feature_02_img03.webp"
              alt=""
              width={1000}
              height={700}
              className="rounded-2xl shadow-card"
            />
            <Image
              src="/features/feature_02_img04.webp"
              alt=""
              width={1000}
              height={700}
              className="rounded-2xl shadow-card"
            />
          </div>

        </div>
      </section>

      {/* ───────── 03 安心・安全 ───────── */}
      <section className="py-24 bg-cream-50">
        <div className="container-custom">

          <div className="flex items-center gap-6 mb-12">
            <span className="section-number">03</span>
            <h2 className="heading-2 text-primary-800">
              {t('section3.title')}
            </h2>
          </div>

          <p className="text-neutral-600 max-w-3xl mb-16">
            {t('section3.intro')}
          </p>

          <div className="grid md:grid-cols-2 gap-12">

            <div>
              <Image
                src="/features/feature_03_img01.webp"
                alt=""
                width={1000}
                height={700}
                className="rounded-2xl shadow-card mb-6"
              />
              <p className="text-neutral-600 text-sm leading-relaxed">
                {t('section3.items.quality.description')}
              </p>
            </div>

            <div>
              <Image
                src="/features/feature_03_img02.webp"
                alt=""
                width={1000}
                height={700}
                className="rounded-2xl shadow-card mb-6"
              />
              <p className="text-neutral-600 text-sm leading-relaxed">
                {t('section3.items.hygiene.description')}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="py-20 bg-white text-center">
        <div className="container-custom">
          <h2 className="heading-3 text-primary-800 mb-6">
            {locale === 'pt' ? 'Conheça nossos produtos' : '商品ラインナップを見る'}
          </h2>
          <div className="flex gap-4 justify-center">
            <Link href={`/${locale}/products`} className="btn-primary">
              {locale === 'pt' ? 'Ver produtos' : '商品一覧'}
            </Link>
            <Link href={`/${locale}/contact`} className="btn-secondary">
              {locale === 'pt' ? 'Fale conosco' : 'お問い合わせ'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}