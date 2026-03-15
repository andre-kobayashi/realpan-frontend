'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Package,
  MapPin,
  LogOut,
  Loader2,
  Clock,
  Truck,
  CreditCard,
  ExternalLink,
  Building2,
} from 'lucide-react';
import Image from 'next/image';
import AddressManager from '@/components/account/AddressManager';
import api from '@/lib/api';

interface OrderItem {
  id: string;
  image?: string;
  nameJa: string;
  namePt: string;
  quantity: number;
}

interface Carrier {
  name?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED' | string;
  paymentMethod: 'STRIPE' | 'DAIBIKI' | 'BANK_TRANSFER' | 'INVOICE' | string;
  createdAt: string;
  deliveryDate?: string;
  deliveryTime?: string;
  shippingCost: number;
  total: number;
  trackingCode?: string;
  carrier?: Carrier;
  carrierName?: string;
  items?: OrderItem[];
}

interface OrdersResponse {
  success: boolean;
  data?: Order[];
}

interface TranslationFn {
  (key: string, values?: Record<string, string | number>): string;
}

interface IndividualCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: 'INDIVIDUAL';
  businessStatus?: string;
}

interface BusinessCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: 'BUSINESS';
  businessStatus?: string;
  companyName?: string;
  companyNameKana?: string;
  customerType?: 'BUSINESS';
}

type AccountCustomer = IndividualCustomer | BusinessCustomer;

// ── Tracking URL builder ──
function getTrackingUrl(carrierName: string | undefined, trackingCode: string): string {
  if (!trackingCode) return '';
  const name = (carrierName || '').toLowerCase();

  if (name.includes('sagawa') || name.includes('佐川')) {
    return `https://k2k.sagawa-exp.co.jp/p/web/okurijosearch.do?okurijoNo=${trackingCode}`;
  }

  if (name.includes('yamato') || name.includes('ヤマト') || name.includes('クロネコ')) {
    return `https://toi.kuronekoyamato.co.jp/cgi-bin/tneko?number=${trackingCode}`;
  }

  if (
    name.includes('yuupack') ||
    name.includes('ゆうパック') ||
    name.includes('japan post') ||
    name.includes('郵便')
  ) {
    return `https://trackings.post.japanpost.jp/services/srv/search/?requestNo1=${trackingCode}`;
  }

  return `https://k2k.sagawa-exp.co.jp/p/web/okurijosearch.do?okurijoNo=${trackingCode}`;
}

// ── Orders Tab Component ──
function OrdersTab({ t }: { t: TranslationFn }) {
  const locale = useLocale();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get<OrdersResponse>('/api/orders/my');
        if (data.success) {
          setOrders(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-emerald-100 text-emerald-800',
    CANCELED: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, { pt: string; ja: string }> = {
    PENDING: { pt: 'Pendente', ja: '保留中' },
    PAID: { pt: 'Pago', ja: '支払済' },
    PROCESSING: { pt: 'Preparando', ja: '準備中' },
    SHIPPED: { pt: 'Enviado', ja: '発送済' },
    DELIVERED: { pt: 'Entregue', ja: '配達済' },
    CANCELED: { pt: 'Cancelado', ja: 'キャンセル' },
  };

  const paymentLabels: Record<string, { pt: string; ja: string }> = {
    STRIPE: { pt: 'Cartão', ja: 'カード' },
    DAIBIKI: { pt: 'Daibiki', ja: '代金引換' },
    BANK_TRANSFER: { pt: 'Transferência', ja: '銀行振込' },
    INVOICE: { pt: 'Fatura', ja: '請求書' },
  };

  const loc = locale as 'pt' | 'ja';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('orders.title')}</h2>
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{t('orders.empty')}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('orders.title')}</h2>
      <div className="space-y-4">
        {orders.map((order) => {
          const statusLabel = statusLabels[order.status]?.[loc] || order.status;
          const paymentLabel = paymentLabels[order.paymentMethod]?.[loc] || order.paymentMethod;
          const trackingUrl = order.trackingCode
            ? getTrackingUrl(order.carrier?.name || order.carrierName, order.trackingCode)
            : '';

          return (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-gray-900">{order.orderNumber}</span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      statusColors[order.status] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(order.createdAt).toLocaleDateString(loc === 'ja' ? 'ja-JP' : 'pt-BR')}
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
                  {order.items.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 flex-shrink-0"
                    >
                      {item.image && (
                        <div className="w-8 h-8 rounded overflow-hidden bg-white flex-shrink-0">
                          <Image
                            src={
                              item.image.startsWith('http')
                                ? item.image
                                : `${process.env.NEXT_PUBLIC_API_URL || 'https://api.realpan.jp'}/${item.image.replace(/^\//, '')}`
                            }
                            alt={loc === 'ja' ? item.nameJa : item.namePt}
                            width={32}
                            height={32}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
                          {loc === 'ja' ? item.nameJa : item.namePt}
                        </p>
                        <p className="text-[10px] text-gray-500">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      +{order.items.length - 4}
                    </span>
                  )}
                </div>
              )}

              {order.trackingCode && (
                <div className="mb-3 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <Truck className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-blue-800 font-mono">{order.trackingCode}</span>
                  {trackingUrl && (
                    <a
                      href={trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {loc === 'ja' ? '追跡する' : 'Rastrear'}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}

              {order.deliveryDate && (
                <div className="mb-3 text-xs text-gray-500 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {loc === 'ja' ? '配達日' : 'Entrega'}:{' '}
                  {new Date(order.deliveryDate).toLocaleDateString(loc === 'ja' ? 'ja-JP' : 'pt-BR')}
                  {order.deliveryTime && ` • ${order.deliveryTime}`}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5" />
                    {paymentLabel}
                  </span>
                  {order.shippingCost > 0 && (
                    <span className="flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5" />
                      {loc === 'ja' ? '送料' : 'Frete'} ¥{order.shippingCost.toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="text-lg font-bold text-gray-900">
                  ¥{(order.total || 0).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AccountPage() {
  const t = useTranslations('auth.account');
  const locale = useLocale();
  const router = useRouter();
  const { customer, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!loading && !customer) {
      router.push('/login');
    }
  }, [loading, customer, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  const c = customer as AccountCustomer;
  const isPJ = c.type === 'BUSINESS' || ('customerType' in c && c.customerType === 'BUSINESS');
  const displayName = isPJ
    ? ('companyName' in c
        ? c.companyName || [c.lastName, c.firstName].filter(Boolean).join(' ') || c.email
        : c.email)
    : [c.firstName, c.lastName].filter(Boolean).join(' ') || c.email;

  const tabs = [
    { id: 'profile', label: t('menu.profile'), icon: User },
    { id: 'orders', label: t('menu.orders'), icon: Package },
    { id: 'addresses', label: t('menu.addresses'), icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                {isPJ && <Building2 className="h-4 w-4 text-orange-500" />}
                {t('welcome', { name: displayName })}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {t('menu.logout')}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('profile.title')}</h2>

                  {isPJ && 'companyName' in c && c.companyName && (
                    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-5 w-5 text-orange-600" />
                        <span className="font-semibold text-gray-900">{c.companyName}</span>
                      </div>
                      {c.companyNameKana && (
                        <p className="text-sm text-gray-500 ml-7">{c.companyNameKana}</p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6">
                    {isPJ ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {locale === 'ja' ? '担当者名' : 'Responsável'}
                          </label>
                          <p className="text-gray-900">
                            {[c.lastName, c.firstName].filter(Boolean).join(' ') || '-'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('profile.fields.email')}
                          </label>
                          <p className="text-gray-900">{customer.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('profile.fields.accountType')}
                          </label>
                          <p className="text-gray-900">{t('accountTypes.business')}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('profile.fields.status')}
                          </label>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm ${
                              c.businessStatus === 'APPROVED'
                                ? 'bg-green-100 text-green-700'
                                : c.businessStatus === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {c.businessStatus === 'APPROVED' && t('businessStatus.approved')}
                            {c.businessStatus === 'PENDING' && t('businessStatus.pending')}
                            {c.businessStatus === 'REJECTED' && t('businessStatus.rejected')}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('profile.fields.firstName')}
                          </label>
                          <p className="text-gray-900">{customer.firstName || '-'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('profile.fields.lastName')}
                          </label>
                          <p className="text-gray-900">{customer.lastName || '-'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('profile.fields.email')}
                          </label>
                          <p className="text-gray-900">{customer.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('profile.fields.accountType')}
                          </label>
                          <p className="text-gray-900">{t('accountTypes.individual')}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && <OrdersTab t={t} />}

              {activeTab === 'addresses' && <AddressManager />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}