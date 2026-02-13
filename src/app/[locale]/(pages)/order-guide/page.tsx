'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function OrderGuidePage() {
  const locale = useLocale();

  const isPT = locale === 'pt';

  return (
    <div className="flex flex-col">

      {/* ───────────────── HERO ───────────────── */}
      <section className="relative h-[420px] sm:h-[480px] flex items-center pt-28 sm:pt-32 overflow-hidden">

  {/* Background */}
  <Image
    src="/about/factory.webp"
    alt="Order Guide"
    fill
    priority
    className="object-cover"
  />

  {/* Overlay suave institucional */}
  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />

  <div className="relative z-10 container-custom">
    <div className="max-w-3xl">

      <p className="text-primary-600 text-sm font-semibold tracking-widest uppercase mb-4">
        Order Guide
      </p>

      <h1 className="text-4xl sm:text-5xl font-bold text-primary-900 leading-tight mb-6">
        {locale === 'pt' ? 'Guia de Pedidos' : '注文ガイド'}
      </h1>

      <p className="text-lg text-neutral-700 max-w-xl leading-relaxed">
        {locale === 'pt'
          ? 'Processo estruturado para empresas e clientes finais.'
          : '法人・個人のお客様向けの注文フローをご案内します。'}
      </p>

    </div>
  </div>
</section>

      {/* ───────────────── STATUS BADGE ───────────────── */}
      <section className="py-12 bg-cream-50">
        <div className="container-custom text-center">

          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent-400/15 border border-accent-400/30 text-primary-900 font-medium text-sm">
            ⚠ {isPT
              ? 'Sistema de pedidos online em desenvolvimento. Em breve disponível.'
              : 'オンライン注文システムは現在開発中です。近日公開予定。'}
          </div>

        </div>
      </section>

      {/* ───────────────── INTRO PROCESSO ───────────────── */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-4xl text-center">

          <h2 className="heading-3 text-primary-800 mb-6">
            {isPT
              ? 'Como funcionará o processo'
              : 'ご注文の流れ'}
          </h2>

          <p className="text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            {isPT
              ? 'Estamos estruturando uma plataforma segura e eficiente para atender tanto empresas quanto consumidores finais, com logística refrigerada e rastreabilidade completa.'
              : '法人および個人のお客様に向けて、安全かつ効率的なオンライン注文システムを構築中です。冷凍・冷蔵物流とトレーサビリティにも対応予定です。'}
          </p>

        </div>
      </section>

      {/* ───────────────── TIPOS DE CLIENTE ───────────────── */}
      <section className="py-20 bg-neutral-50">
        <div className="container-custom">

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">

            {/* B2B */}
            <div className="rounded-2xl bg-white shadow-soft p-10 border border-neutral-200 hover:shadow-card transition">

              <h3 className="text-xl font-semibold text-primary-800 mb-4">
                {isPT ? 'Para Empresas (B2B)' : '法人のお客様'}
              </h3>

              <ul className="space-y-3 text-sm text-neutral-600 mb-8">
                <li>• {isPT ? 'Pedido por volume / atacado' : '業務用・大量注文対応'}</li>
                <li>• {isPT ? 'Condições comerciais diferenciadas' : '法人価格設定'}</li>
                <li>• {isPT ? 'Entrega refrigerada programada' : '冷凍・冷蔵配送'}</li>
                <li>• {isPT ? 'Suporte dedicado' : '専用サポート'}</li>
              </ul>

              <Link
                href={`/${locale}/contact`}
                className="btn-primary w-full text-center"
              >
                {isPT ? 'Solicitar informações' : 'お問い合わせ'}
              </Link>

            </div>

            {/* B2C */}
            <div className="rounded-2xl bg-white shadow-soft p-10 border border-neutral-200 hover:shadow-card transition">

              <h3 className="text-xl font-semibold text-primary-800 mb-4">
                {isPT ? 'Para Consumidor Final (B2C)' : '個人のお客様'}
              </h3>

              <ul className="space-y-3 text-sm text-neutral-600 mb-8">
                <li>• {isPT ? 'Compra online com cartão (Stripe)' : 'オンライン決済対応（Stripe）予定'}</li>
                <li>• {isPT ? 'Entrega refrigerada' : '冷凍配送対応'}</li>
                <li>• {isPT ? 'Pedido mínimo aplicável' : '最低注文数量あり'}</li>
                <li>• {isPT ? 'Rastreamento de envio' : '配送追跡'}</li>
              </ul>

              <Link
                href={`/${locale}/products`}
                className="btn-secondary w-full text-center"
              >
                {isPT ? 'Ver produtos' : '商品一覧を見る'}
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* ───────────────── LOGÍSTICA ───────────────── */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-4xl text-center">

          <h2 className="heading-3 text-primary-800 mb-6">
            {isPT ? 'Logística especializada' : '専用物流システム'}
          </h2>

          <p className="text-neutral-600 leading-relaxed">
            {isPT
              ? 'Todos os pedidos serão processados com controle de temperatura e embalagens apropriadas para garantir qualidade e segurança alimentar.'
              : 'すべての注文は温度管理のもと適切に梱包され、品質と安全性を維持した状態でお届けします。'}
          </p>

        </div>
      </section>

    </div>
  );
}