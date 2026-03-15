'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
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
  const isPJ =
    typedCustomer?.type === 'BUSINESS' ||
    typedCustomer?.customerType === 'BUSINESS';

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20">
        <ShoppingCart className="h-20 w-20 text-gray-200 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('cart.empty')}</h1>
        <p className="text-gray-500 mb-6">{t('cart.empty_description')}</p>
        <Link href={`/${locale}/products`} className="btn-orange">
          {t('cart.continue_shopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-6 lg:py-10">
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{t('cart.title')}</h1>
            <p className="text-sm text-gray-500">{t('cart.items_count', { count: itemCount })}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-xl p-4 flex gap-4 shadow-sm">
                <Link href={`/${locale}/products/${item.slug}`} className="flex-shrink-0">
                  <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden bg-gray-50">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name[locale]}
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🍞</div>
                    )}
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/${locale}/products/${item.slug}`}>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-orange-600 transition-colors">
                      {item.name[locale]}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    ¥{item.unitPriceWithTax.toLocaleString()}
                    <span className="text-xs text-gray-400 font-normal ml-1">
                      ({isPJ ? t('tax_excluded') : t('tax_included')})
                    </span>
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold min-w-[2.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="text-sm text-gray-500">
                      = ¥{(item.unitPriceWithTax * item.quantity).toLocaleString()}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="ml-auto p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-5 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {locale === 'pt' ? 'Resumo do Pedido' : '注文概要'}
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('cart.subtotal')}</span>
                  <span className="font-medium">¥{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('cart.tax')}</span>
                  <span className="font-medium">¥{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>{t('cart.shipping')}</span>
                  <span>{locale === 'pt' ? 'Calcular no checkout' : 'チェックアウト時に計算'}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="text-base font-bold text-gray-900">{t('cart.total')}</span>
                  <span className="text-xl font-bold text-gray-900">¥{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isLoggedIn) {
                    router.push(`/${locale}/login?redirect=checkout`);
                  } else {
                    router.push(`/${locale}/checkout`);
                  }
                }}
                className="w-full mt-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-full font-semibold text-sm hover:shadow-lg active:scale-95 transition-all"
              >
                {t('cart.checkout')}
              </button>

              <Link
                href={`/${locale}/products`}
                className="block text-center mt-3 text-sm text-gray-500 hover:text-orange-600 transition-colors"
              >
                {t('cart.continue_shopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}