'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function FeatureClient() {
  const t = useTranslations('feature');
  const locale = useLocale();

  return (
    <div className="flex flex-col">
      {/* HERO - Orange Gradient */}
      <section className="relative min-h-[520px] flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/features/feature_lead_img01.webp"
            alt=""
            fill
            priority
            className="object-cover mix-blend-overlay"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-white py-24">
          <div className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm mb-6">
            {locale === 'pt' ? 'Nosso Compromisso' : 'こだわり'}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('hero.title')}</h1>
          <p className="text-white/90 text-xl max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>
        
        {/* Curva Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0C480 80 960 80 1440 0V120H0V0Z" fill="#FAF7F2"/>
          </svg>
        </div>
      </section>

      {/* SECTION 1 - Beige Background */}
      <section className="py-24 bg-[#FAF7F2]">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 mb-12">
            <span className="text-6xl font-bold text-orange-500/20">01</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('section1.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <Image
                src="/features/feature_01_img01.webp"
                alt=""
                width={800}
                height={600}
                className="rounded-xl mb-6 w-full"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('section1.items.ingredients.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('section1.items.ingredients.description')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <Image
                src="/features/feature_01_img02.webp"
                alt=""
                width={800}
                height={600}
                className="rounded-xl mb-6 w-full"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('section1.items.method.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('section1.items.method.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - Mint Background */}
      <section className="py-24 bg-[#E8F5F0]">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 mb-12">
            <span className="text-6xl font-bold text-teal-400/30">02</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('section2.title')}
            </h2>
          </div>

          <p className="text-gray-600 max-w-3xl mb-16 text-lg">
            {t('section2.intro')}
          </p>

          <div className="grid md:grid-cols-3 items-center gap-8 mb-16">
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <Image
                  src="/features/feature_02_img01.webp"
                  alt=""
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <p className="text-gray-600">
                {t('section2.comparison.normal.description')}
              </p>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-3xl text-white">→</span>
              </div>
            </div>

            <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <Image
                  src="/features/feature_02_img02.webp"
                  alt=""
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <p className="text-gray-600">
                {t('section2.comparison.frozen.description')}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/features/feature_02_img03.webp"
                alt=""
                width={1000}
                height={700}
                className="w-full"
              />
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/features/feature_02_img04.webp"
                alt=""
                width={1000}
                height={700}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - White Background */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 mb-12">
            <span className="text-6xl font-bold text-green-400/30">03</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('section3.title')}
            </h2>
          </div>

          <p className="text-gray-600 max-w-3xl mb-16 text-lg">
            {t('section3.intro')}
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#FAF7F2] rounded-2xl p-6 shadow-lg">
              <Image
                src="/features/feature_03_img01.webp"
                alt=""
                width={1000}
                height={700}
                className="rounded-xl mb-6 w-full"
              />
              <p className="text-gray-600 leading-relaxed">
                {t('section3.items.quality.description')}
              </p>
            </div>

            <div className="bg-[#FAF7F2] rounded-2xl p-6 shadow-lg">
              <Image
                src="/features/feature_03_img02.webp"
                alt=""
                width={1000}
                height={700}
                className="rounded-xl mb-6 w-full"
              />
              <p className="text-gray-600 leading-relaxed">
                {t('section3.items.hygiene.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Orange Gradient */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {locale === 'pt' ? 'Conheça nossos produtos' : '商品ラインナップを見る'}
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href={`/${locale}/products`} 
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              {locale === 'pt' ? 'Ver produtos' : '商品一覧'}
            </Link>
            <Link 
              href={`/${locale}/contact`} 
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-orange-600 transition-all transform hover:scale-105"
            >
              {locale === 'pt' ? 'Fale conosco' : 'お問い合わせ'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}