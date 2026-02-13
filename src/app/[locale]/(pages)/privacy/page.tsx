'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
  const t = useTranslations('privacy');

  return (
    <div className="flex flex-col">

      {/* HERO */}
      <section className="relative h-[300px] sm:h-[340px] flex items-center overflow-hidden pt-24">

  <Image
    src="/hero/privacy.webp"
    alt="Privacy Policy"
    fill
    priority
    className="object-cover"
  />

  <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/85 to-primary-800/75" />

  <div className="relative z-10 container-custom">
    <div className="max-w-3xl">
      <h1 className="heading-1 text-white mb-4">
        {t('title')}
      </h1>
      <p className="text-white/80 text-base">
        {t('subtitle')}
      </p>
    </div>
  </div>
</section>

      {/* CONTENT */}
      <section className="py-20 bg-neutral-50">
        <div className="container-custom max-w-4xl">

          <div className="bg-white rounded-2xl shadow-soft p-10 sm:p-14 space-y-12">

            <div className="space-y-6 text-neutral-700 leading-relaxed">
              <p className="whitespace-pre-line">{t('intro')}</p>
              <p className="whitespace-pre-line">{t('policyText')}</p>
            </div>

            <div className="border-t border-neutral-200 pt-10 space-y-10">

              <div>
                <h2 className="heading-3 mb-4 text-primary-800">
                  {t('section1.title')}
                </h2>
                <p className="whitespace-pre-line text-neutral-600 leading-loose">
                  {t('section1.content')}
                </p>
              </div>

              <div>
                <h2 className="heading-3 mb-4 text-primary-800">
                  {t('section2.title')}
                </h2>
                <p className="whitespace-pre-line text-neutral-600 leading-loose">
                  {t('section2.content')}
                </p>
              </div>

              <div>
                <h2 className="heading-3 mb-4 text-primary-800">
                  {t('section3.title')}
                </h2>
                <p className="whitespace-pre-line text-neutral-600 leading-loose">
                  {t('section3.content')}
                </p>
              </div>

              <div>
                <h2 className="heading-3 mb-4 text-primary-800">
                  {t('google.title')}
                </h2>
                <p className="whitespace-pre-line text-neutral-600 leading-loose">
                  {t('google.content')}
                </p>
              </div>

              <div>
                <h2 className="heading-3 mb-4 text-primary-800">
                  {t('microsoft.title')}
                </h2>
                <p className="whitespace-pre-line text-neutral-600 leading-loose">
                  {t('microsoft.content')}
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}