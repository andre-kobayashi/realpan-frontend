'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Phone, Clock, Send, CheckCircle, Briefcase, MapPin, Users, Star } from 'lucide-react';
import Link from 'next/link';

export default function CareersPage() {
  const locale = useLocale() as 'pt' | 'ja';
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', nationality: '', experience: '', currentLocation: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const t = {
    pt: {
      heroTag: 'VAGAS ABERTAS', heroTitle: 'Venha trabalhar conosco!',
      heroSubtitle: 'A Real Pan está crescendo e procura profissionais apaixonados por panificação.',
      aboutTitle: 'Sobre a Real Pan',
      aboutText: 'Somos uma fábrica de pães brasileiros em Hamamatsu, Shizuoka, que fornece produtos autênticos para todo o Japão.',
      requireTitle: 'Requisitos',
      requirements: [
        { icon: Briefcase, text: 'Mínimo 5 anos de experiência em padaria ou confeitaria' },
        { icon: MapPin, text: 'Residir no Japão com visto de trabalho válido' },
        { icon: Users, text: 'Capacidade de trabalhar em equipe multicultural' },
        { icon: Star, text: 'Conhecimento em pães artesanais é um diferencial' },
      ],
      benefitsTitle: 'O que oferecemos',
      benefits: ['Salário competitivo', 'Ambiente acolhedor', 'Oportunidade de crescimento', 'Produtos frescos todos os dias 🍞'],
      formTitle: 'Envie seu currículo', formSubtitle: 'Preencha o formulário ou ligue para nós.',
      name: 'Nome completo', email: 'E-mail', phone: 'Telefone', nationality: 'Nacionalidade',
      experience: 'Anos de experiência', currentLocation: 'Cidade atual', message: 'Sobre sua experiência',
      send: 'Enviar candidatura', sending: 'Enviando...', successTitle: 'Candidatura enviada!',
      successText: 'Obrigado! Entraremos em contato em breve.',
      phoneContact: 'Ou ligue em horário comercial:', phoneCta: 'Ligar agora',
    },
    ja: {
      heroTag: 'スタッフ募集', heroTitle: '一緒に働きませんか？',
      heroSubtitle: 'リアルパンは事業拡大に伴い、パン製造の経験者を募集しています。',
      aboutTitle: 'リアルパンについて',
      aboutText: '静岡県浜松市にあるブラジルパン製造工場。全国にお届けしています。',
      requireTitle: '応募条件',
      requirements: [
        { icon: Briefcase, text: 'パン製造の実務経験5年以上' },
        { icon: MapPin, text: '日本在住で就労ビザをお持ちの方' },
        { icon: Users, text: '多文化環境でのチームワーク' },
        { icon: Star, text: '手作りパンの知識がある方は優遇' },
      ],
      benefitsTitle: '待遇', benefits: ['競争力のある給与', 'あたたかい職場', 'キャリアアップ', '毎日焼きたてパン 🍞'],
      formTitle: '応募フォーム', formSubtitle: 'フォームまたはお電話でお問い合わせください。',
      name: '氏名', email: 'メール', phone: '電話', nationality: '国籍',
      experience: '経験年数', currentLocation: 'お住まい', message: 'ご経験について',
      send: '応募する', sending: '送信中...', successTitle: '応募完了！',
      successText: 'ご応募ありがとうございます。近日中にご連絡します。',
      phoneContact: '営業時間内にお電話も可能です：', phoneCta: '電話する',
    },
  }[locale];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const subject = encodeURIComponent(locale === 'ja' ? `【採用応募】${formData.name}様` : `【Candidatura】${formData.name}`);
    const body = encodeURIComponent([`${t.name}: ${formData.name}`, `${t.email}: ${formData.email}`, `${t.phone}: ${formData.phone}`, `${t.nationality}: ${formData.nationality}`, `${t.experience}: ${formData.experience}`, `${t.currentLocation}: ${formData.currentLocation}`, '', formData.message].join('\n'));
    window.open(`mailto:e.realpan@gmail.com?subject=${subject}&body=${body}`, '_self');
    setTimeout(() => { setSent(true); setSending(false); }, 1000);
  };

  const inputCls = `w-full px-4 py-3 rounded-xl border border-[#F5EDE0] bg-[#FEFCF8] text-sm text-[#1A2740] placeholder:text-[#C9B896] focus:outline-none focus:ring-2 focus:ring-[#D4972A]/20 focus:border-[#D4972A] focus:bg-white transition`;

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold text-[#1A2740] mb-3">{t.successTitle}</h1>
          <p className="text-[#57749A] mb-8">{t.successText}</p>
          <Link href={`/${locale}/news`} className="inline-flex items-center gap-2 bg-[#D4972A] hover:bg-[#B87A20] text-white px-6 py-3 rounded-full font-semibold text-sm transition-all">
            {locale === 'ja' ? '新着情報に戻る' : 'Voltar às novidades'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#FAF7F2]">

      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-[#2A1810] via-[#1A2740] to-[#233550] text-white py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4972A] rounded-full blur-[100px]" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#D4972A] px-4 py-1.5 rounded-full text-sm text-white font-semibold shadow-lg mb-6">
            <Briefcase className="h-4 w-4" /> {t.heroTag}
          </div>
          <h1 className="text-3xl lg:text-5xl font-semibold mb-5">{t.heroTitle}</h1>
          <p className="text-white/85 text-base lg:text-lg max-w-2xl mx-auto">{t.heroSubtitle}</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full"><path d="M0 0C480 60 960 60 1440 0V80H0V0Z" fill="#FAF7F2"/></svg>
        </div>
      </section>

      {/* ═══ ABOUT + REQUIREMENTS ═══ */}
      <section className="py-12 lg:py-16 bg-[#FAF7F2]">
        <div className="container-custom max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-semibold text-[#1A2740] mb-4">{t.aboutTitle}</h2>
              <p className="text-[#57749A] text-sm leading-relaxed mb-6">{t.aboutText}</p>
              <h3 className="text-base font-semibold text-[#1A2740] mb-3">{t.benefitsTitle}</h3>
              <ul className="space-y-2">
                {t.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-[#57749A] text-sm">
                    <CheckCircle className="h-4 w-4 text-[#D4972A] flex-shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1A2740] mb-4">{t.requireTitle}</h2>
              <div className="space-y-3">
                {t.requirements.map((req, i) => {
                  const Icon = req.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[#F5EDE0]">
                      <div className="w-9 h-9 bg-[#FDF8ED] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-[#D4972A]" />
                      </div>
                      <p className="text-[#1A2740] text-sm leading-relaxed pt-1.5">{req.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FORM ═══ */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold text-[#1A2740] mb-2">{t.formTitle}</h2>
            <p className="text-[#57749A] text-sm">{t.formSubtitle}</p>
          </div>
          <form onSubmit={handleSubmit} className="bg-[#FEFCF8] rounded-2xl border border-[#F5EDE0] p-6 lg:p-10 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div><label className="block text-sm font-medium text-[#1A2740] mb-1.5">{t.name} *</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-[#1A2740] mb-1.5">{t.email} *</label><input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputCls} /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div><label className="block text-sm font-medium text-[#1A2740] mb-1.5">{t.phone} *</label><input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-[#1A2740] mb-1.5">{t.nationality} *</label><input type="text" required value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} className={inputCls} /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div><label className="block text-sm font-medium text-[#1A2740] mb-1.5">{t.experience} *</label>
                <select required value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className={`${inputCls} bg-white`}>
                  <option value="">{locale === 'ja' ? '選択' : 'Selecione'}</option>
                  <option value="5-7">{locale === 'ja' ? '5〜7年' : '5-7 anos'}</option>
                  <option value="8-10">{locale === 'ja' ? '8〜10年' : '8-10 anos'}</option>
                  <option value="10+">{locale === 'ja' ? '10年以上' : '10+ anos'}</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium text-[#1A2740] mb-1.5">{t.currentLocation} *</label><input type="text" required value={formData.currentLocation} onChange={e => setFormData({...formData, currentLocation: e.target.value})} className={inputCls} /></div>
            </div>
            <div><label className="block text-sm font-medium text-[#1A2740] mb-1.5">{t.message}</label><textarea rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className={`${inputCls} resize-none`} /></div>
            <button type="submit" disabled={sending}
              className="w-full flex items-center justify-center gap-2 bg-[#D4972A] hover:bg-[#B87A20] text-white py-3.5 rounded-full font-semibold text-sm transition-all disabled:opacity-100">
              {sending ? t.sending : <><Send className="h-4 w-4" /> {t.send}</>}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-[#8099B8] text-sm mb-3">{t.phoneContact}</p>
            <div className="inline-flex items-center gap-4 bg-[#FEFCF8] border border-[#F5EDE0] rounded-xl px-5 py-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#D4972A]" />
                <span className="text-lg font-bold text-[#1A2740]">053-570-2555</span>
              </div>
              <div className="text-xs text-[#8099B8]"><Clock className="h-3 w-3 inline mr-1" />{locale === 'ja' ? '月〜金 10:00〜17:00' : 'Seg-Sex 10:00-17:00'}</div>
              <a href="tel:053-570-2555" className="px-4 py-2 bg-[#D4972A] text-white text-sm font-semibold rounded-full hover:bg-[#B87A20] transition">{t.phoneCta}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}