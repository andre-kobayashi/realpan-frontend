'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const locale = useLocale() as 'pt' | 'ja';

  const currentYear = new Date().getFullYear();

  const shopLinks = [
    { href: '/products',      labelPt: 'Produtos',     labelJa: '商品一覧' },
    { href: '/products/sets', labelPt: 'Kits & Sets',  labelJa: 'セット商品' },
    { href: '/order-guide',   labelPt: 'Como Comprar', labelJa: 'ご利用ガイド' },
    { href: '/shipping',      labelPt: 'Frete',        labelJa: '送料について' },
  ];

  const companyLinks = [
    { href: '/about',     labelPt: 'Sobre Nós',          labelJa: '会社概要' },
    { href: '/kodawari',  labelPt: 'Nosso Compromisso',  labelJa: 'こだわり' },
    { href: '/services',  labelPt: 'Serviços',           labelJa: 'サービス案内' },
    { href: '/news',      labelPt: 'Notícias',           labelJa: 'お知らせ' },
    { href: '/contact',   labelPt: 'Contato',            labelJa: 'お問い合わせ' },
  ];

  const legalLinks = [
    { href: '/legal/tokutei',  labelPt: '特定商取引法',         labelJa: '特定商取引法に基づく表記' },
    { href: '/legal/privacy',  labelPt: 'Privacidade',          labelJa: 'プライバシーポリシー' },
    { href: '/legal/terms',    labelPt: 'Termos de Uso',        labelJa: '利用規約' },
    { href: '/legal/returns',  labelPt: 'Devoluções',           labelJa: '返品・交換について' },
    { href: '/legal/payments', labelPt: 'Métodos de Pagamento', labelJa: 'お支払い方法' },
  ];

  return (
    <footer className="bg-navy-800 text-cream-300">
      {/* ── Main grid ── */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Image
              src="/logo-white.png"
              alt="Real Pan"
              width={140}
              height={46}
              className="h-10 w-auto mb-4 brightness-200"
            />
            <p className="text-sm text-cream-400 leading-relaxed mb-4">
              {locale === 'pt'
                ? 'Pães brasileiros artesanais congelados, feitos no Japão com ingredientes selecionados.'
                : 'ブラジルの本格冷凍パン。厳選素材を使用し、日本で丁寧に焼き上げています。'}
            </p>

            {/* Contact info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-cream-400">
                <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                <span>053-570-2555</span>
              </div>
              <div className="flex items-center gap-2 text-cream-400">
                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                <span>info@realpan.co.jp</span>
              </div>
              <div className="flex items-start gap-2 text-cream-400">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">
                  〒432-8068<br />
                  {locale === 'pt'
                    ? 'Hamamatsu-shi Chuo-ku Takatsuka-cho 1620, Shizuoka'
                    : '静岡県浜松市中央区高塚町1620'}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="text-xs font-semibold text-cream-200 tracking-[0.15em] uppercase mb-4">
              {locale === 'pt' ? 'Loja' : 'ショップ'}
            </h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-sm text-cream-400 hover:text-bread-400 transition-colors"
                  >
                    {locale === 'pt' ? link.labelPt : link.labelJa}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-xs font-semibold text-cream-200 tracking-[0.15em] uppercase mb-4">
              {locale === 'pt' ? 'Empresa' : '企業情報'}
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-sm text-cream-400 hover:text-bread-400 transition-colors"
                  >
                    {locale === 'pt' ? link.labelPt : link.labelJa}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-xs font-semibold text-cream-200 tracking-[0.15em] uppercase mb-4">
              {locale === 'pt' ? 'Legal' : '法的情報'}
            </h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-sm text-cream-400 hover:text-bread-400 transition-colors"
                  >
                    {locale === 'pt' ? link.labelPt : link.labelJa}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-navy-700">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-cream-500">
            © {currentYear} 株式会社リアルパン / Real Pan Co., Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-cream-500">
            <span>🇧🇷 Made with love in Japan 🇯🇵</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
