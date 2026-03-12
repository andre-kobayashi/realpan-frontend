'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, MapPin, Truck, CreditCard, ShoppingCart,
  Check, Loader2, AlertTriangle, ChevronDown
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

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

type Step = 'address' | 'shipping' | 'confirm';

export default function CheckoutClient() {
  const locale = useLocale() as 'pt' | 'ja';
  const router = useRouter();
  const { items, itemCount, subtotal, tax, total, clearCart, customerType } = useCart();
  const { customer, loading: authLoading } = useAuth();
  const isLoggedIn = !!customer;
  const isPJ = (customer as any)?.customerType === 'BUSINESS';

  const [step, setStep] = useState<Step>('address');
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Address
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

  // Shipping
  const [shippingMethod, setShippingMethod] = useState('standard');
  const shippingCost = shippingMethod === 'express' ? 1200 : 800;

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cash on delivery
  const [notes, setNotes] = useState('');

  // Redirect se carrinho vazio
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.replace(`/${locale}/cart`);
    }
  }, [items.length, orderComplete, locale, router]);

  // Redirect se não logado
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace(`/${locale}/login?redirect=checkout`);
    }
  }, [authLoading, isLoggedIn, locale, router]);

  // Carregar endereço salvo do cliente
  useEffect(() => {

    const loadSavedAddress = async () => {
      try {
        const { data } = await api.get('/api/addresses');
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          // Usar endereço padrão ou o primeiro
          const defaultAddr = data.data.find((a: any) => a.isDefault) || data.data[0];
          setAddress({
            name: defaultAddr.recipientName || [((customer as any)?.lastName || ''), ((customer as any)?.firstName || '')].filter(Boolean).join(' ').trim() || (customer as any)?.name || '',
            postalCode: defaultAddr.postalCode || '',
            prefecture: defaultAddr.prefecture || '',
            city: defaultAddr.city || '',
            ward: defaultAddr.ward || '',
            address: defaultAddr.streetAddress || defaultAddr.address || '',
            building: defaultAddr.building || defaultAddr.addressLine2 || '',
            phone: defaultAddr.phone || '',
          });
        } else {
          // Sem endereço salvo — preencher só o nome
          setAddress(prev => ({
            ...prev,
            name: prev.name || [((customer as any)?.lastName || ''), ((customer as any)?.firstName || '')].filter(Boolean).join(' ').trim() || (customer as any)?.name || '',
          }));
        }
      } catch (err) {
        console.error('Failed to load saved address:', err);
        setAddress(prev => ({
          ...prev,
          name: prev.name || [((customer as any)?.lastName || ''), ((customer as any)?.firstName || '')].filter(Boolean).join(' ').trim() || (customer as any)?.name || '',
        }));
      }
    };

    loadSavedAddress();
  }, [customer]);

  const grandTotal = total + shippingCost;


  // Auto-preenchimento por CEP
  const searchByPostalCode = async (postalCode: string) => {
    const cleanZip = postalCode.replace(/[-\s]/g, '');
    if (cleanZip.length !== 7) return;

    try {
      const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanZip}`);
      const data = await response.json();
      if (data.status === 200 && data.results && data.results.length > 0) {
        const result = data.results[0];
        setAddress(prev => ({
          ...prev,
          prefecture: result.address1,
          city: result.address2,
          ward: result.address3 || '',
        }));
      }
    } catch (err) {
      console.error('CEP lookup failed:', err);
    }
  };

  const handlePostalCodeChange = (value: string) => {
    setAddress(prev => ({ ...prev, postalCode: value }));
    const cleanZip = value.replace(/[-\s]/g, '');
    if (cleanZip.length === 7) {
      searchByPostalCode(value);
    }
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    try {
      const payload = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        shippingAddress: address,
        shippingMethod,
        shippingCost,
        paymentMethod,
        notes,
        subtotal,
        tax,
        total: grandTotal,
        customerType,
      };

      const { data } = await api.post('/api/orders', payload);

      if (data.success) {
        setOrderId(data.data?.id || data.data?.orderNumber || '');
        setOrderComplete(true);
        clearCart();
      } else {
        alert(locale === 'ja' ? '注文に失敗しました' : 'Erro ao criar pedido');
      }
    } catch (err) {
      console.error('Order failed:', err);
      alert(locale === 'ja' ? '注文に失敗しました。もう一度お試しください。' : 'Erro ao criar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ═══════ PEDIDO CONCLUÍDO ═══════
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
          {orderId && (
            <p className="text-sm text-gray-500 mb-4">
              {locale === 'ja' ? '注文番号' : 'Nº do pedido'}: <span className="font-mono font-bold">{orderId}</span>
            </p>
          )}
          <p className="text-gray-600 mb-8">
            {locale === 'ja'
              ? '確認メールをお送りしました。ご注文状況はアカウントページでご確認いただけます。'
              : 'Enviamos um email de confirmação. Acompanhe o status do pedido na sua conta.'}
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

  const stepIndex = steps.findIndex(s => s.id === step);

  const canProceed = () => {
    if (step === 'address') {
      return address.name && address.postalCode && address.prefecture && address.city && address.address && address.phone;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-6 lg:py-10">

        {/* Back */}
        <button type="button" onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 mb-6">
          <ArrowLeft className="h-4 w-4" />
          {locale === 'ja' ? '戻る' : 'Voltar'}
        </button>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => i <= stepIndex && setStep(s.id)}
                disabled={i > stepIndex}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  s.id === step
                    ? 'bg-orange-500 text-white'
                    : i < stepIndex
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {i < stepIndex ? <Check className="h-4 w-4" /> : s.icon}
                {s.label}
              </button>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${i < stepIndex ? 'bg-green-300' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── MAIN CONTENT ── */}
          <div className="lg:col-span-2">

            {/* STEP 1: ADDRESS */}
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
                      type="text" required value={address.name}
                      onChange={e => setAddress(a => ({ ...a, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder={locale === 'ja' ? '山田 太郎' : 'Nome Completo'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'ja' ? '郵便番号 *' : 'CEP *'}
                    </label>
                    <input
                      type="text" required value={address.postalCode}
                      onChange={e => handlePostalCodeChange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="437-1101" maxLength={8}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'ja' ? '都道府県 *' : 'Estado *'}
                    </label>
                    <input
                      type="text" required value={address.prefecture}
                      onChange={e => setAddress(a => ({ ...a, prefecture: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder={locale === 'ja' ? '東京都' : 'São Paulo'}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'ja' ? '市区町村 *' : 'Cidade *'}
                    </label>
                    <input
                      type="text" required value={address.city}
                      onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder={locale === 'ja' ? '渋谷区' : 'Cidade'}
                    />
                  </div>

                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'ja' ? '町域' : 'Bairro'}
                    </label>
                    <input
                      type="text"
                      value={address.ward}
                      onChange={e => setAddress(a => ({ ...a, ward: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
                      placeholder={locale === 'ja' ? '浅羽' : 'Bairro'}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'ja' ? '番地 *' : 'Endereço *'}
                    </label>
                    <input
                      type="text" required value={address.address}
                      onChange={e => setAddress(a => ({ ...a, address: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder={locale === 'ja' ? '1-2-3' : 'Rua, número'}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'ja' ? '建物名・部屋番号' : 'Complemento'}
                    </label>
                    <input
                      type="text" value={address.building || ''}
                      onChange={e => setAddress(a => ({ ...a, building: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder={locale === 'ja' ? 'マンション名 101号室' : 'Apto, bloco'}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'ja' ? '電話番号 *' : 'Telefone *'}
                    </label>
                    <input
                      type="tel" required value={address.phone}
                      onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="090-1234-5678"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  disabled={!canProceed()}
                  className="w-full mt-4 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {locale === 'ja' ? '配送方法の選択へ' : 'Escolher entrega'} →
                </button>
              </div>
            )}

            {/* STEP 2: SHIPPING */}
            {step === 'shipping' && (
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-orange-500" />
                  {locale === 'ja' ? '配送方法' : 'Método de entrega'}
                </h2>

                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      shippingMethod === 'standard' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio" name="shipping" value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      shippingMethod === 'standard' ? 'border-orange-500' : 'border-gray-300'
                    }`}>
                      {shippingMethod === 'standard' && <div className="w-3 h-3 rounded-full bg-orange-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {locale === 'ja' ? '通常配送（冷凍便）' : 'Entrega padrão (refrigerada)'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {locale === 'ja' ? '3〜5営業日' : '3-5 dias úteis'}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900">¥800</span>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      shippingMethod === 'express' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio" name="shipping" value="express"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      shippingMethod === 'express' ? 'border-orange-500' : 'border-gray-300'
                    }`}>
                      {shippingMethod === 'express' && <div className="w-3 h-3 rounded-full bg-orange-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {locale === 'ja' ? '速達配送（冷凍便）' : 'Entrega expressa (refrigerada)'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {locale === 'ja' ? '翌日〜2営業日' : '1-2 dias úteis'}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900">¥1,200</span>
                  </label>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'ja' ? '配送に関するメモ' : 'Observações de entrega'}
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                    placeholder={locale === 'ja' ? '時間指定など' : 'Ex: entregar pela manhã'}
                  />
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep('address')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors">
                    ← {locale === 'ja' ? '戻る' : 'Voltar'}
                  </button>
                  <button type="button" onClick={() => setStep('confirm')}
                    className="flex-1 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors">
                    {locale === 'ja' ? '注文内容の確認へ' : 'Revisar pedido'} →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONFIRM */}
            {step === 'confirm' && (
              <div className="space-y-4">
                {/* Address summary */}
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      {locale === 'ja' ? 'お届け先' : 'Endereço'}
                    </h3>
                    <button type="button" onClick={() => setStep('address')} className="text-sm text-orange-600 hover:underline">
                      {locale === 'ja' ? '変更' : 'Alterar'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">
                    {address.name}<br />
                    〒{address.postalCode} {address.prefecture} {address.city} {address.ward}<br />
                    {address.address} {address.building}<br />
                    TEL: {address.phone}
                  </p>
                </div>

                {/* Shipping summary */}
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Truck className="h-4 w-4 text-orange-500" />
                      {locale === 'ja' ? '配送方法' : 'Entrega'}
                    </h3>
                    <button type="button" onClick={() => setStep('shipping')} className="text-sm text-orange-600 hover:underline">
                      {locale === 'ja' ? '変更' : 'Alterar'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">
                    {shippingMethod === 'express'
                      ? (locale === 'ja' ? '速達配送（翌日〜2営業日）' : 'Expressa (1-2 dias)')
                      : (locale === 'ja' ? '通常配送（3〜5営業日）' : 'Padrão (3-5 dias)')
                    }
                    — ¥{shippingCost.toLocaleString()}
                  </p>
                </div>

                {/* Items */}
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <ShoppingCart className="h-4 w-4 text-orange-500" />
                    {locale === 'ja' ? '注文商品' : 'Itens'} ({itemCount})
                  </h3>
                  <div className="divide-y divide-gray-100">
                    {items.map(item => (
                      <div key={item.productId} className="flex items-center gap-3 py-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image && (
                            <Image src={item.image} alt={item.name[locale]} width={48} height={48} className="w-full h-full object-contain" />
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

                {/* Payment */}
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <CreditCard className="h-4 w-4 text-orange-500" />
                    {locale === 'ja' ? 'お支払い方法' : 'Pagamento'}
                  </h3>
                  <div className="space-y-2">
                    <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer ${
                      paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')} className="sr-only" />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'cod' ? 'border-orange-500' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                      </div>
                      <span className="text-sm font-medium">
                        {locale === 'ja' ? '代金引換' : 'Pagamento na entrega'}
                      </span>
                    </label>

                    <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer ${
                      paymentMethod === 'transfer' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}>
                      <input type="radio" name="payment" value="transfer" checked={paymentMethod === 'transfer'}
                        onChange={() => setPaymentMethod('transfer')} className="sr-only" />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'transfer' ? 'border-orange-500' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'transfer' && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                      </div>
                      <span className="text-sm font-medium">
                        {locale === 'ja' ? '銀行振込' : 'Transferência bancária'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep('shipping')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors">
                    ← {locale === 'ja' ? '戻る' : 'Voltar'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-bold hover:shadow-lg active:scale-95 disabled:opacity-60 transition-all"
                  >
                    {loading ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> {locale === 'ja' ? '処理中...' : 'Processando...'}</>
                    ) : (
                      <>{locale === 'ja' ? '注文を確定する' : 'Finalizar pedido'} — ¥{grandTotal.toLocaleString()}</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── ORDER SUMMARY SIDEBAR ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-5 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {locale === 'ja' ? '注文概要' : 'Resumo'}
              </h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{locale === 'ja' ? '小計' : 'Subtotal'} ({itemCount})</span>
                  <span className="font-medium">¥{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{locale === 'ja' ? '消費税（8%）' : 'Imposto (8%)'}</span>
                  <span className="font-medium">¥{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{locale === 'ja' ? '送料' : 'Frete'}</span>
                  <span className="font-medium">¥{shippingCost.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                  <span className="font-bold text-gray-900">{locale === 'ja' ? '合計' : 'Total'}</span>
                  <span className="text-xl font-bold text-gray-900">¥{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}