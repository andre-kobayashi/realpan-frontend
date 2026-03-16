'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Phone, MapPin, Mail, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const locale = useLocale();
  const year = new Date().getFullYear();

  const shopLinks = [
    { href: '/products',  labelPt: 'Produtos',   labelJa: '商品一覧' },
    { href: '/feature',   labelPt: 'Diferencial', labelJa: 'こだわり' },
    { href: '/about',     labelPt: 'Sobre Nós',  labelJa: '会社案内' },
    { href: '/services',  labelPt: 'Serviços',   labelJa: 'サービス' },
    { href: '/news',      labelPt: 'Novidades',  labelJa: '新着情報' },
    { href: '/contact',   labelPt: 'Contato',    labelJa: 'お問い合わせ' },
  ];

  const legalLinks = [
    { href: '/tokutei',          labelPt: '特定商取引法',    labelJa: '特定商取引法' },
    { href: '/payment',          labelPt: 'Pagamentos',      labelJa: 'お支払い方法' },
    { href: '/shipping-policy',  labelPt: 'Entrega',         labelJa: '配送ポリシー' },
    { href: '/returns',          labelPt: 'Devoluções',      labelJa: '返品・交換' },
    { href: '/privacy',          labelPt: 'Privacidade',     labelJa: 'プライバシー' },
    { href: '/terms',            labelPt: 'Termos de Uso',   labelJa: '利用規約' },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* ── Gold accent line ── */}
      <div className="h-1 bg-gradient-to-r from-[#D4972A] via-[#ECC76E] to-[#D4972A]" />

      {/* ── Main Footer ── */}
      <div className="bg-[#111B2E]">
        <div className="container-custom py-10 lg:py-14">
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">

            {/* ── Col 1: Brand (spans 4) ── */}
            <div className="col-span-2 lg:col-span-4">
              <Link href={`/${locale}`} className="inline-block mb-5">
                <Image
                  src="/logo-light.svg"
                  alt="Real Pan"
                  width={160}
                  height={48}
                  className="h-11 w-auto object-contain brightness-200"
                />
              </Link>

              <p className="text-[#8099B8] text-sm leading-relaxed mb-5 max-w-[280px]">
                {locale === 'pt'
                  ? 'Pães brasileiros autênticos, feitos com carinho em Hamamatsu, Japão.'
                  : '浜松で心を込めて作る、本格ブラジルパン。'}
              </p>

              {/* Social */}
              <div className="flex gap-2">
                <a href="https://www.instagram.com/realpan_realsabor/" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#1A2740] flex items-center justify-center text-[#8099B8]
                             hover:bg-[#D4972A] hover:text-white transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://www.facebook.com/michiko.servi" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#1A2740] flex items-center justify-center text-[#8099B8]
                             hover:bg-[#D4972A] hover:text-white transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* ── Col 2: Shop (spans 2) ── */}
            <div className="col-span-1 lg:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4972A] mb-4">
                {locale === 'ja' ? 'ショップ' : 'Loja'}
              </p>
              <ul className="space-y-2">
                {shopLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={`/${locale}${link.href}`}
                      className="text-[13px] text-[#8099B8] hover:text-[#ECC76E] transition-colors">
                      {locale === 'pt' ? link.labelPt : link.labelJa}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 3: Legal (spans 2) ── */}
            <div className="col-span-1 lg:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4972A] mb-4">
                {locale === 'ja' ? 'ご利用案内' : 'Políticas'}
              </p>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={`/${locale}${link.href}`}
                      className="text-[13px] text-[#8099B8] hover:text-[#ECC76E] transition-colors">
                      {locale === 'pt' ? link.labelPt : link.labelJa}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 4: Contact (spans 4) ── */}
            <div className="col-span-2 lg:col-span-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4972A] mb-4">
                {locale === 'ja' ? 'お問い合わせ' : 'Contato'}
              </p>

              <p className="text-white font-semibold text-sm mb-3">株式会社リアルパン</p>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-[#1A2740] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-[#D4972A]" />
                  </div>
                  <span className="text-xs text-[#8099B8] leading-relaxed">
                    〒432-8068<br />
                    {locale === 'pt'
                      ? 'Hamamatsu-shi Chuo-ku Takatsuka-cho 1620'
                      : '静岡県浜松市中央区高塚町1620'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-[#D4972A] flex items-center justify-center flex-shrink-0">
                    <Phone className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <span className="text-base font-bold text-[#ECC76E]">053-570-2555</span>
                    <span className="block text-[10px] text-[#57749A]">
                      {locale === 'pt' ? 'Seg~Sex 10:00~17:00' : '平日10:00〜17:00'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-[#1A2740] flex items-center justify-center flex-shrink-0">
                    <Mail className="h-3.5 w-3.5 text-[#D4972A]" />
                  </div>
                  <span className="text-xs text-[#8099B8]">contato@realpan.jp</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-[#1A2740]">
          <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-[#57749A]">
              © {year} 株式会社リアルパン / Real Pan Co., Ltd.
            </p>
            <a
              href="https://sdsoluctions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#57749A] hover:text-[#ECC76E] transition-colors flex items-center gap-1"
            >
              dev. by SD Soluctions
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}