'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit2, MapPin, X, Save, Search } from 'lucide-react';
import api from '@/lib/api';

interface Address {
  id: string;
  label: string;
  postalCode: string;
  prefecture: string;
  city: string;
  ward?: string;
  streetAddress: string;
  building?: string;
  phone?: string;
  isDefault: boolean;
}

export default function AddressManager() {
  const t = useTranslations('addresses');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    postalCode: '',
    prefecture: '',
    city: '',
    ward: '',
    streetAddress: '',
    building: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);
  const [searchingZip, setSearchingZip] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get('/api/addresses');
      setAddresses(data.data);
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar endereço pelo CEP
  const searchByPostalCode = async (postalCode: string) => {
    // Remover hífen e espaços
    const cleanZip = postalCode.replace(/[-\s]/g, '');
    
    // Validar formato (7 dígitos)
    if (cleanZip.length !== 7) return;

    setSearchingZip(true);

    try {
      // API gratuita do Japão: https://zipcloud.ibsnet.co.jp/
      const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanZip}`);
      const data = await response.json();

      if (data.status === 200 && data.results && data.results.length > 0) {
        const result = data.results[0];
        
        // Preencher automaticamente
        setFormData(prev => ({
          ...prev,
          prefecture: result.address1, // 都道府県
          city: result.address2,       // 市区町村
          ward: result.address3,       // 町域
        }));
      } else {
        alert('❌ CEP não encontrado\n郵便番号が見つかりません');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      alert('❌ Erro ao buscar CEP\n郵便番号の検索に失敗しました');
    } finally {
      setSearchingZip(false);
    }
  };

  // Detectar quando o usuário terminou de digitar o CEP
  const handlePostalCodeChange = (value: string) => {
    setFormData({ ...formData, postalCode: value });
    
    // Auto-buscar quando tiver 7 ou 8 caracteres (com ou sem hífen)
    const cleanZip = value.replace(/[-\s]/g, '');
    if (cleanZip.length === 7) {
      searchByPostalCode(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/api/addresses', formData);
      await fetchAddresses();
      setShowForm(false);
      setFormData({
        postalCode: '',
        prefecture: '',
        city: '',
        ward: '',
        streetAddress: '',
        building: '',
        phone: '',
      });
      alert(`✅ ${t('success')}`);
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      alert(`❌ ${t('error')}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header - Responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {t('title')}
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="h-5 w-5" />
          {addresses.length === 0 ? t('addButton') : t('editButton')}
        </button>
      </div>

      {/* Empty State */}
      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{t('empty')}</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            {t('addFirst')}
          </button>
        </div>
      ) : (
        /* Address List */
        <div className="grid gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white border-2 border-orange-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  <h3 className="font-medium text-gray-900">{address.label}</h3>
                  {address.isDefault && (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full whitespace-nowrap">
                      {t('default')}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setShowForm(true)}
                  className="p-1 text-gray-600 hover:text-orange-600 flex-shrink-0"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>〒{address.postalCode}</p>
                <p>{address.prefecture} {address.city}</p>
                {address.ward && <p>{address.ward}</p>}
                <p>{address.streetAddress}</p>
                {address.building && <p>{address.building}</p>}
                {address.phone && <p>TEL: {address.phone}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {addresses.length === 0 ? t('form.titleAdd') : t('form.titleEdit')}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              {/* CEP com busca automática */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.postalCode')} *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => handlePostalCodeChange(e.target.value)}
                    placeholder={t('form.placeholders.postalCode')}
                    maxLength={8}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {searchingZip && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t('form.zipHelper')}
                </p>
              </div>

              {/* Prefeitura e Cidade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.prefecture')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.prefecture}
                    onChange={(e) => setFormData({ ...formData, prefecture: e.target.value })}
                    placeholder={t('form.placeholders.prefecture')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                    readOnly={searchingZip}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.city')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder={t('form.placeholders.city')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                    readOnly={searchingZip}
                  />
                </div>
              </div>

              {/* Bairro */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.ward')}
                </label>
                <input
                  type="text"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  placeholder={t('form.placeholders.ward')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                  readOnly={searchingZip}
                />
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.streetAddress')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  placeholder={t('form.placeholders.streetAddress')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Complemento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.building')}
                </label>
                <input
                  type="text"
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  placeholder={t('form.placeholders.building')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              
              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.phone')} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="090-1234-5678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              {/* Botões */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('form.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  {saving ? t('form.saving') : t('form.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
