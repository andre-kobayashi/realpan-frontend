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

      {/* ═══ HERO ═══ */}
      <section className="relative h-[420px] sm:h-[520px] flex items-center justify-center text-center overflow-hidden bg-[#1A2740]">
        <Image src="/about/factory.webp" alt="" fill priority className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2740]/70 via-[#1A2740]/20 to-transparent" />

        <div className="relative z-10 container-custom py-10">
          <div className="max-w-3xl mx-auto text-white">
            <div className="inline-flex items-center gap-2 bg-[#D4972A] px-4 py-1.5 rounded-full text-sm mb-6 shadow-lg">
              <span className="text-white font-semibold">Corporate Information</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5 text-white drop-shadow-lg">
              {t('title')}
            </h1>
            <p className="text-white text-base sm:text-lg drop-shadow max-w-2xl leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </div>

        {/* Curva */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 0C480 60 960 60 1440 0V80H0V0Z" fill="#FAF7F2"/>
          </svg>
        </div>
      </section>

      {/* ═══ GREETING ═══ */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2]">
        <div className="container-custom max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
            <Image src="/about/founder.webp" alt="" fill className="object-cover object-top" />
          </div>

          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#D4972A] mb-4 font-semibold">
              Message from Founder
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A2740] mb-6">
              {t('greeting.title')}
            </h2>
            <p className="whitespace-pre-line text-[#57749A] leading-loose text-sm sm:text-base">
              {t('greeting.text')}
            </p>
            <div className="mt-10 pt-5 border-t border-[#ECC76E]/30">
              <p className="font-semibold text-[#1A2740]">
                {t('greeting.signature')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COMPANY OVERVIEW ═══ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container-custom max-w-5xl">
          <div className="mb-12 text-center">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#D4972A] mb-3 font-semibold">
              Company Profile
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A2740]">
              {t('overview.title')}
            </h2>
          </div>

          <div className="bg-[#FEFCF8] border border-[#F5EDE0] rounded-2xl overflow-hidden shadow-sm">
            {Object.entries(overviewItems).map(([key, item], i) => (
              <div
                key={key}
                className={`grid sm:grid-cols-3 px-6 sm:px-10 py-5 ${
                  i !== 0 ? 'border-t border-[#F5EDE0]' : ''
                }`}
              >
                <div className="font-medium text-[#1A2740] text-sm mb-1 sm:mb-0">
                  {item.label}
                </div>
                <div className="sm:col-span-2 text-[#57749A] text-sm whitespace-pre-line">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FACTORY ═══ */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2]">
        <div className="container-custom max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#D4972A] mb-4 font-semibold">
              Manufacturing
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A2740] mb-5">
              {t('factory.title')}
            </h2>
            <p className="text-[#57749A] leading-relaxed mb-8 text-sm sm:text-base">
              {t('factory.description')}
            </p>
            <div className="text-sm text-[#57749A] space-y-2 bg-white border border-[#F5EDE0] p-6 rounded-xl">
              <p className="font-semibold text-[#1A2740]">📍 静岡工場</p>
              <p>〒432-8068 静岡県浜松市中央区高塚町1620</p>
              <p className="text-[#D4972A] font-medium">📞 053-570-2555</p>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
            <Image src="/about/process.webp" alt="" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* ═══ ESG ═══ */}
      <section className="py-20 sm:py-28 bg-[#1A2740] text-white">
        <div className="container-custom max-w-6xl">
          <div className="text-center mb-16 sm:mb-20">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#ECC76E] mb-4 font-semibold">
              ESG Commitment
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold">
              {t('esg.title')}
            </h2>
          </div>

          <div className="space-y-20 sm:space-y-28">
            {esgSections.map(({ key }) => {
              const section = t.raw(`esg.${key}`) as {
                title: string;
                subtitle: string;
                items: Record<string, { title: string; description: string }>;
              };

              return (
                <div key={key} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-[#ECC76E]">
                      {section.title}
                    </h3>
                    <p className="text-white/60 mb-8 text-sm sm:text-base">
                      {section.subtitle}
                    </p>
                    <div className="space-y-4">
                      {Object.entries(section.items).map(([itemKey, item]) => (
                        <div key={itemKey} className="bg-white/5 border border-white/10 p-5 rounded-xl">
                          <h4 className="font-semibold mb-2 text-white text-sm">
                            {item.title}
                          </h4>
                          <p className="text-white/60 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {esgImages[key as keyof EsgImages].map((src: string, i: number) => (
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