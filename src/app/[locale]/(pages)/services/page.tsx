'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ExternalLink, ArrowRight } from 'lucide-react';

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
    <div className="flex flex-col bg-white">

      {/* ═══════ HERO STYLEBREAD ═══════ */}
      <section className="relative bg-beige-50 py-16 lg:py-24 overflow-hidden">
        {/* Imagem de fundo sutil */}
        <div className="absolute inset-0 opacity-5">
          <Image
            src="/services/service-hero.webp"
            alt=""
            fill
            className="object-cover"
          />
        </div>

        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <span>💼</span>
            <span>{locale === 'pt' ? 'SERVIÇOS B2B' : '法人向けサービス'}</span>
          </div>

          <h1 className="font-abril text-4xl lg:text-6xl text-gray-900 mb-6 tracking-wide">
            {t('hero.title')}
          </h1>

          <p className="text-gray-600 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Decoração */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-orange-300" />
            <div className="h-2 w-2 rounded-full bg-orange-400" />
            <div className="h-px w-16 bg-orange-300" />
          </div>
        </div>
      </section>

      {/* ═══════ SERVICES ALTERNADOS ═══════ */}
      <div>
        {serviceKeys.map((key, i) => {
          if (key === 'online') return null; // online tem seção própria
          
          const service = t.raw(key) as { title: string; description: string; cases: string[] };
          const isEven = i % 2 === 0;

          // Alternar backgrounds: white → cream → white
          const bgClass = isEven ? 'bg-white' : 'bg-cream-50';

          return (
            <section key={key} className={`py-16 lg:py-24 ${bgClass}`}>
              <div className="container-custom">
                <div className={`grid gap-8 lg:gap-16 lg:grid-cols-2 items-center ${!isEven ? 'lg:grid-flow-dense' : ''}`}>

                  {/* ─── IMAGEM ─── */}
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-3xl ${!isEven ? 'lg:col-start-2' : ''}`}>
                    <Image
                      src={serviceImages[key]}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Badge icon */}
                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                      <span className="text-2xl">{serviceIcons[key]}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* ─── CONTEÚDO ─── */}
                  <div className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    
                    {/* Número */}
                    <div className="inline-flex items-center gap-2 text-orange-600 text-sm font-bold mb-3">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <span className="uppercase tracking-wider">
                        {locale === 'pt' ? 'Serviço' : 'サービス'}
                      </span>
                    </div>

                    {/* Título */}
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                      {service.title}
                    </h2>

                    {/* Descrição */}
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                      {service.description}
                    </p>

                    {/* Cases - Card branco */}
                    <div className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-1 w-8 bg-orange-400 rounded-full" />
                        <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                          {locale === 'pt' ? 'Casos de Uso' : '事例紹介'}
                        </p>
                      </div>

                      <ul className="space-y-3">
                        {service.cases.map((c: string, ci: number) => (
                          <li key={ci} className="flex items-start gap-3 text-gray-800">
                            <div className="mt-0.5 flex-shrink-0">
                              <Check className="h-5 w-5 text-orange-500" strokeWidth={2.5} />
                            </div>
                            <span className="leading-relaxed">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <div className="mt-8">
                      <Link 
                        href={`/${locale}/order/business`} 
                        className="inline-flex items-center gap-2 btn-orange text-base group"
                      >
                        {locale === 'pt' ? 'Fazer Pedido' : 'ご注文はこちら'}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ═══════ ONLINE SHOP - DESTAQUE ═══════ */}
      {(() => {
        const online = t.raw('online') as { title: string; description: string; cta: string };
        return (
          <section className="bg-gradient-to-br from-orange-500 to-orange-600 py-16 lg:py-24 text-white">
            <div className="container-custom">
              <div className="grid gap-12 lg:grid-cols-2 items-center">

                {/* Conteúdo */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                    <span>🛒</span>
                    <span>04</span>
                  </div>

                  <h2 className="font-abril text-3xl lg:text-5xl text-white mb-6 leading-tight">
                    {online.title}
                  </h2>

                  <p className="text-white/90 text-lg leading-relaxed mb-8">
                    {online.description}
                  </p>

                  <a
                    href="https://www.rakuten.co.jp/realsabor/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-full hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 text-base"
                  >
                    {online.cta}
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>

                {/* Imagem */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl border-4 border-white/20">
                  <Image
                    src="/services/service-online.webp"
                    alt="Loja Online"
                    fill
                    className="object-cover"
                  />
                </div>

              </div>
            </div>
          </section>
        );
      })()}

      {/* ═══════ CTA FINAL STYLEBREAD ═══════ */}
      <section className="py-16 lg:py-24 bg-beige-50">
        <div className="container-custom text-center max-w-3xl">
          
          {/* Decoração superior */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-orange-300" />
            <div className="h-2 w-2 rounded-full bg-orange-400" />
            <div className="h-px w-12 bg-orange-300" />
          </div>

          <h2 className="font-abril text-3xl lg:text-5xl text-gray-900 mb-6">
            {locale === 'pt' ? 'Pronto para Começar?' : 'ご相談・ご注文はお気軽に'}
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-10">
            {locale === 'pt'
              ? 'Entre em contato para orçamentos personalizados ou acesse nosso guia de pedidos.'
              : '法人・個人を問わず、ご質問やお見積りはお気軽にお問い合わせください。'}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/${locale}/contact`} 
              className="btn-orange text-base"
            >
              {locale === 'pt' ? '💬 Fale Conosco' : '💬 お問い合わせ'}
            </Link>
            
            <Link 
              href={`/${locale}/order-guide`} 
              className="btn-orange-outline text-base"
            >
              {locale === 'pt' ? '📋 Guia de Pedidos' : '📋 注文ガイド'}
            </Link>
          </div>

          {/* Decoração inferior */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <div className="h-px w-12 bg-orange-300" />
            <div className="h-2 w-2 rounded-full bg-orange-400" />
            <div className="h-px w-12 bg-orange-300" />
          </div>
        </div>
      </section>

    </div>
  );
}