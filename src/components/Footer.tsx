'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook } from 'lucide-react';

export function Footer() {
  const locale = useLocale();

  return (
    <footer className="bg-[#f8f9fb] text-[#1d417b]">
      <div className="container-custom py-14 lg:py-16">
        <div className="grid gap-14 lg:grid-cols-4 lg:gap-12">
          <div className="space-y-8">
            <Link href={`/${locale}`} className="flex items-center">
              <Image
                src="/logo-light.svg"
                alt="Realpan Logo"
                width={196}
                height={56}
                className="h-14 w-auto object-contain"
              />
            </Link>

            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/realpan_realsabor/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-[#1d417b]/20 flex items-center justify-center hover:border-[#f7931e] hover:bg-[#f7931e]/10 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/michiko.servi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-[#1d417b]/20 flex items-center justify-center hover:border-[#f7931e] hover:bg-[#f7931e]/10 transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#1d417b]/50">
              {locale === 'ja' ? 'ショップ' : 'Loja'}
            </p>
            <div className="flex flex-col gap-2.5 text-sm font-medium">
              <Link href={`/${locale}/products`} className="hover:text-[#f7931e] transition-colors">
                {locale === 'ja' ? '商品一覧' : 'Produtos'}
              </Link>
              <Link href={`/${locale}/about`} className="hover:text-[#f7931e] transition-colors">
                {locale === 'ja' ? '会社案内' : 'Sobre Nós'}
              </Link>
              <Link href={`/${locale}/services`} className="hover:text-[#f7931e] transition-colors">
                {locale === 'ja' ? 'サービス案内' : 'Serviços'}
              </Link>
              <Link href={`/${locale}/contact`} className="hover:text-[#f7931e] transition-colors">
                {locale === 'ja' ? 'お問い合わせ' : 'Contato'}
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#1d417b]/50">
              {locale === 'ja' ? 'ご利用について' : 'Políticas'}
            </p>
            <div className="flex flex-col gap-2.5 text-sm font-medium">
              <Link href={`/${locale}/tokutei`} className="hover:text-[#f7931e] transition-colors">
                {locale === 'ja' ? '特定商取引法に基づく表記' : 'Info do Vendedor'}
              </Link>
              <Link href={`/${locale}/payment`} className="hover:text-[#f7931e] transition-colors">
                {locale === 'ja' ? 'お支払い方法' : 'Pagamentos'}
              </Link>
              <Link href={`/${locale}/shipping-policy`} className="hover:text-[#f7931e] transition-colors">
                {locale === 'ja' ? '配送ポリシー' : 'Entrega'}
              </Link>
              <Link href={`/${locale}/returns`} className="hover:text-[#f7931e] transition-colors">
                {locale === 'ja' ? '返品・交換' : 'Devoluções'}
              </Link>
              <Link href={`/${locale}/privacy`} className="hover:text-[#f7931e] transition-colors">
                {locale === 'ja' ? 'プライバシーポリシー' : 'Privacidade'}
              </Link>
              <Link href={`/${locale}/terms`} className="hover:text-[#f7931e] transition-colors">
                {locale === 'ja' ? '利用規約' : 'Termos de Uso'}
              </Link>
            </div>
          </div>

          <div className="space-y-6 text-sm leading-relaxed text-[#1d417b]/80">
            <div>
              <p className="font-semibold text-[#1d417b]">リアルパン株式会社</p>
              <p>静岡県浜松市中央区高塚町1620</p>
            </div>
            <div>
              <p className="font-semibold text-[#1d417b]">お問い合わせ</p>
              <p className="text-base font-medium text-[#1d417b]">053-570-2555</p>
              <p>受付 ：平日10:00~17:00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1d417b]/10 bg-[#eef1f6]">
        <div className="container-custom py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#1d417b]/60">
              <Link href={`/${locale}/tokutei`} className="hover:text-[#1d417b] transition-colors">
                {locale === 'ja' ? '特商法表記' : 'Info Legal'}
              </Link>
              <span>|</span>
              <Link href={`/${locale}/terms`} className="hover:text-[#1d417b] transition-colors">
                {locale === 'ja' ? '利用規約' : 'Termos'}
              </Link>
              <span>|</span>
              <Link href={`/${locale}/privacy`} className="hover:text-[#1d417b] transition-colors">
                {locale === 'ja' ? 'プライバシー' : 'Privacidade'}
              </Link>
              <span>|</span>
              <Link href={`/${locale}/shipping-policy`} className="hover:text-[#1d417b] transition-colors">
                {locale === 'ja' ? '配送' : 'Entrega'}
              </Link>
            </div>
            <div className="text-[#1d417b]/50">
              Copyright © Realpan. All rights reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}