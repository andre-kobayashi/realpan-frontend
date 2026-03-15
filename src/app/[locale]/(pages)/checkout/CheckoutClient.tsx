'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, MapPin, Truck, CreditCard, ShoppingCart,
  Check, Loader2, Clock, AlertTriangle, Banknote,
  Calendar, ChevronLeft, ChevronRight, FileText
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// ── Types ──
type Address = {
  id?: string;
  name: string;
  postalCode: string;
  prefecture: string;
  city: string;
  ward: string;
  address: string;
  building?: string;
  phone: string;
};

type ShippingOption = {
  carrierId: string;
  carrierName: string;
  carrierNamePt: string;
  regionName: string;
  price: number;
  estimatedDays: number;
  estimatedDate: string;
  extraDays: number;
  extraDaysNote: string;
  cutoffTime: string;
  timeSlots: { label: string; start: string; end: string }[];
};

type PaymentMethodOption = 'STRIPE' | 'DAIBIKI' | 'KONBINI' | 'BANK_TRANSFER' | 'PAYPAY' | 'INVOICE';
type Step = 'address' | 'shipping' | 'payment' | 'confirm';

type CheckoutCustomer = {
  id: string;
  firstName?: string;
  lastName?: string;
  type?: 'INDIVIDUAL' | 'BUSINESS';
  customerType?: 'INDIVIDUAL' | 'BUSINESS';
  businessStatus?: string;
};

type WeightedCartItem = {
  quantity: number;
  weightGrams?: number;
};

type SavedAddressResponseItem = {
  isDefault?: boolean;
  recipientName?: string;
  postalCode?: string;
  prefecture?: string;
  city?: string;
  ward?: string;
  streetAddress?: string;
  address?: string;
  building?: string;
  addressLine2?: string;
  phone?: string;
};

type ApiErrorLike = {
  message?: string;
};

// ── Date helpers ──
const JP_WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const PT_WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function formatDateJP(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dow = JP_WEEKDAYS[date.getDay()];
  return `${m}月${d}日（${dow}）`;
}

function formatDatePT(date: Date): string {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  const dow = PT_WEEKDAYS[date.getDay()];
  return `${d}/${m}/${y} (${dow})`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function parseEstimatedDate(dateStr: string): Date {
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return new Date(dateStr + 'T00:00:00');
  }

  const match = dateStr.match(/(\d{1,2})月(\d{1,2})日/);
  if (match) {
    const now = new Date();
    const month = parseInt(match[1], 10) - 1;
    const day = parseInt(match[2], 10);
    const year = now.getFullYear();
    const d = new Date(year, month, day);
    if (d < now) d.setFullYear(year + 1);
    return d;
  }

  const fallback = new Date();
  fallback.setDate(fallback.getDate() + 3);
  return fallback;
}

// ═══════════════════════════════════════════════════════════
// DELIVERY DATE PICKER
// ═══════════════════════════════════════════════════════════
function DeliveryDatePicker({
  minDate,
  maxDate,
  selectedDate,
  onSelect,
  locale,
}: {
  minDate: Date;
  maxDate: Date;
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
  locale: 'pt' | 'ja';
}) {
  const [viewMonth, setViewMonth] = useState(() => new Date(minDate.getFullYear(), minDate.getMonth(), 1));

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const daysInMonth = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= lastDate; d++) days.push(new Date(year, month, d));
    return days;
  }, [viewMonth]);

  const canGoPrev =
    viewMonth.getFullYear() > minDate.getFullYear() ||
    (viewMonth.getFullYear() === minDate.getFullYear() && viewMonth.getMonth() > minDate.getMonth());

  const canGoNext =
    viewMonth.getFullYear() < maxDate.getFullYear() ||
    (viewMonth.getFullYear() === maxDate.getFullYear() && viewMonth.getMonth() < maxDate.getMonth());

  const isSelectable = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const min = new Date(minDate);
    min.setHours(0, 0, 0, 0);
    const max = new Date(maxDate);
    max.setHours(0, 0, 0, 0);
    return d >= min && d <= max;
  };

  const weekdayLabels = locale === 'ja' ? JP_WEEKDAYS : PT_WEEKDAYS;

  const monthLabel =
    locale === 'ja'
      ? `${viewMonth.getFullYear()}年${viewMonth.getMonth() + 1}月`
      : `${viewMonth.toLocaleString('pt-BR', { month: 'long' })} ${viewMonth.getFullYear()}`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
          disabled={!canGoPrev}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
        <span className="text-sm font-bold text-gray-900">{monthLabel}</span>
        <button
          type="button"
          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
          disabled={!canGoNext}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdayLabels.map((label, i) => (
          <div
            key={label}
            className={`text-center text-xs font-medium py-1 ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} className="h-9" />;
          }

          const selectable = isSelectable(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const isMinDate = isSameDay(date, minDate);
          const dayOfWeek = date.getDay();
          const isSunday = dayOfWeek === 0;
          const isSaturday = dayOfWeek === 6;

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => selectable && onSelect(date)}
              disabled={!selectable}
              className={`
                h-9 rounded-lg text-sm font-medium transition-all relative
                ${isSelected
                  ? 'bg-orange-500 text-white shadow-sm'
                  : selectable
                    ? `hover:bg-orange-50 hover:text-orange-600 ${
                        isMinDate
                          ? 'bg-green-50 text-green-700 ring-1 ring-green-300'
                          : isSunday
                          ? 'text-red-500'
                          : isSaturday
                          ? 'text-blue-500'
                          : 'text-gray-700'
                      }`
                    : 'text-gray-300 cursor-not-allowed'
                }
                ${isToday && !isSelected ? 'ring-1 ring-orange-300' : ''}
              `}
            >
              {date.getDate()}
              {isMinDate && !isSelected && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-500" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-50 ring-1 ring-green-300 inline-block" />
          {locale === 'ja' ? '最短日' : 'Data mais cedo'}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-orange-500 inline-block" />
          {locale === 'ja' ? '選択中' : 'Selecionado'}
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// STRIPE PAYMENT FORM
// ═══════════════════════════════════════════════════════════
function StripePaymentForm({
  orderId,
  orderNumber,
  total,
  locale,
  onSuccess,
  onError,
}: {
  orderId: string;
  orderNumber: string;
  total: number;
  locale: 'pt' | 'ja';
  onSuccess: (orderId: string, orderNumber: string) => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [ready, setReady] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${locale}/checkout/complete?order=${orderId}`,
      },
      redirect: 'if_required',
    });

    if (result.error) {
      onError(result.error.message || 'Payment failed');
      setProcessing(false);
    } else if (result.paymentIntent?.status === 'succeeded') {
      onSuccess(orderId, orderNumber);
    } else {
      onSuccess(orderId, orderNumber);
    }
  };

  return (
    <div className="space-y-4">
      <PaymentElement
        onReady={() => setReady(true)}
        options={{
          layout: 'tabs',
          paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
        }}
      />
      {ready && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={processing || !stripe}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-bold hover:shadow-lg active:scale-95 disabled:opacity-60 transition-all"
        >
          {processing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> {locale === 'ja' ? '処理中...' : 'Processando...'}
            </>
          ) : (
            <>
              {locale === 'ja' ? 'お支払い' : 'Pagar'} ¥{total.toLocaleString()}
            </>
          )}
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN CHECKOUT COMPONENT
// ═══════════════════════════════════════════════════════════
export default function CheckoutClient() {
  const locale = useLocale() as 'pt' | 'ja';
  const router = useRouter();
  const { items, itemCount, subtotal, tax, total, clearCart } = useCart();
  const { customer, loading: authLoading } = useAuth();

  const typedCustomer = customer as CheckoutCustomer | null;
  const isLoggedIn = !!typedCustomer;
  const isPJ =
    typedCustomer?.type === 'BUSINESS' ||
    typedCustomer?.customerType === 'BUSINESS';

  const [step, setStep] = useState<Step>('address');
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const [address, setAddress] = useState<Address>({
    name: '',
    postalCode: '',
    prefecture: '',
    city: '',
    ward: '',
    address: '',
    building: '',
    phone: '',
  });

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState('');
  const [selectedCarrierId, setSelectedCarrierId] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<Date | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodOption>('STRIPE');
  const [notes, setNotes] = useState('');

  const selectedShipping = shippingOptions.find((o) => o.carrierId === selectedCarrierId);
  const shippingCost = selectedShipping?.price || 0;

  const [daibikiFeeData, setDaibikiFeeData] = useState<{ fee: number; tax: number; total: number; available: boolean }>({
    fee: 0,
    tax: 0,
    total: 0,
    available: true,
  });
  const [daibikiLoading, setDaibikiLoading] = useState(false);

  const daibikiFee = paymentMethod === 'DAIBIKI' ? daibikiFeeData.total : 0;
  const grandTotal = total + shippingCost + daibikiFee;

  useEffect(() => {
    if (paymentMethod !== 'DAIBIKI' || !selectedCarrierId) {
      setDaibikiFeeData({ fee: 0, tax: 0, total: 0, available: true });
      return;
    }

    const orderAmount = total + shippingCost;
    if (orderAmount <= 0) return;

    setDaibikiLoading(true);
    api.post('/api/payments/daibiki-fee', { carrierId: selectedCarrierId, orderAmount })
      .then(({ data }) => {
        if (data.success) {
          setDaibikiFeeData(data.data);
        }
      })
      .catch(() => {
        setDaibikiFeeData({ fee: 300, tax: 30, total: 330, available: true });
      })
      .finally(() => setDaibikiLoading(false));
  }, [paymentMethod, selectedCarrierId, total, shippingCost]);

  const totalWeightGrams = items.reduce((sum, item) => {
    const weightedItem = item as WeightedCartItem;
    return sum + (weightedItem.weightGrams || 500) * item.quantity;
  }, 0);

  const deliveryDateRange = useMemo(() => {
    if (!selectedShipping?.estimatedDate) return null;
    const minDate = parseEstimatedDate(selectedShipping.estimatedDate);
    minDate.setHours(0, 0, 0, 0);
    const maxDate = new Date(minDate);
    maxDate.setDate(maxDate.getDate() + 14);
    return { minDate, maxDate };
  }, [selectedShipping?.estimatedDate]);

  useEffect(() => {
    if (deliveryDateRange) {
      setSelectedDeliveryDate(deliveryDateRange.minDate);
    } else {
      setSelectedDeliveryDate(null);
    }
  }, [selectedCarrierId, deliveryDateRange]);

  const formattedDeliveryDate = useMemo(() => {
    if (!selectedDeliveryDate) return '';
    return locale === 'ja' ? formatDateJP(selectedDeliveryDate) : formatDatePT(selectedDeliveryDate);
  }, [selectedDeliveryDate, locale]);

  const deliveryDateISO = useMemo(() => {
    if (!selectedDeliveryDate) return null;
    const y = selectedDeliveryDate.getFullYear();
    const m = (selectedDeliveryDate.getMonth() + 1).toString().padStart(2, '0');
    const d = selectedDeliveryDate.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [selectedDeliveryDate]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data } = await api.get('/api/payments/config');
        if (data.success && data.data?.publishableKey) {
          setStripePromise(loadStripe(data.data.publishableKey));
        }
      } catch (err) {
        console.error('Failed to load Stripe config:', err);
      }
    };
    loadConfig();
  }, []);

  useEffect(() => {
    if (items.length === 0 && !orderComplete) router.replace(`/${locale}/cart`);
  }, [items.length, orderComplete, locale, router]);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) router.replace(`/${locale}/login?redirect=checkout`);
  }, [authLoading, isLoggedIn, locale, router]);

  useEffect(() => {
    const loadSavedAddress = async () => {
      try {
        const { data } = await api.get('/api/addresses');
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const addresses = data.data as SavedAddressResponseItem[];
          const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];

          setAddress({
            name:
              defaultAddr.recipientName ||
              [typedCustomer?.lastName || '', typedCustomer?.firstName || '']
                .filter(Boolean)
                .join(' ')
                .trim() ||
              '',
            postalCode: defaultAddr.postalCode || '',
            prefecture: defaultAddr.prefecture || '',
            city: defaultAddr.city || '',
            ward: defaultAddr.ward || '',
            address: defaultAddr.streetAddress || defaultAddr.address || '',
            building: defaultAddr.building || defaultAddr.addressLine2 || '',
            phone: defaultAddr.phone || '',
          });
        } else {
          setAddress((prev) => ({
            ...prev,
            name:
              prev.name ||
              [typedCustomer?.lastName || '', typedCustomer?.firstName || '']
                .filter(Boolean)
                .join(' ')
                .trim() ||
              '',
          }));
        }
      } catch {
        setAddress((prev) => ({
          ...prev,
          name:
            prev.name ||
            [typedCustomer?.lastName || '', typedCustomer?.firstName || '']
              .filter(Boolean)
              .join(' ')
              .trim() ||
            '',
        }));
      }
    };
    loadSavedAddress();
  }, [typedCustomer]);

  const fetchShippingOptions = useCallback(async () => {
    if (!address.prefecture) return;

    setShippingLoading(true);
    setShippingError('');

    try {
      const { data } = await api.post('/api/shipping/calculate', {
        prefecture: address.prefecture,
        weightGrams: totalWeightGrams,
        customerType: isPJ ? 'PJ' : 'PF',
      });

      if (data.success && data.data?.options?.length > 0) {
        setShippingOptions(data.data.options);
        setSelectedCarrierId(data.data.options[0].carrierId);
      } else {
        setShippingError(locale === 'ja' ? 'この地域への配送オプションが見つかりませんでした' : 'Nenhuma opção de entrega encontrada');
      }
    } catch {
      setShippingError(locale === 'ja' ? '送料の計算に失敗しました' : 'Erro ao calcular frete');
    } finally {
      setShippingLoading(false);
    }
  }, [address.prefecture, totalWeightGrams, isPJ, locale]);

  const handlePostalCodeChange = (value: string) => {
    setAddress((prev) => ({ ...prev, postalCode: value }));
    const cleanZip = value.replace(/[-\s]/g, '');

    if (cleanZip.length === 7) {
      fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanZip}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.status === 200 && data.results?.length > 0) {
            const result = data.results[0];
            setAddress((prev) => ({
              ...prev,
              prefecture: result.address1,
              city: result.address2,
              ward: result.address3 || '',
            }));
          }
        })
        .catch(() => {});
    }
  };

  const createPayment = async () => {
    setLoading(true);
    setPaymentError('');

    try {
      const customerId = typedCustomer?.id;
      if (!customerId) throw new Error('Customer ID not found');

      const { data } = await api.post('/api/payments/create-intent', {
        customerId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        shippingAddress: address,
        carrierId: selectedCarrierId,
        shippingCost,
        deliveryTimeSlot: selectedTimeSlot || null,
        deliveryDate: deliveryDateISO || null,
        paymentMethod,
        notes,
        subtotal,
        taxAmount: tax,
        total: grandTotal,
      });

      if (data.success) {
        setOrderId(data.data.orderId);
        setOrderNumber(data.data.orderNumber);

        if (data.data.requiresPayment && data.data.clientSecret) {
          setClientSecret(data.data.clientSecret);
          setStep('payment');
        } else {
          setOrderComplete(true);
          clearCart();
        }
      } else {
        throw new Error('Failed to create payment');
      }
    } catch (err: unknown) {
      console.error('Payment creation failed:', err);
      const error = err as ApiErrorLike;
      setPaymentError(error.message || (locale === 'ja' ? 'エラーが発生しました' : 'Erro ao processar'));
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (oid: string, onum: string) => {
    setOrderId(oid);
    setOrderNumber(onum);
    setOrderComplete(true);
    clearCart();
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {locale === 'ja' ? 'ご注文ありがとうございます！' : 'Pedido realizado com sucesso!'}
          </h1>
          {orderNumber && (
            <p className="text-sm text-gray-500 mb-2">
              {locale === 'ja' ? '注文番号' : 'Nº do pedido'}:{' '}
              <span className="font-mono font-bold">{orderNumber}</span>
            </p>
          )}
          {paymentMethod === 'DAIBIKI' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
              {locale === 'ja'
                ? `代金引換でのお届けです。配達時に¥${grandTotal.toLocaleString()}をお支払いください（代引手数料¥${daibikiFee.toLocaleString()}含む）。`
                : `Pagamento na entrega. Pague ¥${grandTotal.toLocaleString()} ao receber (inclui taxa de ¥${daibikiFee.toLocaleString()}).`}
            </div>
          )}
          {paymentMethod === 'INVOICE' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
              {locale === 'ja'
                ? '請求書払いでのご注文です。月末締め翌月払いとなります。請求書は別途お送りいたします。'
                : 'Pedido por faturamento mensal. A fatura será enviada separadamente com fechamento no final do mês.'}
            </div>
          )}
          <p className="text-gray-600 mb-8">
            {locale === 'ja'
              ? '確認メールをお送りしました。ご注文状況はアカウントページでご確認いただけます。'
              : 'Enviamos um email de confirmação. Acompanhe o status na sua conta.'}
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href={`/${locale}/account`}
              className="w-full py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors text-center"
            >
              {locale === 'ja' ? '注文状況を確認' : 'Ver meus pedidos'}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors text-center"
            >
              {locale === 'ja' ? '買い物を続ける' : 'Continuar comprando'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: 'address', label: locale === 'ja' ? 'お届け先' : 'Endereço', icon: <MapPin className="h-4 w-4" /> },
    { id: 'shipping', label: locale === 'ja' ? '配送方法' : 'Entrega', icon: <Truck className="h-4 w-4" /> },
    { id: 'confirm', label: locale === 'ja' ? '確認・決済' : 'Confirmação', icon: <CreditCard className="h-4 w-4" /> },
  ];

  const visibleStepIndex = step === 'payment' ? 2 : steps.findIndex((s) => s.id === step);

  const canProceed = () => {
    if (step === 'address') {
      return (
        !!address.name &&
        !!address.postalCode &&
        !!address.prefecture &&
        !!address.city &&
        !!address.address &&
        !!address.phone
      );
    }
    if (step === 'shipping') return !!selectedCarrierId && !!selectedDeliveryDate;
    return true;
  };

  const paymentMethods: {
    value: PaymentMethodOption;
    label: { ja: string; pt: string };
    icon: React.ReactNode;
    description: { ja: string; pt: string };
    extra?: string;
  }[] = [
    {
      value: 'STRIPE',
      label: { ja: 'クレジットカード', pt: 'Cartão de crédito' },
      icon: <CreditCard className="h-5 w-5" />,
      description: {
        ja: 'Visa, Mastercard, AMEX, JCB, Apple Pay, Google Pay',
        pt: 'Visa, Mastercard, AMEX, JCB, Apple Pay, Google Pay',
      },
    },
    {
      value: 'DAIBIKI',
      label: { ja: '代金引換', pt: 'Pagamento na entrega' },
      icon: <Banknote className="h-5 w-5" />,
      description: {
        ja: daibikiLoading
          ? '手数料計算中...'
          : daibikiFeeData.total > 0
          ? `配達時にお支払い（手数料 ¥${daibikiFeeData.total.toLocaleString()}）`
          : '配達時にお支払い',
        pt: daibikiLoading
          ? 'Calculando taxa...'
          : daibikiFeeData.total > 0
          ? `Pague ao receber (taxa ¥${daibikiFeeData.total.toLocaleString()})`
          : 'Pague ao receber',
      },
      extra: daibikiFeeData.total > 0 ? `+¥${daibikiFeeData.total.toLocaleString()}` : undefined,
    },
    ...(isPJ
      ? [{
          value: 'INVOICE' as PaymentMethodOption,
          label: { ja: '請求書払い（月末締め）', pt: 'Faturamento mensal' },
          icon: <FileText className="h-5 w-5" />,
          description: {
            ja: '月末締め翌月払い・法人様専用',
            pt: 'Fechamento mensal — exclusivo para empresas cadastradas',
          },
        }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-6 lg:py-10">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {locale === 'ja' ? '戻る' : 'Voltar'}
        </button>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (i < visibleStepIndex) setStep(s.id);
                }}
                disabled={i > visibleStepIndex}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  i === visibleStepIndex
                    ? 'bg-orange-500 text-white'
                    : i < visibleStepIndex
                    ? 'bg-green-100 text-green-700 cursor-pointer'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {i < visibleStepIndex ? <Check className="h-4 w-4" /> : s.icon}
                {s.label}
              </button>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${i < visibleStepIndex ? 'bg-green-300' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {step === 'address' && (
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  {locale === 'ja' ? 'お届け先情報' : 'Endereço de entrega'}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'ja' ? 'お名前 *' : 'Nome completo *'}
                    </label>
                    <input
                      type="text"
                      value={address.name}
                      onChange={(e) => setAddress((a) => ({ ...a, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder={locale === 'ja' ? '山田 太郎' : 'Nome Completo'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'ja' ? '郵便番号 *' : 'CEP *'}
                    </label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => handlePostalCodeChange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="437-1101"
                      maxLength={8}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'ja' ? '都道府県 *' : 'Estado *'}
                    </label>
                    <input
                      type="text"
                      value={address.prefecture}
                      onChange={(e) => setAddress((a) => ({ ...a, prefecture: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder={locale === 'ja' ? '静岡県' : 'São Paulo'}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'ja' ? '市区町村 *' : 'Cidade *'}
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder={locale === 'ja' ? '袋井市' : 'Cidade'}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'ja' ? '町域' : 'Bairro'}
                    </label>
                    <input
                      type="text"
                      value={address.ward}
                      onChange={(e) => setAddress((a) => ({ ...a, ward: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
                      placeholder={locale === 'ja' ? '浅羽' : 'Bairro'}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'ja' ? '番地 *' : 'Endereço *'}
                    </label>
                    <input
                      type="text"
                      value={address.address}
                      onChange={(e) => setAddress((a) => ({ ...a, address: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder={locale === 'ja' ? '1-2-3' : 'Rua, número'}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'ja' ? '建物名・部屋番号' : 'Complemento'}
                    </label>
                    <input
                      type="text"
                      value={address.building || ''}
                      onChange={(e) => setAddress((a) => ({ ...a, building: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder={locale === 'ja' ? 'マンション名 101号室' : 'Apto, bloco'}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'ja' ? '電話番号 *' : 'Telefone *'}
                    </label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="090-1234-5678"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep('shipping');
                    fetchShippingOptions();
                  }}
                  disabled={!canProceed()}
                  className="w-full mt-4 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {locale === 'ja' ? '配送方法の選択へ' : 'Escolher entrega'} →
                </button>
              </div>
            )}

            {step === 'shipping' && (
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-orange-500" />
                  {locale === 'ja' ? '配送方法' : 'Método de entrega'}
                </h2>

                <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-600">
                  {address.prefecture} {address.city} • {(totalWeightGrams / 1000).toFixed(1)}kg
                </div>

                {shippingLoading && (
                  <div className="flex items-center justify-center py-12 text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    {locale === 'ja' ? '送料を計算中...' : 'Calculando frete...'}
                  </div>
                )}

                {shippingError && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-red-700">{shippingError}</p>
                      <button
                        type="button"
                        onClick={fetchShippingOptions}
                        className="text-sm text-red-600 underline mt-1"
                      >
                        {locale === 'ja' ? '再試行' : 'Tentar novamente'}
                      </button>
                    </div>
                  </div>
                )}

                {!shippingLoading && shippingOptions.length > 0 && (
                  <div className="space-y-3">
                    {shippingOptions.map((option) => (
                      <label
                        key={option.carrierId}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedCarrierId === option.carrierId
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="carrier"
                            checked={selectedCarrierId === option.carrierId}
                            onChange={() => {
                              setSelectedCarrierId(option.carrierId);
                              setSelectedTimeSlot('');
                            }}
                            className="sr-only"
                          />
                          <div
                            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              selectedCarrierId === option.carrierId ? 'border-orange-500' : 'border-gray-300'
                            }`}
                          >
                            {selectedCarrierId === option.carrierId && (
                              <div className="w-3 h-3 rounded-full bg-orange-500" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-gray-900">
                                {locale === 'pt' && option.carrierNamePt ? option.carrierNamePt : option.carrierName}
                              </p>
                              <span className="text-lg font-bold text-gray-900">¥{option.price.toLocaleString()}</span>
                            </div>

                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {option.regionName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Truck className="h-3.5 w-3.5" />
                                {option.estimatedDays}
                                {locale === 'ja' ? '日' : 'd'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {locale === 'ja' ? '最短' : 'A partir de'}:{' '}
                                {(() => {
                                  const d = parseEstimatedDate(option.estimatedDate);
                                  return locale === 'ja' ? formatDateJP(d) : formatDatePT(d);
                                })()}
                              </span>
                            </div>

                            {option.extraDays > 0 && (
                              <div className="mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-2.5 py-1.5 w-fit flex items-center gap-1.5">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                {option.extraDaysNote || `+${option.extraDays}${locale === 'ja' ? '日' : ' dia(s)'}`}
                              </div>
                            )}
                          </div>
                        </div>

                        {selectedCarrierId === option.carrierId && option.timeSlots?.length > 0 && (
                          <div className="mt-4 ml-8 pt-3 border-t border-orange-200">
                            <p className="text-xs font-medium text-gray-700 mb-2">
                              {locale === 'ja' ? '配達時間帯' : 'Horário'}:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedTimeSlot('')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                                  !selectedTimeSlot
                                    ? 'border-orange-500 bg-orange-100 text-orange-700'
                                    : 'border-gray-200 text-gray-600'
                                }`}
                              >
                                {locale === 'ja' ? '指定なし' : 'Sem preferência'}
                              </button>

                              {option.timeSlots.map((slot) => (
                                <button
                                  key={slot.label}
                                  type="button"
                                  onClick={() => setSelectedTimeSlot(slot.label)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                                    selectedTimeSlot === slot.label
                                      ? 'border-orange-500 bg-orange-100 text-orange-700'
                                      : 'border-gray-200 text-gray-600'
                                  }`}
                                >
                                  {slot.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                )}

                {selectedCarrierId && deliveryDateRange && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      {locale === 'ja' ? '配達希望日' : 'Data de entrega desejada'}
                    </h3>

                    <DeliveryDatePicker
                      minDate={deliveryDateRange.minDate}
                      maxDate={deliveryDateRange.maxDate}
                      selectedDate={selectedDeliveryDate}
                      onSelect={setSelectedDeliveryDate}
                      locale={locale}
                    />

                    {selectedDeliveryDate && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-orange-800">
                          {locale === 'ja' ? '配達日' : 'Data'}: {formattedDeliveryDate}
                          {selectedTimeSlot && ` • ${selectedTimeSlot}`}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                  placeholder={locale === 'ja' ? '配送に関するご要望' : 'Observações de entrega'}
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('address')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50"
                  >
                    ← {locale === 'ja' ? '戻る' : 'Voltar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('confirm')}
                    disabled={!canProceed()}
                    className="flex-1 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {locale === 'ja' ? '確認・お支払いへ' : 'Confirmar e pagar'} →
                  </button>
                </div>
              </div>
            )}

            {step === 'confirm' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      {locale === 'ja' ? 'お届け先' : 'Endereço'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep('address')}
                      className="text-sm text-orange-600 hover:underline"
                    >
                      {locale === 'ja' ? '変更' : 'Alterar'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">
                    {address.name}
                    <br />
                    〒{address.postalCode} {address.prefecture} {address.city} {address.ward}
                    <br />
                    {address.address} {address.building}
                    <br />
                    TEL: {address.phone}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Truck className="h-4 w-4 text-orange-500" />
                      {locale === 'ja' ? '配送' : 'Entrega'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="text-sm text-orange-600 hover:underline"
                    >
                      {locale === 'ja' ? '変更' : 'Alterar'}
                    </button>
                  </div>
                  {selectedShipping && (
                    <p className="text-sm text-gray-700">
                      {locale === 'pt' && selectedShipping.carrierNamePt
                        ? selectedShipping.carrierNamePt
                        : selectedShipping.carrierName}{' '}
                      — ¥{selectedShipping.price.toLocaleString()}
                      <br />
                      <span className="text-gray-500">
                        {selectedShipping.regionName}
                        {formattedDeliveryDate && ` • ${formattedDeliveryDate}`}
                        {selectedTimeSlot && ` • ${selectedTimeSlot}`}
                      </span>
                    </p>
                  )}
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <ShoppingCart className="h-4 w-4 text-orange-500" />
                    {locale === 'ja' ? '注文商品' : 'Itens'} ({itemCount})
                  </h3>
                  <div className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3 py-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name[locale]}
                              width={48}
                              height={48}
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name[locale]}</p>
                          <p className="text-xs text-gray-500">
                            ¥{item.unitPriceWithTax.toLocaleString()} × {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          ¥{(item.unitPriceWithTax * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <CreditCard className="h-4 w-4 text-orange-500" />
                    {locale === 'ja' ? 'お支払い方法' : 'Forma de pagamento'}
                  </h3>
                  <div className="space-y-2">
                    {paymentMethods.map((pm) => (
                      <label
                        key={pm.value}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                          paymentMethod === pm.value
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={pm.value}
                          checked={paymentMethod === pm.value}
                          onChange={() => setPaymentMethod(pm.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            paymentMethod === pm.value ? 'border-orange-500' : 'border-gray-300'
                          }`}
                        >
                          {paymentMethod === pm.value && <div className="w-3 h-3 rounded-full bg-orange-500" />}
                        </div>
                        <div
                          className={`p-2 rounded-lg ${
                            paymentMethod === pm.value ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {pm.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{pm.label[locale]}</p>
                          <p className="text-xs text-gray-500">{pm.description[locale]}</p>
                        </div>
                        {pm.extra && (
                          <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                            {pm.extra}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {paymentError && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">{paymentError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50"
                  >
                    ← {locale === 'ja' ? '戻る' : 'Voltar'}
                  </button>
                  <button
                    type="button"
                    onClick={createPayment}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-bold hover:shadow-lg active:scale-95 disabled:opacity-60 transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> {locale === 'ja' ? '処理中...' : 'Processando...'}
                      </>
                    ) : paymentMethod === 'DAIBIKI' ? (
                      <>
                        {locale === 'ja' ? '注文を確定する' : 'Finalizar pedido'} — ¥{grandTotal.toLocaleString()}
                      </>
                    ) : paymentMethod === 'INVOICE' ? (
                      <>
                        {locale === 'ja' ? '注文を確定する（請求書払い）' : 'Confirmar pedido (faturamento)'} — ¥{grandTotal.toLocaleString()}
                      </>
                    ) : (
                      <>
                        {locale === 'ja' ? 'お支払いへ進む' : 'Ir para pagamento'} — ¥{grandTotal.toLocaleString()}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 'payment' && clientSecret && stripePromise && (
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-orange-500" />
                  {locale === 'ja' ? 'お支払い情報を入力' : 'Dados de pagamento'}
                </h2>

                <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-600">
                  {locale === 'ja' ? '注文番号' : 'Pedido'}:{' '}
                  <span className="font-mono font-bold">{orderNumber}</span>
                  <span className="float-right font-bold text-gray-900">¥{grandTotal.toLocaleString()}</span>
                </div>

                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: { colorPrimary: '#f97316', borderRadius: '8px' },
                    },
                    locale: locale === 'ja' ? 'ja' : 'pt-BR',
                  }}
                >
                  <StripePaymentForm
                    orderId={orderId}
                    orderNumber={orderNumber}
                    total={grandTotal}
                    locale={locale}
                    onSuccess={handlePaymentSuccess}
                    onError={(msg) => setPaymentError(msg)}
                  />
                </Elements>

                <button
                  type="button"
                  onClick={() => {
                    setStep('confirm');
                    setClientSecret('');
                  }}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  ← {locale === 'ja' ? '戻って支払い方法を変更' : 'Voltar e mudar forma de pagamento'}
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-5 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{locale === 'ja' ? '注文概要' : 'Resumo'}</h3>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    {locale === 'ja' ? '小計' : 'Subtotal'} ({itemCount})
                  </span>
                  <span className="font-medium">¥{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">{locale === 'ja' ? '消費税（8%）' : 'Imposto (8%)'}</span>
                  <span className="font-medium">¥{tax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">{locale === 'ja' ? '送料' : 'Frete'}</span>
                  {shippingCost > 0 ? (
                    <span className="font-medium">¥{shippingCost.toLocaleString()}</span>
                  ) : (
                    <span className="text-gray-400 text-xs">
                      {locale === 'ja' ? '配送方法選択後' : 'Após selecionar entrega'}
                    </span>
                  )}
                </div>

                {daibikiFee > 0 && (
                  <div className="flex justify-between text-amber-700">
                    <span>{locale === 'ja' ? '代引手数料' : 'Taxa daibiki'}</span>
                    <span className="font-medium">¥{daibikiFee.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                  <span className="font-bold text-gray-900">{locale === 'ja' ? '合計' : 'Total'}</span>
                  <span className="text-xl font-bold text-gray-900">¥{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {selectedShipping && step !== 'address' && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Truck className="h-3.5 w-3.5" />
                    {locale === 'pt' && selectedShipping.carrierNamePt
                      ? selectedShipping.carrierNamePt
                      : selectedShipping.carrierName}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedShipping.regionName}
                    {formattedDeliveryDate && ` • ${formattedDeliveryDate}`}
                    {selectedTimeSlot && ` • ${selectedTimeSlot}`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}