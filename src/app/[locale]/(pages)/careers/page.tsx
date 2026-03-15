'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Phone, Mail, MapPin, Send, CheckCircle, Briefcase, Clock, Users, Star } from 'lucide-react';
import Link from 'next/link';

export default function CareersPage() {
  const locale = useLocale() as 'pt' | 'ja';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nationality: '',
    experience: '',
    currentLocation: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const t = {
    pt: {
      heroTag: 'VAGAS ABERTAS',
      heroTitle: 'Venha trabalhar conosco!',
      heroSubtitle: 'A Real Pan está crescendo e procura profissionais apaixonados por panificação para fazer parte do nosso time.',
      aboutTitle: 'Sobre a Real Pan',
      aboutText: 'Somos uma fábrica de pães brasileiros em Hamamatsu, Shizuoka, que fornece produtos autênticos para hotéis, restaurantes, supermercados e consumidores finais em todo o Japão. Estamos expandindo nossa operação e buscamos novos talentos.',
      requireTitle: 'Requisitos',
      requirements: [
        { icon: Briefcase, text: 'Mínimo 5 anos de experiência comprovada em padaria ou confeitaria' },
        { icon: MapPin, text: 'Residir no Japão com visto de trabalho válido' },
        { icon: Users, text: 'Capacidade de trabalhar em equipe em ambiente multicultural (brasileiro/japonês)' },
        { icon: Star, text: 'Conhecimento em pães artesanais, fermentação e processos de congelamento é um diferencial' },
      ],
      benefitsTitle: 'O que oferecemos',
      benefits: ['Salário competitivo', 'Ambiente de trabalho acolhedor', 'Oportunidade de crescimento', 'Produtos frescos todos os dias 🍞'],
      formTitle: 'Envie seu currículo',
      formSubtitle: 'Preencha o formulário abaixo ou entre em contato por telefone.',
      name: 'Nome completo',
      email: 'E-mail',
      phone: 'Telefone',
      nationality: 'Nacionalidade',
      experience: 'Anos de experiência em padaria',
      currentLocation: 'Cidade onde mora atualmente',
      message: 'Conte sobre sua experiência e por que gostaria de trabalhar na Real Pan',
      send: 'Enviar candidatura',
      sending: 'Enviando...',
      successTitle: 'Candidatura enviada!',
      successText: 'Obrigado pelo seu interesse! Entraremos em contato em breve.',
      phoneContact: 'Ou ligue para nós em horário comercial:',
      phoneCta: 'Ligar agora',
    },
    ja: {
      heroTag: 'スタッフ募集',
      heroTitle: '一緒に働きませんか？',
      heroSubtitle: 'リアルパンは事業拡大に伴い、パン製造の経験をお持ちの方を募集しています。',
      aboutTitle: 'リアルパンについて',
      aboutText: '静岡県浜松市にあるブラジルパン製造工場です。ホテル、レストラン、スーパー、一般消費者へ本格的なブラジルパンを日本全国にお届けしています。事業拡大に伴い、新たな仲間を募集しています。',
      requireTitle: '応募条件',
      requirements: [
        { icon: Briefcase, text: 'パン製造または製菓の実務経験5年以上' },
        { icon: MapPin, text: '日本在住で就労可能なビザをお持ちの方' },
        { icon: Users, text: '多文化環境（ブラジル人・日本人）でのチームワークが可能な方' },
        { icon: Star, text: '手作りパン、発酵、冷凍工程の知識がある方は優遇' },
      ],
      benefitsTitle: '待遇・福利厚生',
      benefits: ['競争力のある給与', 'あたたかい職場環境', 'キャリアアップの機会', '毎日焼きたてのパンが味わえます 🍞'],
      formTitle: '応募フォーム',
      formSubtitle: '以下のフォームにご記入いただくか、お電話でお問い合わせください。',
      name: '氏名',
      email: 'メールアドレス',
      phone: '電話番号',
      nationality: '国籍',
      experience: 'パン製造の経験年数',
      currentLocation: '現在のお住まい（市区町村）',
      message: 'これまでのご経験やリアルパンで働きたい理由をお聞かせください',
      send: '応募する',
      sending: '送信中...',
      successTitle: '応募が送信されました！',
      successText: 'ご応募ありがとうございます。近日中にご連絡いたします。',
      phoneContact: '営業時間内にお電話でもお問い合わせいただけます：',
      phoneCta: '電話する',
    },
  }[locale];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      // Send via mailto (simple approach)
      const subject = encodeURIComponent(
        locale === 'ja'
          ? `【採用応募】${formData.name}様 - リアルパン求人`
          : `【Candidatura】${formData.name} - Vaga Real Pan`
      );
      const body = encodeURIComponent(
        [
          locale === 'ja' ? '--- 応募情報 ---' : '--- Dados da Candidatura ---',
          '',
          `${t.name}: ${formData.name}`,
          `${t.email}: ${formData.email}`,
          `${t.phone}: ${formData.phone}`,
          `${t.nationality}: ${formData.nationality}`,
          `${t.experience}: ${formData.experience}`,
          `${t.currentLocation}: ${formData.currentLocation}`,
          '',
          locale === 'ja' ? '--- メッセージ ---' : '--- Mensagem ---',
          formData.message,
        ].join('\n')
      );

      window.open(`mailto:e.realpan@gmail.com?subject=${subject}&body=${body}`, '_self');

      // Show success after small delay
      setTimeout(() => {
        setSent(true);
        setSending(false);
      }, 1000);
    } catch {
      setSending(false);
      alert(locale === 'ja' ? 'エラーが発生しました' : 'Erro ao enviar');
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{t.successTitle}</h1>
          <p className="text-gray-600 mb-8">{t.successText}</p>
          <Link href={`/${locale}/news`} className="btn-orange">
            {locale === 'ja' ? '新着情報に戻る' : 'Voltar às novidades'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white">

      {/* ═══════ HERO ═══════ */}
      <section className="relative bg-gradient-to-br from-red-600 to-orange-500 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-300 rounded-full blur-[80px]" />
        </div>

        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6">
            <Briefcase className="h-4 w-4" />
            {t.heroTag}
          </div>
          <h1 className="font-abril text-4xl lg:text-6xl mb-6">{t.heroTitle}</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">{t.heroSubtitle}</p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full"><path d="M0 40C480 80 960 0 1440 40V80H0V40Z" fill="#FAF7F2" /></svg>
        </div>
      </section>

      {/* ═══════ ABOUT + REQUIREMENTS ═══════ */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="container-custom max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10">
            {/* About */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.aboutTitle}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{t.aboutText}</p>

              <h3 className="text-lg font-bold text-gray-900 mb-3">{t.benefitsTitle}</h3>
              <ul className="space-y-2">
                {t.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.requireTitle}</h2>
              <div className="space-y-4">
                {t.requirements.map((req, i) => {
                  const Icon = req.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-orange-600" />
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed pt-2">{req.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FORM ═══════ */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{t.formTitle}</h2>
            <p className="text-gray-600">{t.formSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 lg:p-10 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.name} *</label>
                <input type="text" required value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.email} *</label>
                <input type="email" required value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.phone} *</label>
                <input type="tel" required value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.nationality} *</label>
                <input type="text" required value={formData.nationality}
                  onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                  placeholder={locale === 'ja' ? '例: ブラジル' : 'Ex: Brasileira'}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.experience} *</label>
                <select required value={formData.experience}
                  onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 bg-white transition">
                  <option value="">{locale === 'ja' ? '選択してください' : 'Selecione'}</option>
                  <option value="5-7">{locale === 'ja' ? '5〜7年' : '5 a 7 anos'}</option>
                  <option value="8-10">{locale === 'ja' ? '8〜10年' : '8 a 10 anos'}</option>
                  <option value="10+">{locale === 'ja' ? '10年以上' : 'Mais de 10 anos'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.currentLocation} *</label>
                <input type="text" required value={formData.currentLocation}
                  onChange={e => setFormData({ ...formData, currentLocation: e.target.value })}
                  placeholder={locale === 'ja' ? '例: 浜松市' : 'Ex: Hamamatsu'}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.message}</label>
              <textarea rows={5} value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 resize-none transition" />
            </div>

            <button type="submit" disabled={sending}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-full font-bold text-lg hover:shadow-lg hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50">
              {sending ? (
                <>{t.sending}</>
              ) : (
                <><Send className="h-5 w-5" /> {t.send}</>
              )}
            </button>
          </form>

          {/* Phone contact */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-3">{t.phoneContact}</p>
            <div className="inline-flex items-center gap-4 bg-gray-50 rounded-2xl px-6 py-4">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-orange-500" />
                <span className="text-xl font-bold text-gray-900">053-570-2555</span>
              </div>
              <div className="text-xs text-gray-400">
                <Clock className="h-3 w-3 inline mr-1" />
                {locale === 'ja' ? '月〜金 10:00〜17:00' : 'Seg-Sex 10:00-17:00'}
              </div>
              <a href="tel:053-570-2555"
                className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-full hover:bg-orange-600 transition-colors">
                {t.phoneCta}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}