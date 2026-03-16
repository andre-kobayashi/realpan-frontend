'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FeatureClient() {
  const t = useTranslations('feature');
  const locale = useLocale();

  return (
    <div className="flex flex-col">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[420px] sm:min-h-[520px] flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-[#2A1810] via-[#1A2740] to-[#1A2740]">
        <Image src="/features/feature_lead_img01.webp" alt="" fill priority className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2740]/80 via-[#1A2740]/30 to-transparent" />

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-[#D4972A] rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#ECC76E] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 container-custom text-white py-20">
          <div className="inline-block bg-[#D4972A] border border-[#D4972A] px-4 py-1.5 rounded-full text-sm text-white font-semibold mb-6">
            {locale === 'pt' ? 'Nosso Compromisso' : 'こだわり'}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-tight text-white drop-shadow-lg">{t('hero.title')}</h1>
          <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0 0C480 45 960 45 1440 0V60H0V0Z" fill="#FAF7F2"/>
          </svg>
        </div>
      </section>

      {/* ═══ SECTION 1 — Ingredients & Method ═══ */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2]">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-10">
            <span className="text-5xl sm:text-6xl font-bold text-[#D4972A]/15">01</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A2740]">
              {t('section1.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#F5EDE0] shadow-sm">
              <Image src="/features/feature_01_img01.webp" alt="" width={800} height={600}
                className="rounded-xl mb-5 w-full" />
              <h3 className="text-lg font-semibold text-[#1A2740] mb-2">
                {t('section1.items.ingredients.title')}
              </h3>
              <p className="text-[#57749A] text-sm leading-relaxed">
                {t('section1.items.ingredients.description')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#F5EDE0] shadow-sm">
              <Image src="/features/feature_01_img02.webp" alt="" width={800} height={600}
                className="rounded-xl mb-5 w-full" />
              <h3 className="text-lg font-semibold text-[#1A2740] mb-2">
                {t('section1.items.method.title')}
              </h3>
              <p className="text-[#57749A] text-sm leading-relaxed">
                {t('section1.items.method.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2 — Freezing Technology ═══ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-10">
            <span className="text-5xl sm:text-6xl font-bold text-[#D4972A]/15">02</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A2740]">
              {t('section2.title')}
            </h2>
          </div>

          <p className="text-[#57749A] max-w-3xl mb-12 text-sm sm:text-base leading-relaxed">
            {t('section2.intro')}
          </p>

          {/* Comparison */}
          <div className="grid md:grid-cols-3 items-center gap-6 mb-12">
            <div className="text-center bg-[#FAF7F2] rounded-2xl p-6 border border-[#F5EDE0]">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-5">
                <Image src="/features/feature_02_img01.webp" alt="" fill className="object-cover rounded-full" />
              </div>
              <p className="text-[#57749A] text-sm">
                {t('section2.comparison.normal.description')}
              </p>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="w-14 h-14 bg-gradient-to-r from-[#D4972A] to-[#B87A20] rounded-full flex items-center justify-center shadow-md">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="text-center bg-[#FDF8ED] rounded-2xl p-6 border border-[#ECC76E]/30">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-5">
                <Image src="/features/feature_02_img02.webp" alt="" fill className="object-cover rounded-full" />
              </div>
              <p className="text-[#B87A20] text-sm font-medium">
                {t('section2.comparison.frozen.description')}
              </p>
            </div>
          </div>

          {/* Process images */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border border-[#F5EDE0]">
              <Image src="/features/feature_02_img03.webp" alt="" width={1000} height={700} className="w-full" />
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#F5EDE0]">
              <Image src="/features/feature_02_img04.webp" alt="" width={1000} height={700} className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3 — Quality & Safety ═══ */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2]">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-10">
            <span className="text-5xl sm:text-6xl font-bold text-[#D4972A]/15">03</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A2740]">
              {t('section3.title')}
            </h2>
          </div>

          <p className="text-[#57749A] max-w-3xl mb-12 text-sm sm:text-base leading-relaxed">
            {t('section3.intro')}
          </p>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#F5EDE0] shadow-sm">
              <Image src="/features/feature_03_img01.webp" alt="" width={1000} height={700}
                className="rounded-xl mb-5 w-full" />
              <p className="text-[#57749A] text-sm leading-relaxed">
                {t('section3.items.quality.description')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#F5EDE0] shadow-sm">
              <Image src="/features/feature_03_img02.webp" alt="" width={1000} height={700}
                className="rounded-xl mb-5 w-full" />
              <p className="text-[#57749A] text-sm leading-relaxed">
                {t('section3.items.hygiene.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 sm:py-20 bg-[#1A2740] text-center">
        <div className="container-custom">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6">
            {locale === 'pt' ? 'Conheça nossos produtos' : '商品ラインナップを見る'}
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/${locale}/products`}
              className="inline-flex items-center justify-center gap-2 bg-[#D4972A] hover:bg-[#B87A20] text-white
                         px-8 py-3 rounded-full font-semibold text-sm transition-all shadow-lg">
              {locale === 'pt' ? 'Ver produtos' : '商品一覧'}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white
                         px-8 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-all">
              {locale === 'pt' ? 'Fale conosco' : 'お問い合わせ'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}