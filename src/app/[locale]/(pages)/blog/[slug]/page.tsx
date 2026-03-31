'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Loader2, Send, CheckCircle, Phone, Clock, Briefcase, MapPin, Users, Star } from 'lucide-react';

interface BlogPost {
  id: string; slug: string; titlePt: string; titleJa: string;
  summaryPt: string; summaryJa: string; contentPt: string; contentJa: string;
  imageUrl: string; category: string; linkUrl: string; formType: string;
  published: boolean; publishedAt: string | null; createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.realpan.jp';

// Careers form component
function CareersForm({ locale }: { locale: 'pt' | 'ja' }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', nationality: '', experience: '', currentLocation: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const t = locale === 'pt' ? {
    title: 'Envie seu currículo', subtitle: 'Preencha o formulário ou ligue para nós.',
    name: 'Nome completo', email: 'E-mail', phone: 'Telefone', nationality: 'Nacionalidade',
    experience: 'Anos de experiência', city: 'Cidade atual', message: 'Mensagem',
    send: 'Enviar candidatura', sent: 'Candidatura enviada!', sentSub: 'Entraremos em contato em breve.',
    expOptions: ['Selecione', '5-7 anos', '8-10 anos', '10+ anos'],
  } : {
    title: '応募フォーム', subtitle: 'フォームに記入するか、お電話ください。',
    name: '氏名', email: 'メールアドレス', phone: '電話番号', nationality: '国籍',
    experience: '経験年数', city: '現在の居住地', message: 'メッセージ',
    send: '応募する', sent: '応募を受け付けました！', sentSub: '近日中にご連絡いたします。',
    expOptions: ['選択してください', '5-7年', '8-10年', '10年以上'],
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) return alert(locale === 'pt' ? 'Preencha nome e email' : '氏名とメールを入力してください');
    setSending(true);
    try {
      await fetch(`${API_URL}/api/email/careers`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSent(true);
    } catch { alert('Erro'); }
    finally { setSending(false); }
  };

  if (sent) return (
    <div className="text-center py-12 bg-green-50 rounded-2xl border border-green-200">
      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
      <h3 className="text-xl font-bold text-green-700">{t.sent}</h3>
      <p className="text-green-600 mt-1">{t.sentSub}</p>
    </div>
  );

  const inputCls = "w-full border border-[#F5EDE0] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4972A] focus:border-[#D4972A] outline-none bg-[#FEFCF8]";
  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold text-[#1A2740] text-center mb-2">{t.title}</h3>
      <p className="text-[#57749A] text-center mb-6">{t.subtitle}</p>
      <div className="bg-[#FEFCF8] rounded-2xl border border-[#F5EDE0] p-6 sm:p-8 space-y-4 max-w-2xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-semibold text-[#1A2740] mb-1">{t.name} *</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputCls} /></div>
          <div><label className="block text-sm font-semibold text-[#1A2740] mb-1">{t.email} *</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputCls} /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-semibold text-[#1A2740] mb-1">{t.phone}</label>
            <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputCls} /></div>
          <div><label className="block text-sm font-semibold text-[#1A2740] mb-1">{t.nationality}</label>
            <input type="text" value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} className={inputCls} /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-semibold text-[#1A2740] mb-1">{t.experience} *</label>
            <select value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className={inputCls}>
              {t.expOptions.map(o => <option key={o} value={o === t.expOptions[0] ? '' : o}>{o}</option>)}
            </select></div>
          <div><label className="block text-sm font-semibold text-[#1A2740] mb-1">{t.city} *</label>
            <input type="text" value={formData.currentLocation} onChange={e => setFormData({...formData, currentLocation: e.target.value})} className={inputCls} /></div>
        </div>
        <div><label className="block text-sm font-semibold text-[#1A2740] mb-1">{t.message}</label>
          <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={4} className={inputCls + " resize-y"} /></div>
        <button onClick={handleSubmit} disabled={sending}
          className="w-full flex items-center justify-center gap-2 bg-[#D4972A] hover:bg-[#B87A20] text-white py-3.5 rounded-full font-semibold text-sm transition-all shadow-md">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {t.send}
        </button>
      </div>
      <div className="text-center mt-6">
        <p className="text-sm text-[#8099B8] mb-3">{locale === 'pt' ? 'Ou ligue em horário comercial:' : '営業時間内にお電話ください：'}</p>
        <div className="inline-flex items-center gap-4 bg-white border border-[#F5EDE0] rounded-full px-6 py-3">
          <span className="flex items-center gap-1.5 font-bold text-[#1A2740]"><Phone className="w-4 h-4" /> 053-570-2555</span>
          <span className="text-xs text-[#8099B8] flex items-center gap-1"><Clock className="w-3 h-3" /> {locale === 'pt' ? 'Seg-Sex 10:00-17:00' : '月-金 10:00-17:00'}</span>
        </div>
      </div>
    </div>
  );
}

// Contact form component
function ContactForm({ locale }: { locale: 'pt' | 'ja' }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const t = locale === 'pt' ? {
    title: 'Entre em contato', subtitle: 'Envie sua mensagem.',
    name: 'Nome', email: 'E-mail', phone: 'Telefone', company: 'Empresa', message: 'Mensagem',
    send: 'Enviar mensagem', sent: 'Mensagem enviada!',
  } : {
    title: 'お問い合わせ', subtitle: 'メッセージを送信してください。',
    name: '氏名', email: 'メールアドレス', phone: '電話番号', company: '会社名', message: 'メッセージ',
    send: '送信する', sent: '送信しました！',
  };

  if (sent) return (
    <div className="text-center py-12 bg-green-50 rounded-2xl border border-green-200">
      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
      <h3 className="text-xl font-bold text-green-700">{t.sent}</h3>
    </div>
  );

  const inputCls = "w-full border border-[#F5EDE0] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4972A] outline-none bg-[#FEFCF8]";
  return (
    <div className="mt-10 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-[#1A2740] text-center mb-2">{t.title}</h3>
      <p className="text-[#57749A] text-center mb-6">{t.subtitle}</p>
      <div className="bg-[#FEFCF8] rounded-2xl border border-[#F5EDE0] p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-semibold text-[#1A2740] mb-1">{t.name} *</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputCls} /></div>
          <div><label className="block text-sm font-semibold text-[#1A2740] mb-1">{t.email} *</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputCls} /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-semibold text-[#1A2740] mb-1">{t.phone}</label>
            <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputCls} /></div>
          <div><label className="block text-sm font-semibold text-[#1A2740] mb-1">{t.company}</label>
            <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className={inputCls} /></div>
        </div>
        <div><label className="block text-sm font-semibold text-[#1A2740] mb-1">{t.message} *</label>
          <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={5} className={inputCls + " resize-y"} /></div>
        <button onClick={async () => {
          if (!formData.name || !formData.email || !formData.message) return;
          setSending(true);
          try { setSent(true); } finally { setSending(false); }
        }} disabled={sending}
          className="w-full flex items-center justify-center gap-2 bg-[#D4972A] hover:bg-[#B87A20] text-white py-3.5 rounded-full font-semibold text-sm">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {t.send}
        </button>
      </div>
    </div>
  );
}

export default function BlogDetailPage() {
  const locale = useLocale() as 'pt' | 'ja';
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/blog/${slug}`);
        const data = await res.json();
        if (data.success) setPost(data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    if (slug) load();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#D4972A]" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#1A2740] mb-2">{locale === 'pt' ? 'Publicação não encontrada' : '記事が見つかりません'}</h1>
        <Link href={`/${locale}/blog`} className="text-[#D4972A] text-sm hover:underline">
          {locale === 'pt' ? '← Voltar ao blog' : '← ブログに戻る'}
        </Link>
      </div>
    </div>
  );

  const title = locale === 'pt' ? post.titlePt : post.titleJa;
  const content = locale === 'pt' ? post.contentPt : post.contentJa;
  const date = post.publishedAt || post.createdAt;

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero image */}
      {post.imageUrl && (
        <div className="relative h-[300px] sm:h-[400px] bg-gray-100">
          <img src={`${API_URL}${post.imageUrl}`} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <article className="container-custom max-w-3xl py-10">
        <Link href={`/${locale}/blog`}
          className="inline-flex items-center gap-1.5 text-sm text-[#57749A] hover:text-[#D4972A] mb-6">
          <ArrowLeft className="w-4 h-4" />
          {locale === 'pt' ? 'Voltar ao blog' : 'ブログに戻る'}
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-[#8099B8] flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(date).toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'ja-JP')}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#1A2740] mb-6 leading-tight">{title}</h1>

        {content && (
          <div className="prose prose-lg max-w-none text-[#3A4F6A] leading-relaxed whitespace-pre-line">
            {content}
          </div>
        )}

        {/* Embedded form */}
        {post.formType === 'careers' && <CareersForm locale={locale} />}
        {post.formType === 'contact' && <ContactForm locale={locale} />}
        {post.formType === 'b2b' && <ContactForm locale={locale} />}
      </article>
    </div>
  );
}
