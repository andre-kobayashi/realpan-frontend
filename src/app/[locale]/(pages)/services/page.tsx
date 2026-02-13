'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ExternalLink } from 'lucide-react';

type ServiceKey = 'hotel' | 'supermarket' | 'shop' | 'online';

const serviceImages: Record<ServiceKey, string> = {
  hotel:       '/services/service-hotel.webp',
  supermarket: '/services/service-supermarket.webp',
  shop:        '/services/service-shop.webp',
  online:      '/services/service-online.webp',
};

const serviceIcons: Record<ServiceKey, string> = {
  hotel:       '🏨',
  supermarket: '🛒',
  shop:        '🇧🇷',
  online:      '💻',
};

export default function ServicesPage() {
  const t = useTranslations('services');
  const locale = useLocale();

  const serviceKeys: ServiceKey[] = ['hotel', 'supermarket', 'shop', 'online'];

  return (
    <div className="flex flex-col">

      {/* ── HERO ── */}
      <section className="relative h-[420px] bg-primary-800 overflow-hidden">
        <Image
          src="/services/service-hero.webp"
          alt=""
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="relative z-10 flex h-full items-center justify-center text-center px-4">
          <div>
            <p className="mb-3 text-accent-400 text-sm font-semibold tracking-widest uppercase">
              Services / サービス案内
            </p>
            <h1 className="heading-1 text-white mb-6">{t('hero.title')}</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <div className="divide-y divide-neutral-100">
        {serviceKeys.map((key, i) => {
          if (key === 'online') return null; // online tem seção própria
          const service = t.raw(key) as { title: string; description: string; cases: string[] };
          const isEven = i % 2 === 0;

          return (
            <section key={key} className="py-20">
              <div className="container-custom">
                <div className={`grid gap-12 lg:grid-cols-2 items-center ${!isEven ? 'lg:grid-flow-dense' : ''}`}>

                  {/* Imagem */}
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card ${!isEven ? 'lg:col-start-2' : ''}`}>
                    <Image
                      src={serviceImages[key]}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-primary-800/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                      <span className="text-xl">{serviceIcons[key]}</span>
                    </div>
                  </div>

                  {/* Texto */}
                  <div className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    <p className="text-accent-500 text-xs font-semibold tracking-widest uppercase mb-2">
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <h2 className="heading-2 text-primary-800 mb-4">{service.title}</h2>
                    <p className="text-neutral-600 leading-relaxed mb-6">{service.description}</p>

                    {/* Cases */}
                    <div className="rounded-xl bg-primary-50 border border-primary-100 p-5">
                      <p className="text-xs font-semibold text-primary-700 uppercase tracking-wider mb-3">
                        Case — 事例紹介
                      </p>
                      <ul className="space-y-2">
                        {service.cases.map((c: string, ci: number) => (
                          <li key={ci} className="flex items-start gap-2 text-sm text-primary-800">
                            <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent-500" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <div className="mt-6">
                      <Link href={`/${locale}/order/business`} className="btn-primary">
                        {locale === 'pt' ? 'Fazer pedido' : 'ご注文はこちら'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ── ONLINE SHOP ── */}
      {(() => {
        const online = t.raw('online') as { title: string; description: string; cta: string };
        return (
          <section className="bg-primary-800 py-20">
            <div className="container-custom">
              <div className="grid gap-12 lg:grid-cols-2 items-center">

                <div>
                  <p className="text-accent-400 text-xs font-semibold tracking-widest uppercase mb-2">
                    04
                  </p>
                  <h2 className="heading-2 text-white mb-4">{online.title}</h2>
                  <p className="text-white/75 leading-relaxed mb-8">{online.description}</p>
                  <a
                    href="https://www.rakuten.co.jp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent inline-flex items-center gap-2"
                  >
                    {online.cta}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-navy">
                  <Image
                    src="/services/service-online.webp"
                    alt="Loja Online"
                    fill
                    className="object-cover opacity-80"
                  />
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── CTA FINAL ── */}
      <section className="py-20 bg-cream-50">
        <div className="container-custom text-center max-w-2xl">
          <h2 className="heading-2 text-primary-800 mb-4">
            {locale === 'pt' ? 'Pronto para começar?' : 'ご相談・ご注文はお気軽に'}
          </h2>
          <p className="text-neutral-600 mb-8">
            {locale === 'pt'
              ? 'Entre em contato para orçamentos personalizados ou acesse nosso guia de pedidos.'
              : '法人・個人を問わず、ご質問やお見積りはお気軽にお問い合わせください。'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={`/${locale}/contact`} className="btn-primary">
              {locale === 'pt' ? 'Fale conosco' : 'お問い合わせ'}
            </Link>
            <Link href={`/${locale}/order-guide`} className="btn-secondary">
              {locale === 'pt' ? 'Guia de pedidos' : '注文ガイド'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
