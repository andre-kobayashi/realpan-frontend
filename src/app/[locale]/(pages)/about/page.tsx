import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

type EsgSection = {
  key: 'environment' | 'social' | 'governance';
};
const esgSections: EsgSection[] = [
  { key: 'environment' },
  { key: 'social' },
  { key: 'governance' },
];

type EsgImages = {
  environment: string[];
  social: string[];
  governance: string[];
};
const esgImages: EsgImages = {
  environment: ['/about/esg-env-1.webp', '/about/esg-env-2.webp'],
  social: ['/about/esg-social-1.webp', '/about/esg-social-2.webp', '/about/esg-social-3.webp'],
  governance: ['/about/esg-gov.webp'],
};

export default async function AboutPage() {
  const t = await getTranslations('about');
  const overviewItems = t.raw('overview.items') as Record<string, { label: string; value: string }>;

  return (
    <div className="flex flex-col">

      {/* HERO - Orange Gradient */}
      <section className="relative h-[520px] flex items-end overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600">
        <Image src="/about/factory.webp" alt="" fill priority className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="relative z-10 container mx-auto px-4 pb-20">
          <div className="max-w-4xl text-white">
            <p className="text-xs tracking-[0.35em] uppercase text-orange-300 mb-6">
              Corporate Information
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              {t('title')}
            </h1>
            <p className="text-white/85 text-lg max-w-2xl leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </div>

        {/* Curva */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path d="M0 0C480 80 960 80 1440 0V120H0V0Z" fill="#FAF7F2"/>
          </svg>
        </div>
      </section>

      {/* GREETING - Beige Background */}
      <section className="py-28 bg-[#FAF7F2]">
        <div className="container mx-auto px-4 max-w-6xl grid lg:grid-cols-2 gap-20 items-center">

          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
            <Image src="/about/founder.webp" alt="" fill className="object-cover object-top" />
          </div>

          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-orange-500 mb-6">
              Message from Founder
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {t('greeting.title')}
            </h2>
            <p className="whitespace-pre-line text-gray-700 leading-loose text-base">
              {t('greeting.text')}
            </p>
            <div className="mt-12 pt-6 border-t border-gray-300">
              <p className="font-semibold text-gray-900">
                {t('greeting.signature')}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* COMPANY OVERVIEW - Mint Background */}
      <section className="py-28 bg-[#E8F5F0]">
        <div className="container mx-auto px-4 max-w-5xl">

          <div className="mb-16 text-center">
            <p className="text-xs tracking-[0.35em] uppercase text-teal-600 mb-4">
              Company Profile
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              {t('overview.title')}
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
            {Object.entries(overviewItems).map(([key, item], i) => (
              <div
                key={key}
                className={`grid sm:grid-cols-3 px-10 py-6 ${
                  i !== 0 ? 'border-t border-gray-200' : ''
                }`}
              >
                <div className="font-medium text-gray-900">
                  {item.label}
                </div>
                <div className="sm:col-span-2 text-gray-700">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FACTORY - White Background */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4 max-w-6xl grid lg:grid-cols-2 gap-20 items-center">

          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-orange-500 mb-6">
              Manufacturing
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('factory.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {t('factory.description')}
            </p>
            <div className="text-sm text-gray-600 space-y-2 bg-[#FAF7F2] p-6 rounded-xl">
              <p className="font-medium text-gray-900">📍 静岡工場</p>
              <p>〒435-0016 静岡県浜松市中央区高塚町1620</p>
              <p>📞 TEL 053-570-2555</p>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
            <Image src="/about/process.webp" alt="" fill className="object-cover" />
          </div>

        </div>
      </section>

      {/* ESG - Dark Blue Background */}
      <section className="py-32 bg-[#1A2332] text-white">
        <div className="container mx-auto px-4 max-w-6xl">

          <div className="text-center mb-24">
            <p className="text-xs tracking-[0.35em] uppercase text-orange-400 mb-6">
              ESG Commitment
            </p>
            <h2 className="text-3xl font-bold">
              {t('esg.title')}
            </h2>
          </div>

          <div className="space-y-28">

            {esgSections.map(({ key }) => {
              const section = t.raw(`esg.${key}`) as {
                title: string;
                subtitle: string;
                items: Record<string, { title: string; description: string }>;
              };

              return (
                <div key={key} className="grid lg:grid-cols-2 gap-20 items-start">

                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-orange-400">
                      {section.title}
                    </h3>
                    <p className="text-white/70 mb-10">
                      {section.subtitle}
                    </p>
                    <div className="space-y-6">
                      {Object.entries(section.items).map(([itemKey, item]) => (
                        <div key={itemKey} className="bg-white/5 p-6 rounded-xl">
                          <h4 className="font-semibold mb-2 text-white">
                            {item.title}
                          </h4>
                          <p className="text-white/70 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {esgImages[key as keyof EsgImages].map((src, i) => (
                      <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                        <Image src={src} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}

          </div>
        </div>
      </section>

    </div>
  );
}