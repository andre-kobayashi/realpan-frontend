'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ShoppingCart, ArrowRight, LogIn, UserPlus, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type ServiceKey = 'hotel' | 'supermarket' | 'shop' | 'online';

type ServiceCustomer = {
  type?: 'INDIVIDUAL' | 'BUSINESS';
  customerType?: 'INDIVIDUAL' | 'BUSINESS';
  businessStatus?: 'APPROVED' | 'PENDING' | 'REJECTED' | string;
};

const serviceImages: Record<ServiceKey, string> = {
  hotel: '/services/service-hotel.webp',
  supermarket: '/services/service-supermarket.webp',
  shop: '/services/service-shop.webp',
  online: '/services/service-online.webp',
};

const serviceIcons: Record<ServiceKey, string> = {
  hotel: '🏨',
  supermarket: '🛒',
  shop: '🇧🇷',
  online: '💻',
};

function B2BCallToAction({ locale }: { locale: string }) {
  const { customer, loading } = useAuth();
  const typedCustomer = customer as ServiceCustomer | null;
  const isLoggedIn = !!typedCustomer;
  const isPJ =
    typedCustomer?.type === 'BUSINESS' ||
    typedCustomer?.customerType === 'BUSINESS';
  const isApproved = typedCustomer?.businessStatus === 'APPROVED';
  const ja = locale === 'ja';

  if (loading) return null;

  if (isLoggedIn && isPJ && isApproved) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/${locale}/products`}
          className="inline-flex items-center gap-2 btn-orange text-base group"
        >
          <ShoppingCart className="h-4 w-4" />
          {ja ? '卸売価格で購入する' : 'Comprar com preço atacado'}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href={`/${locale}/contact`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          {ja ? '特別注文のお問い合わせ' : 'Pedido especial? Fale conosco'}
        </Link>
      </div>
    );
  }

  if (isLoggedIn && isPJ && !isApproved) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
        {ja
          ? 'アカウントは現在審査中です。承認後、卸売価格でご購入いただけます。'
          : 'Sua conta está em análise. Após aprovação, você terá acesso aos preços especiais.'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/${locale}/register`}
          className="inline-flex items-center gap-2 btn-orange text-base group"
        >
          <UserPlus className="h-4 w-4" />
          {ja ? '法人アカウントを作成' : 'Criar conta empresarial'}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        {!isLoggedIn && (
          <Link
            href={`/${locale}/login`}
            className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
          >
            <LogIn className="h-4 w-4" />
            {ja ? 'ログインはこちら' : 'Já tem conta? Fazer login'}
          </Link>
        )}
      </div>
      <p className="text-xs text-gray-400">
        {ja
          ? '※承認後、卸売価格が適用されます。カタログにない商品はお問い合わせください。'
          : '※Após aprovação, preços especiais serão aplicados. Para itens fora do catálogo, entre em contato.'}
      </p>
    </div>
  );
}

export default function ServicesPage() {
  const t = useTranslations('services');
  const locale = useLocale();

  const serviceKeys: ServiceKey[] = ['hotel', 'supermarket', 'shop', 'online'];

  return (
    <div className="flex flex-col bg-white">
      <section className="relative bg-beige-50 py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image src="/services/service-hero.webp" alt="" fill className="object-cover" />
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

          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-orange-300" />
            <div className="h-2 w-2 rounded-full bg-orange-400" />
            <div className="h-px w-16 bg-orange-300" />
          </div>
        </div>
      </section>

      <div>
        {serviceKeys.map((key, i) => {
          if (key === 'online') return null;

          const service = t.raw(key) as { title: string; description: string; cases: string[] };
          const isEven = i % 2 === 0;
          const bgClass = isEven ? 'bg-white' : 'bg-cream-50';

          return (
            <section key={key} className={`py-16 lg:py-24 ${bgClass}`}>
              <div className="container-custom">
                <div className={`grid gap-8 lg:gap-16 lg:grid-cols-2 items-center ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-3xl ${!isEven ? 'lg:col-start-2' : ''}`}>
                    <Image src={serviceImages[key]} alt={service.title} fill className="object-cover" />
                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                      <span className="text-2xl">{serviceIcons[key]}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  <div className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    <div className="inline-flex items-center gap-2 text-orange-600 text-sm font-bold mb-3">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <span className="uppercase tracking-wider">
                        {locale === 'pt' ? 'Serviço' : 'サービス'}
                      </span>
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                      {service.title}
                    </h2>

                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                      {service.description}
                    </p>

                    <div className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm mb-8">
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

                    <B2BCallToAction locale={locale} />
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {(() => {
        const online = t.raw('online') as { title: string; description: string; cta: string };
        return (
          <section className="bg-gradient-to-br from-orange-500 to-orange-600 py-16 lg:py-24 text-white">
            <div className="container-custom">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
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

                  <Link
                    href={`/${locale}/products`}
                    className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-full hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 text-base"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {online.cta}
                  </Link>
                </div>

                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl border-4 border-white/20">
                  <Image src="/services/service-online.webp" alt="Loja Online" fill className="object-cover" />
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      <section className="py-16 lg:py-24 bg-beige-50">
        <div className="container-custom text-center max-w-3xl">
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
              ? 'Crie sua conta empresarial para acessar preços especiais, ou acesse nosso catálogo completo.'
              : '法人アカウントを作成して卸売価格をご利用ください。商品カタログもぜひご覧ください。'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/register`} className="btn-orange text-base">
              {locale === 'pt' ? '🏢 Criar Conta Empresarial' : '🏢 法人アカウント作成'}
            </Link>

            <Link href={`/${locale}/products`} className="btn-orange-outline text-base">
              {locale === 'pt' ? '🛒 Ver Catálogo' : '🛒 商品カタログ'}
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            {locale === 'pt'
              ? 'Pedido especial fora do catálogo? '
              : 'カタログにない特別注文は'}
            <Link href={`/${locale}/contact`} className="text-orange-600 hover:underline font-medium">
              {locale === 'pt' ? 'Fale conosco →' : 'こちらから →'}
            </Link>
          </p>

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