'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';

type CartCustomer = {
  type?: 'INDIVIDUAL' | 'BUSINESS';
  customerType?: 'INDIVIDUAL' | 'BUSINESS';
};

export default function CartClient() {
  const locale = useLocale() as 'pt' | 'ja';
  const t = useTranslations('products');
  const router = useRouter();
  const { items, itemCount, subtotal, tax, total, updateQuantity, removeItem } = useCart();
  const { customer } = useAuth();

  const typedCustomer = customer as CartCustomer | null;
  const isLoggedIn = !!typedCustomer;
  const isPJ = typedCustomer?.type === 'BUSINESS' || typedCustomer?.customerType === 'BUSINESS';

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20 bg-[#FAF7F2]">
        <ShoppingCart className="h-16 w-16 text-[#DFD0B3] mb-4" />
        <h1 className="text-xl font-semibold text-[#1A2740] mb-2">{t('cart.empty')}</h1>
        <p className="text-[#8099B8] text-sm mb-6">{t('cart.empty_description')}</p>
        <Link href={`/${locale}/products`}
          className="inline-flex items-center gap-2 bg-[#D4972A] hover:bg-[#B87A20] text-white px-6 py-3 rounded-full font-semibold text-sm transition-all">
          {t('cart.continue_shopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="container-custom py-5 lg:py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button type="button" onClick={() => router.back()}
            className="p-2 hover:bg-white rounded-lg transition-colors text-[#57749A]">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-[#1A2740]">{t('cart.title')}</h1>
            <p className="text-xs text-[#8099B8]">{t('cart.items_count', { count: itemCount })}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-xl p-4 flex gap-4 border border-[#F5EDE0]">
                <Link href={`/${locale}/products/${item.slug}`} className="flex-shrink-0">
                  <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden bg-[#FAF7F2]">
                    {item.image ? (
                      <Image src={item.image} alt={item.name[locale]} fill className="object-contain p-1" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🍞</div>
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/${locale}/products/${item.slug}`}>
                    <h3 className="text-sm font-medium text-[#1A2740] line-clamp-2 hover:text-[#D4972A] transition-colors">
                      {item.name[locale]}
                    </h3>
                  </Link>
                  <p className="text-base font-bold text-[#1A2740] mt-1">
                    ¥{item.unitPriceWithTax.toLocaleString()}
                    <span className="text-[10px] text-[#8099B8] font-normal ml-1">
                      ({isPJ ? t('tax_excluded') : t('tax_included')})
                    </span>
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border-2 border-[#ECC76E] rounded-xl overflow-hidden bg-white">
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-2.5 py-1.5 text-[#B87A20] hover:bg-[#FDF8ED] transition-colors">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-bold text-[#1A2740] min-w-[2.5rem] text-center tabular-nums">
                        {item.quantity}
                      </span>
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-2.5 py-1.5 text-[#B87A20] hover:bg-[#FDF8ED] transition-colors">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-sm text-[#8099B8] tabular-nums">
                      = ¥{(item.unitPriceWithTax * item.quantity).toLocaleString()}
                    </span>
                    <button type="button" onClick={() => removeItem(item.productId)}
                      className="ml-auto p-1.5 text-[#C9B896] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-5 border border-[#F5EDE0] sticky top-20">
              <h3 className="text-base font-semibold text-[#1A2740] mb-4">
                {locale === 'pt' ? '注文概要' : '注文概要'}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8099B8]">{t('cart.subtotal')}</span>
                  <span className="font-medium text-[#1A2740] tabular-nums">¥{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8099B8]">{t('cart.tax')}</span>
                  <span className="font-medium text-[#1A2740] tabular-nums">¥{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#C9B896]">
                  <span>{t('cart.shipping')}</span>
                  <span className="text-xs">{locale === 'pt' ? 'Calcular no checkout' : 'チェックアウト時に計算'}</span>
                </div>
                <div className="border-t border-[#F5EDE0] pt-3 flex justify-between">
                  <span className="text-base font-bold text-[#1A2740]">{t('cart.total')}</span>
                  <span className="text-xl font-bold text-[#1A2740] tabular-nums">¥{total.toLocaleString()}</span>
                </div>
              </div>

              <button type="button"
                onClick={() => {
                  if (!isLoggedIn) router.push(`/${locale}/login?redirect=checkout`);
                  else router.push(`/${locale}/checkout`);
                }}
                className="w-full mt-5 flex items-center justify-center gap-2 bg-[#D4972A] hover:bg-[#B87A20] text-white py-3.5 rounded-full font-semibold text-sm transition-all shadow-sm active:scale-[0.98]">
                {t('cart.checkout')}
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link href={`/${locale}/products`}
                className="block text-center mt-3 text-sm text-[#8099B8] hover:text-[#D4972A] transition-colors">
                {t('cart.continue_shopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}