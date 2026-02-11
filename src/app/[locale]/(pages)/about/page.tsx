import Image from 'next/image';
import { useTranslations } from 'next-intl';

export const dynamic = 'force-dynamic';

export default function AboutPage() {
  const t = useTranslations('about');

  type EsgSection = {
  key: 'environment' | 'social' | 'governance';
  images: string[];
};

const esgSections: EsgSection[] = [
  {
    key: 'environment',
    images: ['/about/esg-env-1.webp', '/about/esg-env-2.webp'],
  },
  {
    key: 'social',
    images: [
      '/about/esg-social-1.webp',
      '/about/esg-social-2.webp',
      '/about/esg-social-3.webp',
    ],
  },
  {
    key: 'governance',
    images: ['/about/esg-gov.webp'],
  },
];

  return (
    <div className="flex flex-col">

      {/* HERO */}
      <section className="relative h-[420px]">
        <Image
          src="/about/factory.webp"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full items-center justify-center text-white text-center">
          <div>
            <h1 className="heading-1 mb-4">{t('title')}</h1>
            <p className="text-lg opacity-90">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* GREETING */}
      <section className="py-20">
        <div className="container-custom max-w-4xl">
          <h2 className="heading-2 mb-6">{t('greeting.title')}</h2>
          <p className="whitespace-pre-line text-neutral-600 leading-relaxed">
            {t('greeting.text')}
          </p>
          <p className="mt-6 font-medium">
            {t('greeting.signature')}
          </p>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="bg-neutral-50 py-20">
        <div className="container-custom">
          <h2 className="heading-2 mb-10 text-center">
            {t('overview.title')}
          </h2>

          <div className="mx-auto max-w-4xl divide-y rounded-lg bg-white shadow">
            {Object.entries(t.raw('overview.items')).map(
              ([key, item]: any) => (
                <div
                  key={key}
                  className="grid grid-cols-3 gap-4 p-4"
                >
                  <div className="font-medium text-neutral-700">
                    {item.label}
                  </div>
                  <div className="col-span-2 text-neutral-600">
                    {item.value}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* FACTORY */}
      <section className="py-20">
        <div className="container-custom grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="heading-2 mb-4">
              {t('factory.title')}
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              {t('factory.description')}
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="/about/process.webp"
              alt=""
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ESG */}
      <section className="bg-neutral-50 py-20">
        <div className="container-custom space-y-24">
          <h2 className="heading-2 text-center">
            {t('esg.title')}
          </h2>

          {esgSections.map((section) => (
            <div
              key={section.key}
              className="grid gap-12 lg:grid-cols-2 items-center"
            >
              <div>
                <h3 className="text-2xl font-semibold mb-4">
                  {t(`esg.${section.key}.title`)}
                </h3>
                <p className="text-neutral-600">
                  {t(`esg.${section.key}.description`)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {section.images.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}