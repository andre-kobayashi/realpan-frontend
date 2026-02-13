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

const esgColors: Record<string, string> = {
  environment: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  social:      'bg-blue-50 border-blue-200 text-blue-800',
  governance:  'bg-primary-50 border-primary-200 text-primary-800',
};

export default async function AboutPage() {
  const t = await getTranslations('about');
  const overviewItems = t.raw('overview.items') as Record<string, { label: string; value: string }>;

  return (
    <div className="flex flex-col">

     {/* ── HERO ── */}
<section className="relative h-[520px] flex items-end overflow-hidden">

  <Image
    src="/about/factory.webp"
    alt=""
    fill
    priority
    className="object-cover"
  />

  <div className="absolute inset-0 bg-primary-900/75" />

  <div className="relative z-10 container-custom pb-20">
    <div className="max-w-4xl text-white">
      <p className="text-xs tracking-[0.35em] uppercase text-accent-400 mb-6">
        Corporate Information
      </p>

      <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
        {t('title')}
      </h1>

      <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
        {t('subtitle')}
      </p>
    </div>
  </div>
</section>

      {/* ── GREETING ── */}
     <section className="py-28 bg-white">
  <div className="container-custom max-w-6xl grid lg:grid-cols-2 gap-20 items-center">

    <div className="relative aspect-[4/5] rounded-none overflow-hidden">
      <Image
        src="/about/founder.webp"
        alt=""
        fill
        className="object-cover object-top"
      />
    </div>

    <div>
      <p className="text-xs tracking-[0.35em] uppercase text-primary-500 mb-6">
        Message from Founder
      </p>

      <h2 className="text-3xl font-bold text-primary-900 mb-8">
        {t('greeting.title')}
      </h2>

      <p className="whitespace-pre-line text-neutral-700 leading-loose text-base">
        {t('greeting.text')}
      </p>

      <div className="mt-12 pt-6 border-t border-neutral-200">
        <p className="font-semibold text-primary-900">
          {t('greeting.signature')}
        </p>
      </div>
    </div>

  </div>
</section>

      {/* ── COMPANY OVERVIEW ── */}
     <section className="py-28 bg-neutral-50">
  <div className="container-custom max-w-5xl">

    <div className="mb-16 text-center">
      <p className="text-xs tracking-[0.35em] uppercase text-primary-500 mb-4">
        Company Profile
      </p>
      <h2 className="text-3xl font-bold text-primary-900">
        {t('overview.title')}
      </h2>
    </div>

    <div className="bg-white border border-neutral-200">
      {Object.entries(overviewItems).map(([key, item], i) => (
        <div
          key={key}
          className={`grid sm:grid-cols-3 px-10 py-6 ${
            i !== 0 ? 'border-t border-neutral-200' : ''
          }`}
        >
          <div className="font-medium text-primary-800">
            {item.label}
          </div>

          <div className="sm:col-span-2 text-neutral-700">
            {item.value}
          </div>
        </div>
      ))}
    </div>

  </div>
</section>

      {/* ── FACTORY ── */}
      <section className="py-28 bg-white">
  <div className="container-custom max-w-6xl grid lg:grid-cols-2 gap-20 items-center">

    <div>
      <p className="text-xs tracking-[0.35em] uppercase text-primary-500 mb-6">
        Manufacturing
      </p>

      <h2 className="text-3xl font-bold text-primary-900 mb-6">
        {t('factory.title')}
      </h2>

      <p className="text-neutral-700 leading-relaxed mb-8">
        {t('factory.description')}
      </p>

      <div className="text-sm text-neutral-600 space-y-2">
        <p>〒435-0016 静岡県浜松市中央区高塚町1620</p>
        <p>TEL 053-570-2555</p>
      </div>
    </div>

    <div className="relative aspect-[4/3]">
      <Image
        src="/about/process.webp"
        alt=""
        fill
        className="object-cover"
      />
    </div>

  </div>
</section>

      {/* ── ESG ── */}
  <section className="py-32 bg-primary-900 text-white">
  <div className="container-custom max-w-6xl">

    <div className="text-center mb-24">
      <p className="text-xs tracking-[0.35em] uppercase text-accent-400 mb-6">
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
              <h3 className="text-2xl font-bold mb-6 text-accent-300">
                {section.title}
              </h3>

              <p className="text-white/70 mb-10">
                {section.subtitle}
              </p>

              <div className="space-y-6">
                {Object.entries(section.items).map(([itemKey, item]) => (
                  <div key={itemKey}>
                    <h4 className="font-semibold mb-2">
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
                <div key={i} className="relative aspect-[4/3]">
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
        );
      })}

    </div>
  </div>
</section>

    </div>
  );
}
