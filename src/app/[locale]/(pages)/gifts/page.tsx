'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Gift, Star, Trophy, ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';

export default function GiftsPage() {
  const t = useTranslations('gifts');
  const locale = useLocale();

  const benefits = [
    {
      icon: Star,
      title: t('benefits.points.title'),
      description: t('benefits.points.description'),
      color: 'from-orange-400 to-orange-600'
    },
    {
      icon: Gift,
      title: t('benefits.rewards.title'),
      description: t('benefits.rewards.description'),
      color: 'from-teal-400 to-teal-600'
    },
    {
      icon: Trophy,
      title: t('benefits.exclusive.title'),
      description: t('benefits.exclusive.description'),
      color: 'from-green-400 to-green-600'
    }
  ];

  const tiers = [
    {
      name: t('tiers.bronze.name'),
      points: '0-999',
      discount: '5%',
      color: 'from-amber-700 to-amber-500'
    },
    {
      name: t('tiers.silver.name'),
      points: '1,000-4,999',
      discount: '10%',
      color: 'from-gray-400 to-gray-200'
    },
    {
      name: t('tiers.gold.name'),
      points: '5,000+',
      discount: '15%',
      color: 'from-yellow-400 to-yellow-200'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white py-32">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-6 py-2 rounded-full mb-8">
              <Gift className="w-5 h-5" />
              <span className="font-medium">{t('hero.badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              {t('hero.subtitle')}
            </p>
            <Link 
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              {t('hero.cta')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Curva */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0C480 80 960 80 1440 0V120H0V0Z" fill="#FAF7F2"/>
          </svg>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="bg-[#FAF7F2] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('howItWorks.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('howItWorks.step1.title')}
              </h3>
              <p className="text-gray-600">
                {t('howItWorks.step1.description')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('howItWorks.step2.title')}
              </h3>
              <p className="text-gray-600">
                {t('howItWorks.step2.description')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('howItWorks.step3.title')}
              </h3>
              <p className="text-gray-600">
                {t('howItWorks.step3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            {t('benefits.title')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-orange-500 transition-all">
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Níveis */}
      <section className="bg-[#E8F5F0] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('tiers.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('tiers.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tiers.map((tier, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl text-center transform hover:scale-105 transition-all">
                <div className={`w-24 h-24 bg-gradient-to-br ${tier.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-4">{tier.points} {t('tiers.points')}</p>
                <div className="text-4xl font-bold text-orange-600 mb-2">{tier.discount}</div>
                <p className="text-sm text-gray-500">{t('tiers.discount')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <Link 
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            {t('cta.button')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}