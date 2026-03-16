'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
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
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      alert(locale === 'pt' ? 'Mensagem enviada!' : 'メッセージが送信されました！');
      setSending(false);
    }, 800);
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: t('info.address'),
      value: '〒432-8068 静岡県浜松市中央区高塚町1620',
    },
    {
      icon: Phone,
      label: t('info.phone'),
      value: '053-570-2555',
      highlight: true,
    },
    {
      icon: Mail,
      label: t('info.email'),
      value: 'contato@realpan.jp',
    },
    {
      icon: Clock,
      label: t('info.hours'),
      value: locale === 'pt' ? 'Seg~Sex: 10:00 – 17:00' : '月〜金: 10:00〜17:00',
    },
  ];

  const inputClasses = `w-full rounded-xl border border-[#F5EDE0] bg-[#FEFCF8] px-4 py-3 text-[#1A2740] text-sm
    placeholder:text-[#C9B896]
    focus:outline-none focus:ring-2 focus:ring-[#D4972A]/20 focus:border-[#D4972A] focus:bg-white
    transition-all`;

  return (
    <div className="flex flex-col">

      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-[#2A1810] via-[#1A2740] to-[#233550] text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4972A] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ECC76E] rounded-full blur-[120px]" />
        </div>

        <div className="container-custom relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-block bg-[#D4972A] px-4 py-1.5 rounded-full text-sm text-white font-semibold shadow-lg mb-6">
              {locale === 'pt' ? 'Entre em Contato' : 'お問い合わせ'}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 text-white drop-shadow-lg">{t('title')}</h1>
            <p className="text-white/90 text-base sm:text-lg">
              {locale === 'pt'
                ? 'Estamos prontos para atender você'
                : 'お気軽にお問い合わせください'}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 0C480 60 960 60 1440 0V80H0V0Z" fill="#FAF7F2"/>
          </svg>
        </div>
      </section>

      {/* ═══ CONTACT SECTION ═══ */}
      <section className="py-12 sm:py-20 bg-[#FAF7F2]">
        <div className="container-custom">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 max-w-6xl mx-auto">

            {/* ── Form ── */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F5EDE0] shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1A2740] mb-6">
                {locale === 'pt' ? 'Envie uma Mensagem' : 'メッセージを送る'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[#1A2740]">
                    {t('form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={inputClasses}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#1A2740]">
                    {t('form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={inputClasses}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-[#1A2740]">
                    {t('form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className={inputClasses}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-[#1A2740]">
                    {t('form.message')}
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className={`${inputClasses} resize-none`}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2
                             bg-[#D4972A] hover:bg-[#B87A20] text-white
                             px-8 py-3.5 rounded-full font-semibold text-sm
                             transition-all shadow-sm active:scale-[0.98]
                             disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  {sending
                    ? (locale === 'pt' ? 'Enviando...' : '送信中...')
                    : t('form.send')
                  }
                </button>
              </form>
            </div>

            {/* ── Contact Info ── */}
            <div className="space-y-5">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1A2740] mb-6">
                {locale === 'pt' ? 'Informações de Contato' : '連絡先情報'}
              </h2>

              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index}
                    className="bg-white rounded-xl p-5 border border-[#F5EDE0] flex items-start gap-4
                               hover:border-[#ECC76E] hover:shadow-sm transition-all">
                    <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl
                      ${info.highlight ? 'bg-[#D4972A] text-white' : 'bg-[#FDF8ED] text-[#D4972A]'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-0.5 text-[11px] font-semibold text-[#8099B8] uppercase tracking-wider">
                        {info.label}
                      </h3>
                      <p className={`font-medium text-sm ${info.highlight ? 'text-[#D4972A] text-base' : 'text-[#1A2740]'}`}>
                        {info.value}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Quick note */}
              <div className="bg-[#FDF8ED] border border-[#ECC76E]/30 rounded-xl p-5 mt-6">
                <p className="text-sm text-[#B87A20] leading-relaxed">
                  {locale === 'pt'
                    ? '💼 Para pedidos corporativos (PJ), por favor informe o nome da empresa e Invoice Nummber na mensagem.'
                    : '💼 法人のお客様は、会社名と法人番号をメッセージにご記入ください。'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MAP ═══ */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A2740] text-center mb-3">
              {locale === 'pt' ? 'Nossa Localização' : '工場所在地'}
            </h2>
            <p className="text-center text-[#8099B8] text-sm mb-8">
              〒432-8068 静岡県浜松市中央区高塚町1620
            </p>
            <div className="rounded-2xl overflow-hidden border border-[#F5EDE0] shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1130.4757320077479!2d137.67539747091175!3d34.69337906139855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601ad94821d7229b%3A0x5c92947d56327c3a!2sREAL%20SABOR!5e0!3m2!1spt-BR!2sjp!4v1773376764605!5m2!1spt-BR!2sjp"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}