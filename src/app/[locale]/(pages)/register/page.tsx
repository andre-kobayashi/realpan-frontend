'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, User, Building2, AlertCircle, CheckCircle } from 'lucide-react';

type RegisterErrorResponse = {
  response?: {
    data?: {
      message?: {
        pt?: string;
      };
    };
  };
};

export default function RegisterPage() {
  const t = useTranslations('auth.register');
  const router = useRouter();
  const { register } = useAuth();
  
  const [accountType, setAccountType] = useState<'INDIVIDUAL' | 'BUSINESS'>('INDIVIDUAL');
  const [formData, setFormData] = useState({
    type: 'INDIVIDUAL',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    postalCode: '',
    prefecture: '',
    city: '',
    streetAddress: '',
    building: '',
    companyName: '',
    taxId: '',
    invoiceNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('error.passwordMismatch'));
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await register({ ...formData, type: accountType });
      setSuccess(true);
      
      if (accountType === 'INDIVIDUAL') {
        setTimeout(() => router.push('/account'), 2000);
      }
    } catch (err: unknown) {
      const error = err as RegisterErrorResponse;
      const errorMsg = error.response?.data?.message?.pt || t('error.generic');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {accountType === 'INDIVIDUAL' ? t('success') : t('successBusiness')}
          </h2>
          {accountType === 'INDIVIDUAL' && (
            <p className="text-gray-600">Redirecionando...</p>
          )}
          {accountType === 'BUSINESS' && (
            <div className="mt-4">
              <p className="text-gray-600 mb-4">
                Seu pedido de cadastro está em análise. Você receberá um email quando for aprovado.
              </p>
              <Link href="/" className="inline-block px-6 py-2 bg-[#B87A20] text-white rounded-lg hover:bg-[#965C1C]">
                Voltar ao Início
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4972A] to-[#B87A20] rounded-full mb-4">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('title')}
            </h1>
            <p className="text-gray-600">
              {t('subtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                {t('accountType')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAccountType('INDIVIDUAL')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    accountType === 'INDIVIDUAL'
                      ? 'border-[#D4972A] bg-[#FDF8ED]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className={`h-6 w-6 mx-auto mb-2 ${accountType === 'INDIVIDUAL' ? 'text-[#D4972A]' : 'text-gray-400'}`} />
                  <div className="text-sm font-medium text-gray-900">{t('individual')}</div>
                  <div className="text-xs text-gray-600 mt-1">{t('individualDesc')}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('BUSINESS')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    accountType === 'BUSINESS'
                      ? 'border-[#D4972A] bg-[#FDF8ED]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Building2 className={`h-6 w-6 mx-auto mb-2 ${accountType === 'BUSINESS' ? 'text-[#D4972A]' : 'text-gray-400'}`} />
                  <div className="text-sm font-medium text-gray-900">{t('business')}</div>
                  <div className="text-xs text-gray-600 mt-1">{t('businessDesc')}</div>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('personalInfo')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('firstName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4972A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('lastName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4972A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('email')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4972A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('phone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4972A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('password')} * (mín. 6 caracteres)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4972A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('confirmPassword')} *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4972A]"
                  />
                </div>
              </div>
            </div>

            {accountType === 'BUSINESS' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados da Empresa</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('companyName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4972A]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('taxId')}
                      </label>
                      <input
                        type="text"
                        value={formData.taxId}
                        onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4972A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('invoiceNumber')}
                      </label>
                      <input
                        type="text"
                        value={formData.invoiceNumber}
                        onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4972A]"
                        placeholder="T1234567890123"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#D4972A] to-[#B87A20] text-white rounded-lg font-medium hover:from-[#B87A20] hover:to-[#965C1C] transition-all disabled:opacity-50"
            >
              {loading ? t('loading') : t('registerButton')}
            </button>

            <p className="text-xs text-gray-600 text-center">
              {t('terms')}{' '}
              <Link href="/terms" className="text-[#D4972A] hover:underline">
                {t('termsLink')}
              </Link>
              {' '}{t('and')}{' '}
              <Link href="/privacy" className="text-[#D4972A] hover:underline">
                {t('privacyLink')}
              </Link>
            </p>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('haveAccount')}{' '}
              <Link href="/login" className="text-[#D4972A] hover:text-[#B87A20] font-medium">
                {t('loginLink')}
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-gray-800 text-sm">
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}