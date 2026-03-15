'use client';

import { useLocale } from 'next-intl';
import { Instagram, ExternalLink, ArrowRight, Newspaper, Bell } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// ── Instagram post URLs (update these regularly) ──
const INSTAGRAM_POSTS = [
  'https://www.instagram.com/p/DFxYz1234/', // Replace with real post URLs
  'https://www.instagram.com/p/DGxYz5678/',
  'https://www.instagram.com/p/DHxYz9012/',
  'https://www.instagram.com/p/DIxYz3456/',
  'https://www.instagram.com/p/DJxYz7890/',
  'https://www.instagram.com/p/DKxYz1234/',
];

// ── Company news/announcements ──
const NEWS_ITEMS = {
  pt: [
    { date: '2026-03-01', title: 'Loja online inaugurada!', description: 'Agora você pode fazer pedidos diretamente pelo nosso site. Entrega para todo o Japão.', tag: 'Novo', tagColor: 'bg-orange-500', link: '' },
    { date: '2026-03-02', title: '🧑‍🍳 Estamos contratando!', description: 'A Real Pan está expandindo e procura profissionais com experiência comprovada no ramo de padaria. Se você tem 5+ anos de experiência e mora no Japão, venha fazer parte do nosso time!', tag: 'Vagas', tagColor: 'bg-red-500', link: '/careers' },
    { date: '2026-01-20', title: 'Atendimento para empresas', description: 'Criamos uma área exclusiva para clientes corporativos com preços diferenciados e faturamento mensal.', tag: 'B2B', tagColor: 'bg-blue-500', link: '' },
  ],
  ja: [
    { date: '2026-03-01', title: 'オンラインショップオープン！', description: '当サイトから直接ご注文いただけるようになりました。日本全国へ配送いたします。', tag: '新着', tagColor: 'bg-orange-500', link: '' },
    { date: '2026-03-02', title: '🧑‍🍳 スタッフ募集中！', description: 'リアルパンは事業拡大に伴い、パン製造の経験者を募集しています。5年以上の実務経験をお持ちで日本在住の方、ぜひ私たちのチームにご参加ください！', tag: '採用', tagColor: 'bg-red-500', link: '/careers' },
    { date: '2026-01-20', title: '法人向けサービス開始', description: '法人のお客様専用エリアを開設しました。特別価格と月次請求でご利用いただけます。', tag: 'B2B', tagColor: 'bg-blue-500', link: '' },
  ],
};

const INSTAGRAM_HANDLE = '@realpan_realsabor';
const INSTAGRAM_URL = 'https://www.instagram.com/realpan_realsabor/';

// ── Instagram Embed Component ──
function InstagramEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load Instagram embed script
    if (typeof window !== 'undefined' && !(window as any).instgrm) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => {
        (window as any).instgrm?.Embeds?.process();
        setLoaded(true);
      };
      document.body.appendChild(script);
    } else if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
      setLoaded(true);
    }
  }, [url]);

  return (
    <div ref={containerRef} className="instagram-embed-container">
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: '#FFF',
          border: 0,
          borderRadius: '12px',
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)',
          margin: '0',
          maxWidth: '100%',
          minWidth: '280px',
          padding: 0,
          width: '100%',
        }}
      />
    </div>
  );
}

const TOTAL_INSTAGRAM_PHOTOS = 32;

export default function NewsPage() {
  const locale = useLocale() as 'pt' | 'ja';
  const news = NEWS_ITEMS[locale];

  // Randomize 9 photos from pool of 32 on each render
  const [photos, setPhotos] = useState<number[]>([]);
  useEffect(() => {
    const shuffled = Array.from({ length: TOTAL_INSTAGRAM_PHOTOS }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5)
      .slice(0, 9);
    setPhotos(shuffled);
  }, []);

  return (
    <div className="flex flex-col bg-white">

      {/* ═══════ HERO ═══════ */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 lg:py-28 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-orange-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500 rounded-full blur-[120px]" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6">
              <Bell className="h-4 w-4 text-orange-400" />
              <span>{locale === 'pt' ? 'Novidades & Instagram' : '新着情報 & Instagram'}</span>
            </div>

            <h1 className="font-abril text-4xl lg:text-6xl mb-6 tracking-wide">
              {locale === 'pt' ? 'Novidades' : '新着情報'}
            </h1>

            <p className="text-white/70 text-lg max-w-xl mx-auto">
              {locale === 'pt'
                ? 'Acompanhe as últimas novidades da Real Pan e nosso dia a dia pelo Instagram.'
                : 'リアルパンの最新情報とInstagramでの日常をお届けします。'}
            </p>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full"><path d="M0 40C360 80 720 0 1080 40C1260 60 1380 50 1440 40V80H0V40Z" fill="#FAF7F2" /></svg>
        </div>
      </section>

      {/* ═══════ NEWS / ANNOUNCEMENTS ═══════ */}
      <section className="py-16 lg:py-20 bg-[#FAF7F2]">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-10">
            <Newspaper className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {locale === 'pt' ? 'Últimas Notícias' : 'お知らせ'}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {news.map((item, i) => {
              const CardWrapper = item.link ? Link : 'div' as any;
              const cardProps = item.link ? { href: `/${locale}${item.link}` } : {};
              return (
                <CardWrapper key={i} {...cardProps}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group block">
                  <div className={`h-1.5 ${item.tagColor}`} />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`${item.tagColor} text-white text-xs font-bold px-2.5 py-0.5 rounded-full`}>{item.tag}</span>
                      <time className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'pt-BR')}</time>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    {item.link && (
                      <p className="mt-3 text-sm font-semibold text-orange-600 flex items-center gap-1">
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

      {/* ═══════ INSTAGRAM SECTION ═══════ */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-custom">
          {/* Instagram header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 rounded-xl">
                <div className="bg-white rounded-[10px] p-2">
                  <Instagram className="h-6 w-6 text-pink-600" />
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Instagram</h2>
            </div>

            <p className="text-gray-600 mb-2">
              {locale === 'pt'
                ? 'Acompanhe nosso dia a dia, novos produtos e bastidores da fábrica!'
                : '工場の日常、新商品情報、製造の裏側をお届けしています！'}
            </p>

            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold text-sm transition-colors">
              <Instagram className="h-4 w-4" />
              {INSTAGRAM_HANDLE}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Instagram Grid - Using embed or fallback */}
          <div className="max-w-4xl mx-auto">
            {/* Option 1: Direct iframe embed of profile (works without API token) */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-6 lg:p-10 border border-pink-100">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: Profile info + CTA */}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-1 rounded-full">
                      <div className="bg-white rounded-full p-1">
                        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
                          🍞
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">realpan_realsabor</p>
                      <p className="text-sm text-gray-500">REAL PAN / リアルパン</p>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    {locale === 'pt'
                      ? '🇧🇷 Pães brasileiros autênticos feitos no Japão 🇯🇵\n\n焼きたてのおいしさをお届け！ブラジルの本格パン工場\n\n📍 Hamamatsu, Shizuoka'
                      : '🇧🇷 日本で作る本格ブラジルパン 🇯🇵\n\n焼きたてのおいしさをお届け！\n\n📍 静岡県浜松市'}
                  </p>

                  <div className="space-y-3">
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-bold py-3 px-6 rounded-full hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200">
                      <Instagram className="h-5 w-5" />
                      {locale === 'pt' ? 'Seguir no Instagram' : 'Instagramをフォロー'}
                    </a>

                    <Link href={`/${locale}/products`}
                      className="flex items-center justify-center gap-2 w-full bg-white text-gray-900 font-semibold py-3 px-6 rounded-full border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all">
                      {locale === 'pt' ? '🛒 Ver produtos' : '🛒 商品を見る'}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Right: Instagram preview grid */}
                <div className="grid grid-cols-3 gap-2 aspect-square">
                  {photos.map((num, i) => (
                    <a key={i} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                      className="relative bg-gray-100 rounded-lg overflow-hidden group aspect-square">
                      <Image
                        src={`/instagram/${num}.webp`}
                        alt={`Instagram post ${num}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 33vw, 150px"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Instagram className="h-5 w-5 text-white drop-shadow" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <p className="text-center text-xs text-gray-400 mt-6">
                {locale === 'pt'
                  ? '※ Siga nosso Instagram para ver as fotos reais dos nossos produtos e bastidores!'
                  : '※ Instagramをフォローして、商品の写真や工場の裏側をご覧ください！'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-14 bg-[#FAF7F2]">
        <div className="container-custom text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-orange-300" />
            <div className="h-2 w-2 rounded-full bg-orange-400" />
            <div className="h-px w-12 bg-orange-300" />
          </div>
          <h2 className="font-abril text-2xl lg:text-4xl text-gray-900 mb-4">
            {locale === 'pt' ? 'Quer experimentar?' : '食べてみませんか？'}
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            {locale === 'pt'
              ? 'Confira nosso catálogo completo e faça seu pedido online.'
              : '商品カタログをご覧いただき、オンラインでご注文ください。'}
          </p>
          <Link href={`/${locale}/products`} className="btn-orange text-base">
            {locale === 'pt' ? '🛒 Ver Produtos' : '🛒 商品一覧を見る'}
          </Link>
        </div>
      </section>
    </div>
  );
}