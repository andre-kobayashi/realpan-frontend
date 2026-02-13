'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Zap, ChevronRight, Clock } from 'lucide-react';

// Dados mockados — futuramente virão de uma API ou CMS
const DEALS = [
  {
    id: 'd1',
    name:    { pt: 'Pão de Queijo Tradicional', ja: 'ポン・デ・ケイジョ' },
    image:   '/products/pao-de-queijo-tradicional.webp',
    badge:   { pt: 'Kit B2B', ja: '法人セット' },
    tag:     { pt: 'Oferta Relâmpago', ja: 'タイムセール' },
    label:   { pt: 'Lote de 200 un.', ja: '200個セット' },
  },
  {
    id: 'd2',
    name:    { pt: 'Pão Francês Brasileiro', ja: 'ブラジル風フランスパン' },
    image:   '/products/pao-frances.webp',
    badge:   { pt: 'Buffet Pack', ja: 'ビュッフェパック' },
    tag:     { pt: 'Mais Pedido', ja: '人気商品' },
    label:   { pt: 'Caixa 50 un.', ja: '50個入り' },
  },
  {
    id: 'd3',
    name:    { pt: 'Picolé de Maracujá', ja: 'パッションフルーツアイスバー' },
    image:   '/products/picole-maracuja.webp',
    badge:   { pt: 'Natural', ja: 'ナチュラル' },
    tag:     { pt: 'Novo Sabor', ja: '新フレーバー' },
    label:   { pt: 'Caixa 24 un.', ja: '24本入り' },
  },
  {
    id: 'd4',
    name:    { pt: 'Coxinha de Frango', ja: 'コシニャ チキン' },
    image:   '/products/coxinha-frango.webp',
    badge:   { pt: 'Congelado', ja: '冷凍' },
    tag:     { pt: 'Top Vendas', ja: 'ベストセラー' },
    label:   { pt: 'Caixa 60 un.', ja: '60個入り' },
  },
  {
    id: 'd5',
    name:    { pt: 'Mistura Pão de Queijo', ja: 'ミックス粉' },
    image:   '/products/mistura-pao-queijo.webp',
    badge:   { pt: 'Seco', ja: '常温' },
    tag:     { pt: 'Kit Loja', ja: 'ショップセット' },
    label:   { pt: 'Caixa 24 × 500g', ja: '24袋入り' },
  },
];

// Timer: próximo ciclo de 24 h a partir de meia-noite
function useCountdown() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    function calc() {
      const now  = new Date();
      const end  = new Date();
      end.setHours(23, 59, 59, 0);
      const diff = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
      setTime({
        h: Math.floor(diff / 3600),
        m: Math.floor((diff % 3600) / 60),
        s: diff % 60,
      });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function Digit({ val }: { val: number }) {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-800 text-white text-sm font-bold tabular-nums">
      {String(val).padStart(2, '0')}
    </span>
  );
}

export function FlashDealsSection() {
  const locale = useLocale() as 'pt' | 'ja';
  const { h, m, s } = useCountdown();

  return (
    <section className="bg-white py-6 lg:py-10">
      <div className="container-custom">

        {/* ── Cabeçalho ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {/* Ícone relâmpago */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-400">
              <Zap className="h-5 w-5 fill-primary-900 text-primary-900" />
            </div>
            <div>
              <h2 className="text-base font-bold text-primary-900 leading-tight">
                {locale === 'pt' ? 'Ofertas Relâmpago' : 'タイムセール'}
              </h2>
              <p className="text-xs text-neutral-500">
                {locale === 'pt' ? 'Válido por hoje' : '本日限り'}
              </p>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-1 ml-3">
              <Clock className="h-3.5 w-3.5 text-neutral-400" />
              <Digit val={h} />
              <span className="text-neutral-400 font-bold text-xs">:</span>
              <Digit val={m} />
              <span className="text-neutral-400 font-bold text-xs">:</span>
              <Digit val={s} />
            </div>
          </div>

          <Link
            href={`/${locale}/products`}
            className="flex items-center gap-1 text-xs font-semibold text-primary-700"
          >
            {locale === 'pt' ? 'Ver todos' : 'すべて見る'}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ── Carrossel horizontal ── */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-5">
          {DEALS.map((deal) => (
            <Link
              key={deal.id}
              href={`/${locale}/products`}
              className="group flex-shrink-0 w-[148px] lg:w-auto rounded-2xl bg-neutral-50 ring-1 ring-neutral-200 overflow-hidden transition-all hover:shadow-card hover:-translate-y-0.5"
            >
              {/* Tag colorida */}
              <div className="flex items-center justify-between px-3 pt-3">
                <span className="rounded-full bg-primary-700 px-2.5 py-1 text-[9px] font-bold text-white">
                  {deal.tag[locale]}
                </span>
                <span className="rounded-full bg-accent-400 px-2.5 py-1 text-[9px] font-bold text-primary-900">
                  {deal.badge[locale]}
                </span>
              </div>

              {/* Imagem */}
              <div className="relative mx-3 mt-2 aspect-square overflow-hidden rounded-xl bg-white">
                <Image
                  src={deal.image}
                  alt={deal.name[locale]}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="px-3 pb-3 pt-2">
                <p className="text-xs font-semibold text-primary-900 line-clamp-2 leading-snug mb-1">
                  {deal.name[locale]}
                </p>
                <p className="text-[10px] text-neutral-500">{deal.label[locale]}</p>
                <div className="mt-2 rounded-lg bg-primary-700 py-1.5 text-center text-[10px] font-bold text-white">
                  {locale === 'pt' ? 'Solicitar' : '問い合わせ'}
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
