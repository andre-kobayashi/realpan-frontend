'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/catalog/ProductCard';
import { loadAllProducts } from '@/lib/catalog-loader';
import type { Product } from '@/types/product';

export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const heroSlides = [
    { image: '/images/hero-pao-de-queijo.webp', title: t('hero.slide1.title'), subtitle: t('hero.slide1.subtitle') },
    { image: '/images/hero-presentes.webp', title: t('hero.slide2.title'), subtitle: t('hero.slide2.subtitle') },
    { image: '/images/hero-qualidade.webp', title: t('hero.slide3.title'), subtitle: t('hero.slide3.subtitle') },
  ];

  // Carregar produtos em destaque
  useEffect(() => {
    async function loadFeatured() {
      setLoading(true);
      try {
        const allProducts = await loadAllProducts();
        
        // Filtrar apenas pães
        const breads = allProducts.filter(p => p.category === 'breads');
        
        // Pegar os 8 primeiros ou produtos marcados como bestseller
        const featured = breads
          .filter(p => p.isBestseller || p.isNew)
          .slice(0, 8);
        
        // Se não tiver bestsellers, pegar os 8 primeiros
        if (featured.length < 8) {
          setFeaturedProducts(breads.slice(0, 8));
        } else {
          setFeaturedProducts(featured);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadFeatured();
  }, []);

  const handleContact = (productName: string) => {
    window.location.href = `/${locale}/contact?product=${encodeURIComponent(productName)}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      
      {/* Top Banner - Laranja 
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 text-center text-sm sticky top-0 z-50">
       <div className="flex items-center justify-center gap-2">
           <span>🎉</span>
        <span className="font-medium">{locale === 'ja' ? '¥5,000以上のご注文で送料無料' : 'Frete grátis acima de ¥5.000'}</span>
        <ArrowRight className="w-4 h-4" />
      </div>
     </div>
*/}
      {/* Hero Slider - MINIMALISTA */}
      <section className="relative bg-white">
        <div className="relative h-[400px] md:h-[600px] overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              
              {/* Overlay suave */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
              
              {/* Text - Centro */}
              <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                <div className="max-w-2xl text-white">
                  <h1 className="text-3xl md:text-6xl font-light mb-4 tracking-wide leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 font-light">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Controls - Minimalistas */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentSlide ? 'w-8 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tagline - Clean */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-2xl md:text-4xl font-light text-gray-900 mb-6 leading-relaxed">
            {t('tagline.title')}
          </h2>
          <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed">
            {t('tagline.description')}
          </p>
        </div>
      </section>

      {/* ═══════ PRODUTOS EM DESTAQUE ═══════ */}
      <section className="py-16 md:py-20 bg-[#FAF7F2]">
        <div className="container-custom">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-abril text-3xl md:text-4xl text-gray-900 mb-2">
                {locale === 'ja' ? '人気のパン' : 'Pães Populares'}
              </h2>
              <p className="text-gray-600">
                {locale === 'ja' 
                  ? '厳選された人気商品をご紹介します' 
                  : 'Seleção dos nossos pães mais vendidos'}
              </p>
            </div>
            <Link 
              href={`/${locale}/products`}
              className="hidden md:inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold group"
            >
              {locale === 'ja' ? 'すべて見る' : 'Ver todos'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid de Produtos */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500 mb-4" />
                <p className="text-gray-500">
                  {locale === 'ja' ? '読み込み中...' : 'Carregando...'}
                </p>
              </div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onContact={handleContact}
                  />
                ))}
              </div>

              {/* Ver Todos - Mobile */}
              <div className="mt-10 text-center md:hidden">
                <Link 
                  href={`/${locale}/products`}
                  className="inline-flex items-center gap-2 btn-orange text-base"
                >
                  {locale === 'ja' ? 'すべての商品を見る' : 'Ver Todos os Produtos'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500">
                {locale === 'ja' ? '商品がありません' : 'Nenhum produto disponível'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ CTA SET INICIAL - COMENTADO ═══════ */}
      {/* 
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 md:p-12 text-center border border-orange-200">
            <div className="inline-block bg-orange-500 text-white px-4 py-1 rounded-full text-sm mb-6">
              {locale === 'ja' ? 'はじめてパンセット' : 'Primeiro Pedido'}
            </div>
            <h3 className="text-2xl md:text-4xl font-light text-gray-900 mb-4">
              {locale === 'ja' ? '人気のパン全8種類（全23個入）' : '8 variedades (23 pães)'}
            </h3>
            <p className="text-base text-gray-700 mb-8">
              {locale === 'ja' 
                ? '通常送料込み ¥3,851相当が初回限定 ¥2,980（税込・送料無料）' 
                : 'De ¥3.851 por ¥2.980 (c/ frete grátis)'}
            </p>
            <Link
              href={`/${locale}/products/bread-set`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-full font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
            >
              {locale === 'ja' ? 'はじめてパンセットをお試しする' : 'Experimentar o Set'}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
      */}

      {/* About - Grid 2 colunas */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src="/about/process.webp"
                alt="Processo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-abril text-2xl md:text-4xl text-gray-900 mb-6">
                {locale === 'ja' ? '新鮮なパンのおいしさをご家庭で' : 'Pão fresco em casa'}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                {locale === 'ja'
                  ? '素材と製法にこだわった上質なパンを、冷凍庫にストックできる安心感。焼きたての鮮度をそのまま閉じ込めて直送するから、ひとくち食べれば外はカリッと、中はふんわり。'
                  : 'Pães premium com ingredientes selecionados, congelados para preservar a frescura. Assados no forno, ficam crocantes por fora e macios por dentro.'}
              </p>
              <Link
                href={`/${locale}/feature`}
                className="inline-flex items-center gap-2 btn-orange-outline"
              >
                {locale === 'ja' ? 'こだわりを見る' : 'Nosso Compromisso'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}