'use client';

import { useLocale } from 'next-intl';
import { Instagram, ExternalLink, ArrowRight, Newspaper, Bell } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const NEWS_ITEMS = {
  pt: [
    { date: '2026-03-01', title: 'Loja online inaugurada!', description: 'Agora você pode fazer pedidos diretamente pelo nosso site. Entrega para todo o Japão.', tag: 'Novo', tagColor: 'bg-[#D4972A]', link: '' },
    { date: '2026-03-02', title: '🧑‍🍳 Estamos contratando!', description: 'A Real Pan está expandindo e procura profissionais com experiência comprovada no ramo de padaria.', tag: 'Vagas', tagColor: 'bg-red-500', link: '/careers' },
    { date: '2026-01-20', title: 'Atendimento para empresas', description: 'Criamos uma área exclusiva para clientes corporativos com preços diferenciados e faturamento mensal.', tag: 'B2B', tagColor: 'bg-[#1A2740]', link: '' },
  ],
  ja: [
    { date: '2026-03-01', title: 'オンラインショップオープン！', description: '当サイトから直接ご注文いただけるようになりました。日本全国へ配送いたします。', tag: '新着', tagColor: 'bg-[#D4972A]', link: '' },
    { date: '2026-03-02', title: '🧑‍🍳 スタッフ募集中！', description: 'リアルパンは事業拡大に伴い、パン製造の経験者を募集しています。', tag: '採用', tagColor: 'bg-red-500', link: '/careers' },
    { date: '2026-01-20', title: '法人向けサービス開始', description: '法人のお客様専用エリアを開設しました。特別価格と月次請求でご利用いただけます。', tag: 'B2B', tagColor: 'bg-[#1A2740]', link: '' },
  ],
};

const INSTAGRAM_HANDLE = '@realpan_realsabor';
const INSTAGRAM_URL = 'https://www.instagram.com/realpan_realsabor/';
const TOTAL_INSTAGRAM_PHOTOS = 32;

export default function NewsPage() {
  const locale = useLocale() as 'pt' | 'ja';
  const news = NEWS_ITEMS[locale];

  const [photos, setPhotos] = useState<number[]>([]);
  useEffect(() => {
    const shuffled = Array.from({ length: TOTAL_INSTAGRAM_PHOTOS }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5).slice(0, 9);
    setPhotos(shuffled);
  }, []);

  return (
    <div className="flex flex-col bg-[#FAF7F2]">

      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-[#2A1810] via-[#1A2740] to-[#233550] text-white py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#D4972A] rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#ECC76E] rounded-full blur-[120px]" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#D4972A] px-4 py-1.5 rounded-full text-sm mb-6 shadow-lg">
            <Bell className="h-4 w-4 text-[#ECC76E]" />
            <span>{locale === 'pt' ? 'Novidades & Instagram' : '新着情報 & Instagram'}</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold mb-5 text-white drop-shadow-lg">
            {locale === 'pt' ? 'Novidades' : '新着情報'}
          </h1>
          <p className="text-white/85 text-base lg:text-lg max-w-xl mx-auto">
            {locale === 'pt'
              ? 'Acompanhe as últimas novidades da Real Pan.'
              : 'リアルパンの最新情報をお届けします。'}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full"><path d="M0 0C480 60 960 60 1440 0V80H0V0Z" fill="#FAF7F2"/></svg>
        </div>
      </section>

      {/* ═══ NEWS ═══ */}
      <section className="py-12 lg:py-20 bg-[#FAF7F2]">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-8">
            <Newspaper className="h-5 w-5 text-[#D4972A]" />
            <h2 className="text-xl lg:text-2xl font-semibold text-[#1A2740]">
              {locale === 'pt' ? 'Últimas Notícias' : 'お知らせ'}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {news.map((item, i) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const CardWrapper = item.link ? Link : 'div' as any;
              const cardProps = item.link ? { href: `/${locale}${item.link}` } : {};
              return (
                <CardWrapper key={i} {...cardProps}
                  className="bg-white rounded-2xl overflow-hidden border border-[#F5EDE0] hover:border-[#ECC76E] hover:shadow-md transition-all group block">
                  <div className={`h-1 ${item.tagColor}`} />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`${item.tagColor} text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full`}>{item.tag}</span>
                      <time className="text-[11px] text-[#8099B8]">{new Date(item.date).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'pt-BR')}</time>
                    </div>
                    <h3 className="text-base font-semibold text-[#1A2740] mb-2 group-hover:text-[#D4972A] transition-colors">{item.title}</h3>
                    <p className="text-sm text-[#57749A] leading-relaxed">{item.description}</p>
                    {item.link && (
                      <p className="mt-3 text-sm font-medium text-[#D4972A] flex items-center gap-1">
                        {locale === 'ja' ? '詳しく見る' : 'Saiba mais'} <ArrowRight className="h-3.5 w-3.5" />
                      </p>
                    )}
                  </div>
                </CardWrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ INSTAGRAM ═══ */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 rounded-xl">
                <div className="bg-white rounded-[10px] p-2">
                  <Instagram className="h-5 w-5 text-pink-600" />
                </div>
              </div>
              <h2 className="text-xl lg:text-2xl font-semibold text-[#1A2740]">Instagram</h2>
            </div>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium text-sm transition-colors">
              <Instagram className="h-4 w-4" /> {INSTAGRAM_HANDLE} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="max-w-4xl mx-auto bg-[#FEFCF8] rounded-2xl p-6 lg:p-10 border border-[#F5EDE0]">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-1 rounded-full">
                    <div className="bg-white rounded-full p-1">
                      <div className="w-14 h-14 rounded-full bg-[#FDF8ED] flex items-center justify-center text-2xl">🍞</div>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-[#1A2740]">realpan_realsabor</p>
                    <p className="text-sm text-[#8099B8]">REAL PAN / リアルパン</p>
                  </div>
                </div>
                <p className="text-[#57749A] text-sm leading-relaxed mb-6">
                  {locale === 'pt'
                    ? '🇧🇷 Pães brasileiros autênticos feitos no Japão 🇯🇵\n📍 Hamamatsu, Shizuoka'
                    : '🇧🇷 日本で作る本格ブラジルパン 🇯🇵\n📍 静岡県浜松市'}
                </p>
                <div className="space-y-3">
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-bold py-3 px-6 rounded-full hover:shadow-lg transition-all text-sm">
                    <Instagram className="h-4 w-4" />
                    {locale === 'pt' ? 'Seguir no Instagram' : 'Instagramをフォロー'}
                  </a>
                  <Link href={`/${locale}/products`}
                    className="flex items-center justify-center gap-2 w-full bg-white text-[#1A2740] font-semibold py-3 px-6 rounded-full border border-[#F5EDE0] hover:border-[#D4972A] transition-all text-sm">
                    🛒 {locale === 'pt' ? 'Ver produtos' : '商品を見る'} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 aspect-square">
                {photos.map((num, i) => (
                  <a key={i} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                    className="relative bg-[#FAF7F2] rounded-lg overflow-hidden group aspect-square">
                    <Image src={`/instagram/${num}.webp`} alt={`Post ${num}`} fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 33vw, 150px" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Instagram className="h-5 w-5 text-white drop-shadow" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-12 bg-[#FAF7F2]">
        <div className="container-custom text-center">
          <h2 className="text-xl lg:text-3xl font-semibold text-[#1A2740] mb-4">
            {locale === 'pt' ? 'Quer experimentar?' : '食べてみませんか？'}
          </h2>
          <p className="text-[#57749A] mb-6 text-sm max-w-lg mx-auto">
            {locale === 'pt' ? 'Confira nosso catálogo completo.' : '商品カタログをご覧ください。'}
          </p>
          <Link href={`/${locale}/products`}
            className="inline-flex items-center gap-2 bg-[#D4972A] hover:bg-[#B87A20] text-white px-8 py-3 rounded-full font-semibold text-sm transition-all shadow-sm">
            🛒 {locale === 'pt' ? 'Ver Produtos' : '商品一覧を見る'}
          </Link>
        </div>
      </section>
    </div>
  );
}