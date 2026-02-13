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
      value: '静岡県浜松市中央区高塚町1620',
    },
    {
      icon: Phone,
      label: t('info.phone'),
      value: '053-570-2555',
    },
    {
      icon: Mail,
      label: t('info.email'),
      value: 'info@realpan.co.jp',
    },
    {
      icon: Clock,
      label: t('info.hours'),
      value: locale === 'pt' ? 'Seg-Sex: 10:00 – 17:00' : '月〜金: 10:00 ～ 17:00',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="heading-1 mb-6 animate-fade-in">{t('title')}</h1>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2">

            {/* Form */}
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-neutral-700">
                    {t('form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-700">
                    {t('form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-neutral-700">
                    {t('form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-neutral-700">
                    {t('form.message')}
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="input resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  {t('form.send')}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="card flex items-start space-x-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                      <Icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-semibold text-neutral-900">
                        {info.label}
                      </h3>
                      <p className="text-neutral-600">{info.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
