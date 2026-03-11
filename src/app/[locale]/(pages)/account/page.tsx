'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { User, Package, MapPin, LogOut, Loader2 } from 'lucide-react';
import AddressManager from '@/components/account/AddressManager';

export default function AccountPage() {
  const t = useTranslations('auth.account');
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

  const tabs = [
    { id: 'profile', label: t('menu.profile'), icon: User },
    { id: 'orders', label: t('menu.orders'), icon: Package },
    { id: 'addresses', label: t('menu.addresses'), icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('title')}
              </h1>
              <p className="text-gray-600">
                {t('welcome', { name: customer.firstName })}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {t('menu.logout')}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
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

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {t('profile.title')}
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('profile.fields.firstName')}
                      </label>
                      <p className="text-gray-900">{customer.firstName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('profile.fields.lastName')}
                      </label>
                      <p className="text-gray-900">{customer.lastName}</p>
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
                      <p className="text-gray-900">
                        {customer.type === 'INDIVIDUAL' 
                          ? t('accountTypes.individual') 
                          : t('accountTypes.business')
                        }
                      </p>
                    </div>
                    {customer.type === 'BUSINESS' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('profile.fields.status')}
                          </label>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                            customer.businessStatus === 'APPROVED'
                              ? 'bg-green-100 text-green-700'
                              : customer.businessStatus === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {customer.businessStatus === 'APPROVED' && t('businessStatus.approved')}
                            {customer.businessStatus === 'PENDING' && t('businessStatus.pending')}
                            {customer.businessStatus === 'REJECTED' && t('businessStatus.rejected')}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {t('orders.title')}
                  </h2>
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">{t('orders.empty')}</p>
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <AddressManager />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
