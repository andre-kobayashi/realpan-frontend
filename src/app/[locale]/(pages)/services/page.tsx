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

/* ── B2B CTA Component ── */
function B2BCallToAction({ locale }: { locale: string }) {
  const { customer, loading } = useAuth();
  const typedCustomer = customer as ServiceCustomer | null;
  const isLoggedIn = !!typedCustomer;
  const isPJ = typedCustomer?.type === 'BUSINESS' || typedCustomer?.customerType === 'BUSINESS';
  const isApproved = typedCustomer?.businessStatus === 'APPROVED';
  const ja = locale === 'ja';

  if (loading) return null;

  if (isLoggedIn && isPJ && isApproved) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Link href={`/${locale}/products`}
          className="inline-flex items-center gap-2 bg-[#D4972A] hover:bg-[#B87A20] text-white px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-sm group">
          <ShoppingCart className="h-4 w-4" />
          {ja ? '卸売価格で購入する' : 'Comprar com preço atacado'}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link href={`/${locale}/contact`}
          className="inline-flex items-center gap-2 text-sm text-[#57749A] hover:text-[#D4972A] transition-colors">
          <MessageCircle className="h-4 w-4" />
          {ja ? '特別注文のお問い合わせ' : 'Pedido especial? Fale conosco'}
        </Link>
      </div>
    );
  }

  if (isLoggedIn && isPJ && !isApproved) {
    return (
      <div className="bg-[#FDF8ED] border border-[#ECC76E] rounded-xl p-4 text-sm text-[#B87A20]">
        {ja
          ? 'アカウントは現在審査中です。承認後、卸売価格でご購入いただけます。'
          : 'Sua conta está em análise. Após aprovação, você terá acesso aos preços especiais.'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Link href={`/${locale}/register`}
          className="inline-flex items-center gap-2 bg-[#D4972A] hover:bg-[#B87A20] text-white px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-sm group">
          <UserPlus className="h-4 w-4" />
          {ja ? '法人アカウントを作成' : 'Criar conta empresarial'}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        {!isLoggedIn && (
          <Link href={`/${locale}/login`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#D4972A] hover:text-[#B87A20] transition-colors">
            <LogIn className="h-4 w-4" />
            {ja ? 'ログインはこちら' : 'Já tem conta? Fazer login'}
          </Link>
        )}
      </div>
      <p className="text-xs text-[#8099B8]">
        {ja
          ? '※承認後、卸売価格が適用されます。カタログにない商品はお問い合わせください。'
          : '※Após aprovação, preços especiais serão aplicados. Para itens fora do catálogo, entre em contato.'}
      </p>
    </div>
  );
}

/* ── Main Page ── */
export default function ServicesPage() {
  const t = useTranslations('services');
  const locale = useLocale();
  const serviceKeys: ServiceKey[] = ['hotel', 'supermarket', 'shop', 'online'];

  return (
    <div className="flex flex-col bg-[#FAF7F2]">

      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-[#2A1810] via-[#1A2740] to-[#233550] text-white py-14 lg:py-20 overflow-hidden">
        <Image src="/services/service-hero.webp" alt="" fill className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2740]/80 via-[#1A2740]/30 to-transparent" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#D4972A] rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#ECC76E] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 container-custom text-center">
          <div className="inline-flex items-center gap-2 bg-[#D4972A] px-4 py-1.5 rounded-full text-sm mb-6 shadow-lg">
            <span>💼</span>
            <span className="text-white font-semibold">{locale === 'pt' ? 'Serviços B2B' : '法人向けサービス'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            {t('hero.title')}
          </h1>
          <p className="text-white/85 max-w-3xl mx-auto text-base lg:text-lg leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full"><path d="M0 0C480 45 960 45 1440 0V60H0V0Z" fill="#FAF7F2"/></svg>
        </div>
      </section>

      {/* ═══ SERVICE SECTIONS ═══ */}
      <div>
        {serviceKeys.map((key, i) => {
          if (key === 'online') return null;

          const service = t.raw(key) as { title: string; description: string; cases: string[] };
          const isEven = i % 2 === 0;
          const bgClass = isEven ? 'bg-white' : 'bg-[#FAF7F2]';

          return (
            <section key={key} className={`py-14 lg:py-24 ${bgClass}`}>
              <div className="container-custom">
                <div className={`grid gap-8 lg:gap-16 lg:grid-cols-2 items-center ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Image */}
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg ${!isEven ? 'lg:col-start-2' : ''}`}>
                    <Image src={serviceImages[key]} alt={service.title} fill className="object-cover" />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md flex items-center gap-2">
                      <span className="text-xl">{serviceIcons[key]}</span>
                      <span className="text-xs font-bold text-[#1A2740]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    <div className="inline-flex items-center gap-2 text-[#D4972A] text-sm font-bold mb-3">
                      <div className="h-7 w-7 rounded-full bg-[#FDF8ED] border border-[#ECC76E]/30 flex items-center justify-center text-xs">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <span className="uppercase tracking-wider text-[11px]">
                        {locale === 'pt' ? 'Serviço' : 'サービス'}
                      </span>
                    </div>

                    <h2 className="text-2xl lg:text-3xl font-semibold text-[#1A2740] mb-4 leading-tight">
                      {service.title}
                    </h2>

                    <p className="text-[#57749A] text-sm lg:text-base leading-relaxed mb-8">
                      {service.description}
                    </p>

                    {/* Cases */}
                    <div className="bg-[#FEFCF8] rounded-xl border border-[#F5EDE0] p-5 mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-1 w-6 bg-[#D4972A] rounded-full" />
                        <p className="text-[10px] font-bold text-[#D4972A] uppercase tracking-wider">
                          {locale === 'pt' ? 'Casos de Uso' : '事例紹介'}
                        </p>
                      </div>
                      <ul className="space-y-2.5">
                        {service.cases.map((c: string, ci: number) => (
                          <li key={ci} className="flex items-start gap-2.5 text-[#1A2740] text-sm">
                            <Check className="h-4 w-4 text-[#D4972A] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
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

      {/* ═══ ONLINE SHOP SECTION ═══ */}
      {(() => {
        const online = t.raw('online') as { title: string; description: string; cta: string };
        return (
          <section className="bg-gradient-to-br from-[#2A1810] via-[#1A2740] to-[#233550] py-14 lg:py-24 text-white">
            <div className="container-custom">
              <div className="grid gap-10 lg:grid-cols-2 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-[#ECC76E] text-xs font-bold px-4 py-1.5 rounded-full mb-5">
                    <span>🛒</span>
                    <span>04</span>
                  </div>

                  <h2 className="text-2xl lg:text-4xl font-semibold text-white mb-5 leading-tight">
                    {online.title}
                  </h2>

                  <p className="text-white/70 text-base leading-relaxed mb-8">
                    {online.description}
                  </p>

                  <Link href={`/${locale}/products`}
                    className="inline-flex items-center gap-2 bg-[#D4972A] hover:bg-[#B87A20] text-white
                               px-8 py-3.5 rounded-full font-semibold text-sm
                               transition-all shadow-lg active:scale-[0.97]">
                    <ShoppingCart className="h-5 w-5" />
                    {online.cta}
                  </Link>
                </div>

                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl border-2 border-white/10">
                  <Image src="/services/service-online.webp" alt="Loja Online" fill className="object-cover" />
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="container-custom text-center max-w-3xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#ECC76E]/50" />
            <div className="h-2 w-2 rounded-full bg-[#D4972A]" />
            <div className="h-px w-12 bg-[#ECC76E]/50" />
          </div>

          <h2 className="text-2xl lg:text-4xl font-semibold text-[#1A2740] mb-5">
            {locale === 'pt' ? 'Pronto para Começar?' : 'ご相談・ご注文はお気軽に'}
          </h2>

          <p className="text-[#57749A] text-base leading-relaxed mb-10">
            {locale === 'pt'
              ? 'Crie sua conta empresarial para acessar preços especiais, ou acesse nosso catálogo completo.'
              : '法人アカウントを作成して卸売価格をご利用ください。商品カタログもぜひご覧ください。'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/${locale}/register`}
              className="inline-flex items-center justify-center gap-2 bg-[#D4972A] hover:bg-[#B87A20] text-white
                         px-8 py-3 rounded-full text-sm font-semibold transition-all shadow-sm">
              🏢 {locale === 'pt' ? 'Criar Conta Empresarial' : '法人アカウント作成'}
            </Link>
            <Link href={`/${locale}/products`}
              className="inline-flex items-center justify-center gap-2 border-2 border-[#D4972A] text-[#D4972A]
                         px-8 py-3 rounded-full text-sm font-semibold
                         hover:bg-[#D4972A] hover:text-white transition-all">
              🛒 {locale === 'pt' ? 'Ver Catálogo' : '商品カタログ'}
            </Link>
          </div>

          <p className="mt-6 text-sm text-[#8099B8]">
            {locale === 'pt' ? 'Pedido especial fora do catálogo? ' : 'カタログにない特別注文は'}
            <Link href={`/${locale}/contact`} className="text-[#D4972A] hover:underline font-medium">
              {locale === 'pt' ? 'Fale conosco →' : 'こちらから →'}
            </Link>
          </p>

          <div className="flex items-center justify-center gap-3 mt-10">
            <div className="h-px w-12 bg-[#ECC76E]/50" />
            <div className="h-2 w-2 rounded-full bg-[#D4972A]" />
            <div className="h-px w-12 bg-[#ECC76E]/50" />
          </div>
        </div>
      </section>
    </div>
  );
}