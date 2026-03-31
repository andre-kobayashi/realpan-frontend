'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Banner {
  id: string;
  titlePt: string;
  titleJa: string;
  subtitlePt: string;
  subtitleJa: string;
  ctaPt: string;
  ctaJa: string;
  linkUrl: string;
  imageUrl: string;
  position: number;
  active: boolean;
}

// Fallback static slides (used if API fails or no banners configured)
const FALLBACK_SLIDES = [
  { image: '/hero/hero-1.webp', titlePt: 'Sabor do Brasil,\nFeito no Japão', titleJa: '本場ブラジル伝統の味', subtitlePt: 'Pão de queijo artesanal congelado direto para sua casa', subtitleJa: '本場オリジナルの調理法、スタイルはそのまま。', ctaPt: 'Experimente Agora', ctaJa: '今すぐ試す', linkUrl: '' },
  { image: '/hero/hero-2.webp', titlePt: 'Presentes Premium', titleJa: 'プレミアムギフト', subtitlePt: 'Kits especiais para empresas e ocasiões especiais', subtitleJa: 'ご贈答用、お試し用に美味しさの詰め合わせをご用意いたしました。', ctaPt: 'Ver Presentes', ctaJa: 'キットを見る', linkUrl: '' },
  { image: '/hero/hero-3.webp', titlePt: 'Frescor Garantido', titleJa: 'できたての美味しさをお届けします', subtitlePt: 'Congelamento rápido preserva o sabor caseiro', subtitleJa: '鮮度を保つ急速冷凍。作り立ての美味しさをそのまま食卓に。', ctaPt: 'Saiba Mais', ctaJa: 'こだわりを見る', linkUrl: '' },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.realpan.jp';

export function HeroSection() {
  const locale = useLocale();
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState<Array<{
    image: string; titlePt: string; titleJa: string;
    subtitlePt: string; subtitleJa: string;
    ctaPt: string; ctaJa: string; linkUrl: string;
  }>>(FALLBACK_SLIDES);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_URL}/api/banners?active=true`);
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          const apiSlides = data.data.map((b: Banner) => ({
            image: b.imageUrl ? `${API_URL}${b.imageUrl}` : '',
            titlePt: b.titlePt, titleJa: b.titleJa,
            subtitlePt: b.subtitlePt, subtitleJa: b.subtitleJa,
            ctaPt: b.ctaPt, ctaJa: b.ctaJa,
            linkUrl: b.linkUrl,
          })).filter((s: any) => s.image);
          if (apiSlides.length > 0) setSlides(apiSlides);
        }
      } catch (e) {
        console.log('Using fallback banners');
      }
    };
    fetchBanners();
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[index] || slides[0];
  const title = locale === 'ja' ? current.titleJa : current.titlePt;
  const subtitle = locale === 'ja' ? current.subtitleJa : current.subtitlePt;
  const cta = locale === 'ja' ? current.ctaJa : current.ctaPt;
  const isExternal = current.image.startsWith('http');
  const linkHref = current.linkUrl || `/${locale}/products`;

  return (
    <section className="relative h-[44vh] min-h-[300px] lg:h-[55vh] lg:min-h-[420px] w-full overflow-hidden">

      {/* BACKGROUND IMAGES */}
      {slides.map((slide, i) => (
        isExternal || slide.image.startsWith('http') ? (
          <img
            key={slide.image + i}
            src={slide.image}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-out
              ${i === index ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
          />
        ) : (
          <Image
            key={slide.image + i}
            src={slide.image}
            alt=""
            fill
            priority={i === 0}
            className={`object-cover transition-all duration-[2000ms] ease-out
              ${i === index ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
          />
        )
      ))}

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full items-end lg:items-center">
        <div className="container-custom pb-10 lg:pb-0 text-white">
          <div key={index} className="max-w-2xl animate-fade-in">

            

            <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-3 lg:mb-6 leading-tight whitespace-pre-line text-white drop-shadow-lg">
              {title}
            </h1>

            <p className="mb-5 lg:mb-10 text-sm lg:text-xl text-white/85 leading-relaxed max-w-xl hidden sm:block">
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href={linkHref} className="bg-white text-[#1A2740] hover:bg-gray-100 text-sm px-5 py-2.5 lg:px-6 lg:py-3 rounded-full font-semibold transition-all shadow-lg">
                {cta} →
              </Link>
              <Link
                href={`/${locale}/about`}
                className="bg-[#D4972A] hover:bg-[#B87A20] text-white text-sm px-5 py-2.5 lg:px-6 lg:py-3 rounded-full font-semibold transition-all shadow-lg"
              >
                {locale === 'pt' ? 'Sobre nós' : '会社案内'}
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* SLIDER INDICATORS */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 lg:bottom-8 right-4 lg:left-1/2 lg:right-auto lg:-translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 lg:w-8 bg-accent-400' : 'w-1.5 lg:w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}

    </section>
  );
}
