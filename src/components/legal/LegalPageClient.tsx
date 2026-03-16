'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Shield, CreditCard, Truck, RotateCcw, FileText, Store } from 'lucide-react';

type LegalPageType = 'tokutei' | 'privacy' | 'terms' | 'shipping' | 'returns' | 'payment';

interface Props {
  page: LegalPageType;
}

const PAGE_ICONS: Record<LegalPageType, React.ReactNode> = {
  tokutei:  <Store className="h-6 w-6" />,
  privacy:  <Shield className="h-6 w-6" />,
  terms:    <FileText className="h-6 w-6" />,
  shipping: <Truck className="h-6 w-6" />,
  returns:  <RotateCcw className="h-6 w-6" />,
  payment:  <CreditCard className="h-6 w-6" />,
};

// ══════════════════════════════════════════════════════════
// 特定商取引法 — Tabela obrigatória para Stripe Japan
// ══════════════════════════════════════════════════════════
function TokuteiPage({ t }: { t: (key: string) => string }) {
  const rows = [
    ['seller', 'seller_value'],
    ['representative', 'representative_value'],
    ['address', 'address_value'],
    ['phone', 'phone_value'],
    ['email', 'email_value'],
    ['url', 'url_value'],
    ['price', 'price_value'],
    ['additional_fees', 'additional_fees_value'],
    ['payment', 'payment_value'],
    ['payment_timing', 'payment_timing_value'],
    ['delivery', 'delivery_value'],
    ['return_policy', 'return_policy_value'],
    ['cancel_policy', 'cancel_policy_value'],
    ['operating_hours', 'operating_hours_value'],
    ['special_conditions', 'special_conditions_value'],
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <th className="px-5 py-4 text-left font-semibold text-gray-900 w-1/4 align-top border-b border-gray-100">
                {t(`tokutei.${label}`)}
              </th>
              <td className="px-5 py-4 text-gray-700 whitespace-pre-line border-b border-gray-100">
                {t(`tokutei.${value}`)}
                {label === 'phone' && (
                  <span className="block text-xs text-gray-400 mt-1">{t('tokutei.phone_note')}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// Seções genéricas (Privacy, Terms)
// ══════════════════════════════════════════════════════════
function SectionsPage({ t, page, count }: { t: (key: string) => string; page: string; count: number }) {
  return (
    <div className="space-y-8">
      <p className="text-gray-600 leading-relaxed">{t(`${page}.intro`)}</p>
      {Array.from({ length: count }, (_, i) => {
        const n = i + 1;
        return (
          <div key={n} className="border-b border-gray-100 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t(`${page}.section${n}_title`)}
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {t(`${page}.section${n}_content`)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// Shipping — Com tabelas de frete
// ══════════════════════════════════════════════════════════
function ShippingPage({ t, locale }: { t: (key: string) => string; locale: string }) {
  return (
    <div className="space-y-8">
      {/* Método */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('shipping.section1_title')}</h3>
        <p className="text-gray-700 leading-relaxed">{t('shipping.section1_content')}</p>
      </div>

      {/* Tabela de frete */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('shipping.section2_title')}</h3>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <tbody>
              <tr className="bg-white">
                <td className="px-4 py-3 font-medium text-gray-900 border-b border-gray-100">
                  {locale === 'ja' ? '通常配送（冷凍便）' : 'Entrega padrão (refrigerada)'}
                </td>
                <td className="px-4 py-3 text-gray-700 border-b border-gray-100 text-right font-semibold">
                  ¥800
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900 border-b border-gray-100">
                  {locale === 'ja' ? '速達配送（冷凍便）' : 'Entrega expressa (refrigerada)'}
                </td>
                <td className="px-4 py-3 text-gray-700 border-b border-gray-100 text-right font-semibold">
                  ¥1,200
                </td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {locale === 'ja' ? '送料無料条件' : 'Frete grátis'}
                </td>
                <td className="px-4 py-3 text-[#D4972A] text-right font-semibold">
                  ¥10,000+
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Prazo */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('shipping.section3_title')}</h3>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <tbody>
              <tr className="bg-white">
                <td className="px-4 py-3 font-medium text-gray-900 border-b border-gray-100">
                  {locale === 'ja' ? '通常配送' : 'Padrão'}
                </td>
                <td className="px-4 py-3 text-gray-700 border-b border-gray-100 text-right">
                  {locale === 'ja' ? '3〜5営業日' : '3-5 dias úteis'}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {locale === 'ja' ? '速達配送' : 'Expressa'}
                </td>
                <td className="px-4 py-3 text-gray-700 text-right">
                  {locale === 'ja' ? '翌日〜2営業日' : '1-2 dias úteis'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3 whitespace-pre-line">{t('shipping.section3_note')}</p>
      </div>

      {/* Área */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('shipping.section4_title')}</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{t('shipping.section4_content')}</p>
      </div>

      {/* Horário */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('shipping.section5_title')}</h3>
        <div className="flex flex-wrap gap-2">
          {['08:00–12:00', '14:00–16:00', '16:00–18:00', '18:00–20:00', '19:00–21:00'].map(time => (
            <span key={time} className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
              {time}
            </span>
          ))}
        </div>
      </div>

      {/* Atenção */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('shipping.section6_title')}</h3>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{t('shipping.section6_content')}</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// Returns — Lista de passos
// ══════════════════════════════════════════════════════════
function ReturnsPage({ t, locale }: { t: (key: string) => string; locale: string }) {
  const acceptedCases = locale === 'ja'
    ? ['商品に破損・汚損がある場合', '注文と異なる商品が届いた場合', '賞味期限切れの商品が届いた場合', '配送中の事故により品質が著しく劣化している場合']
    : ['Produto danificado ou com defeito', 'Produto diferente do pedido', 'Produto com validade expirada', 'Qualidade comprometida por acidente no transporte'];

  const steps = locale === 'ja'
    ? ['商品到着後3日以内に order@realpan.jp までご連絡ください', '不良箇所の写真をお送りください', '当社にて確認後、交換品の発送または返金処理を行います', '返品送料は当社が負担いたします']
    : ['Entre em contato em até 3 dias: order@realpan.jp', 'Envie fotos do problema', 'Após verificação, enviaremos substituição ou realizaremos reembolso', 'O frete de devolução é por nossa conta'];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('returns.section1_title')}</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{t('returns.section1_content')}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('returns.section2_title')}</h3>
        <ul className="space-y-2">
          {acceptedCases.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700">
              <span className="text-red-500 mt-0.5">✕</span> {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('returns.section3_title')}</h3>
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700">
              <span className="flex-shrink-0 w-7 h-7 bg-[#FDF8ED] text-[#D4972A] rounded-full flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('returns.section4_title')}</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{t('returns.section4_content')}</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('returns.section5_title')}</h3>
        <p className="text-gray-700 text-sm whitespace-pre-line">{t('returns.section5_content')}</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// Payment — Métodos de pagamento com ícones
// ══════════════════════════════════════════════════════════
function PaymentPage({ t, locale }: { t: (key: string) => string; locale: string }) {
  const konbiniStores = locale === 'ja'
    ? ['セブンイレブン', 'ローソン', 'ファミリーマート', 'ミニストップ']
    : ['7-Eleven', 'Lawson', 'FamilyMart', 'Ministop'];

  return (
    <div className="space-y-8">
      {/* Credit Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{t('payment.section1_title')}</h3>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">{t('payment.section1_content')}</p>
        <div className="flex flex-wrap gap-2">
          {['Visa', 'Mastercard', 'AMEX', 'JCB', 'Diners'].map(brand => (
            <span key={brand} className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-semibold text-gray-700 border border-gray-200">
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* PayPay */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-lg">
            💳
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{t('payment.section2_title')}</h3>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{t('payment.section2_content')}</p>
      </div>

      {/* Konbini */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-lg">
            🏪
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{t('payment.section3_title')}</h3>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">{t('payment.section3_content')}</p>
        <div className="flex flex-wrap gap-2">
          {konbiniStores.map(store => (
            <span key={store} className="px-3 py-1.5 bg-green-50 rounded-lg text-xs font-semibold text-green-700 border border-green-200">
              {store}
            </span>
          ))}
        </div>
      </div>

      {/* Bank Transfer */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-lg">
            🏦
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{t('payment.section4_title')}</h3>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{t('payment.section4_content')}</p>
      </div>

      {/* COD */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-lg">
            📦
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{t('payment.section5_title')}</h3>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{t('payment.section5_content')}</p>
      </div>

      {/* Security */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">{t('payment.security_title')}</h3>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{t('payment.security_content')}</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════
export default function LegalPageClient({ page }: Props) {
  const locale = useLocale() as 'pt' | 'ja';
  const t = useTranslations('legal');

  const allPages: { id: LegalPageType; path: string }[] = [
    { id: 'tokutei',  path: 'tokutei' },
    { id: 'privacy',  path: 'privacy' },
    { id: 'terms',    path: 'terms' },
    { id: 'shipping', path: 'shipping-policy' },
    { id: 'returns',  path: 'returns' },
    { id: 'payment',  path: 'payment' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">

          {/* Back */}
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#D4972A] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {locale === 'ja' ? 'トップページへ' : 'Voltar ao início'}
          </Link>

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 mb-6">
            <div className="flex items-center gap-3 text-[#D4972A] mb-2">
              {PAGE_ICONS[page]}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {t(`${page}.title`)}
              </h1>
            </div>
            <p className="text-gray-500">{t(`${page}.subtitle`)}</p>
            {(page === 'privacy' || page === 'terms') && (
              <p className="text-xs text-gray-400 mt-2">
                {t(`${page}.last_updated`)}: 2026-03-11
              </p>
            )}
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 mb-8">
            {page === 'tokutei'  && <TokuteiPage t={t} />}
            {page === 'privacy'  && <SectionsPage t={t} page="privacy" count={7} />}
            {page === 'terms'    && <SectionsPage t={t} page="terms" count={10} />}
            {page === 'shipping' && <ShippingPage t={t} locale={locale} />}
            {page === 'returns'  && <ReturnsPage t={t} locale={locale} />}
            {page === 'payment'  && <PaymentPage t={t} locale={locale} />}
          </div>

          {/* Navigation to other legal pages */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
              {locale === 'ja' ? 'その他のポリシー' : 'Outras políticas'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {allPages
                .filter(p => p.id !== page)
                .map(p => (
                  <Link
                    key={p.id}
                    href={`/${locale}/${p.path}`}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-[#FDF8ED] hover:text-[#D4972A] transition-colors"
                  >
                    {PAGE_ICONS[p.id]}
                    {t(`${p.id}.title`)}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
