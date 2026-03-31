'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Loader2, Instagram, ExternalLink } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  titlePt: string;
  titleJa: string;
  summaryPt: string;
  summaryJa: string;
  imageUrl: string;
  category: string;
  formType: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.realpan.jp';
const INSTAGRAM_HANDLE = '@realpan_realsabor';
const INSTAGRAM_URL = 'https://www.instagram.com/realpan_realsabor/';
const TOTAL_INSTAGRAM_PHOTOS = 32;

const CATEGORY_STYLES: Record<string, { labelPt: string; labelJa: string; color: string; border: string }> = {
  news:    { labelPt: 'Novo',    labelJa: 'ニュース', color: 'bg-amber-100 text-amber-700', border: 'border-t-amber-400' },
  hiring:  { labelPt: 'Vagas',   labelJa: '採用',     color: 'bg-red-100 text-red-700',     border: 'border-t-red-400' },
  b2b:     { labelPt: 'B2B',     labelJa: 'B2B',      color: 'bg-gray-800 text-white',      border: 'border-t-gray-800' },
  product: { labelPt: 'Produto', labelJa: '商品',     color: 'bg-green-100 text-green-700', border: 'border-t-green-400' },
  event:   { labelPt: 'Evento',  labelJa: 'イベント', color: 'bg-purple-100 text-purple-700', border: 'border-t-purple-400' },
};

export default function BlogListPage() {
  const locale = useLocale() as 'pt' | 'ja';
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<number[]>([]);

  useEffect(() => {
    const shuffled = Array.from({ length: TOTAL_INSTAGRAM_PHOTOS }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5).slice(0, 9);
    setPhotos(shuffled);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/blog?published=true`);
        const data = await res.json();
        if (data.success) setPosts(data.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const t = locale === 'pt'
    ? { title: 'Notícias', subtitle: 'Fique por dentro das novidades da Real Pan', empty: 'Nenhuma publicação ainda' }
    : { title: 'お知らせ', subtitle: 'リアルパンの最新情報', empty: 'まだ記事がありません' };

  if (loading) return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#D4972A]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <section className="bg-[#1A2740] py-12 sm:py-16">
        <div className="container-custom text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{t.title}</h1>
          <p className="text-[#8099B8] text-sm sm:text-base">{t.subtitle}</p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-10 sm:py-14">
        <div className="container-custom">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#57749A]">{t.empty}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => {
                const cat = CATEGORY_STYLES[post.category] || CATEGORY_STYLES.news;
                const title = locale === 'pt' ? post.titlePt : post.titleJa;
                const summary = locale === 'pt' ? post.summaryPt : post.summaryJa;
                const date = post.publishedAt || post.createdAt;
                return (
                  <Link key={post.id} href={`/${locale}/blog/${post.slug}`}
                    className={`bg-white rounded-2xl border border-[#F5EDE0] overflow-hidden shadow-sm hover:shadow-lg transition-all group border-t-4 ${cat.border}`}>
                    {post.imageUrl ? (
                      <div className="relative aspect-[1200/630] bg-gray-100">
                        <img src={`${API_URL}${post.imageUrl}`} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : null}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${cat.color}`}>
                          {locale === 'pt' ? cat.labelPt : cat.labelJa}
                        </span>
                        <span className="text-xs text-[#8099B8] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(date).toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'ja-JP')}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-[#1A2740] mb-2 group-hover:text-[#D4972A] transition-colors line-clamp-2">
                        {title}
                      </h2>
                      {summary && (
                        <p className="text-sm text-[#57749A] line-clamp-2 mb-3">{summary}</p>
                      )}
                      {post.formType && (
                        <span className="text-xs text-[#D4972A] font-medium">
                          📋 {locale === 'pt' ? 'Inclui formulário' : 'フォームあり'}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Instagram */}
      <section className="py-12 lg:py-16 bg-[#FAF7F2]">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-2 rounded-xl">
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
                      <div className="w-14 h-14 rounded-full bg-[#FDF8ED] flex items-center justify-center text-2xl">\ud83c\udf5e</div>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-[#1A2740]">realpan_realsabor</p>
                    <p className="text-sm text-[#8099B8]">REAL PAN / \u30ea\u30a2\u30eb\u30d1\u30f3</p>
                  </div>
                </div>
                <p className="text-[#57749A] text-sm leading-relaxed mb-6 whitespace-pre-line">
                  {locale === 'pt'
                    ? '\ud83c\udde7\ud83c\uddf7 P\u00e3es brasileiros aut\u00eanticos feitos no Jap\u00e3o \ud83c\uddef\ud83c\uddf5\n\ud83d\udccd Hamamatsu, Shizuoka'
                    : '\ud83c\udde7\ud83c\uddf7 \u65e5\u672c\u3067\u4f5c\u308b\u672c\u683c\u30d6\u30e9\u30b8\u30eb\u30d1\u30f3 \ud83c\uddef\ud83c\uddf5\n\ud83d\udccd \u9759\u5ca1\u770c\u6d5c\u677e\u5e02'}
                </p>
                <div className="space-y-3">
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-bold py-3 px-6 rounded-full hover:shadow-lg transition-all text-sm">
                    <Instagram className="h-4 w-4" />
                    {locale === 'pt' ? 'Seguir no Instagram' : 'Instagram\u3092\u30d5\u30a9\u30ed\u30fc'}
                  </a>
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
    </div>
  );
}
