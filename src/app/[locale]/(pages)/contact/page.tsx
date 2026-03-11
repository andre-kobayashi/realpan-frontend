'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(locale === 'pt' ? 'Mensagem enviada!' : 'メッセージが送信されました！');
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: t('info.address'),
      value: '〒435-0016 静岡県浜松市中央区高塚町1620',
      color: 'from-orange-400 to-orange-600'
    },
    {
      icon: Phone,
      label: t('info.phone'),
      value: '053-570-2555',
      color: 'from-teal-400 to-teal-600'
    },
    {
      icon: Mail,
      label: t('info.email'),
      value: 'contato@realpan.jp',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: Clock,
      label: t('info.hours'),
      value: locale === 'pt' ? 'Seg-Sex: 10:00 – 17:00' : '月〜金: 10:00 ～ 17:00',
      color: 'from-blue-400 to-blue-600'
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero - Orange Gradient */}
      <section className="relative bg-gradient-to-br from-orange-500 to-orange-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm mb-6">
              {locale === 'pt' ? 'Entre em Contato' : 'お問い合わせ'}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('title')}</h1>
            <p className="text-white/90 text-xl">
              {locale === 'pt' 
                ? 'Estamos prontos para atender você' 
                : 'お気軽にお問い合わせください'}
            </p>
          </div>
        </div>

        {/* Curva */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path d="M0 0C480 80 960 80 1440 0V120H0V0Z" fill="#FAF7F2"/>
          </svg>
        </div>
      </section>

      {/* Contact Section - Beige Background */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 max-w-6xl mx-auto">

            {/* Form */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {locale === 'pt' ? 'Envie uma Mensagem' : 'メッセージを送る'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.message')}
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  {t('form.send')}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {locale === 'pt' ? 'Informações de Contato' : '連絡先情報'}
              </h2>
              
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg flex items-start space-x-4 hover:shadow-xl transition-shadow">
                    <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${info.color}`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        {info.label}
                      </h3>
                      <p className="text-gray-900 font-medium">{info.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section - Optional */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {locale === 'pt' ? 'Nossa Localização' : '工場所在地'}
            </h2>
            <div className="bg-[#E8F5F0] rounded-2xl p-8 text-center">
              <p className="text-gray-600 mb-4">
                {locale === 'pt' ? 'Mapa em breve' : '地図は近日公開'}
              </p>
              <p className="text-sm text-gray-500">
                静岡県浜松市中央区高塚町1620
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}