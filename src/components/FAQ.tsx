'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useLocale } from 'next-intl';

type FAQItem = {
  question: string;
  answer: string;
};

export function FAQ() {
  const locale = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = locale === 'ja' ? [
    {
      question: 'いつ届きますか？（配送日数）',
      answer: 'ご注文確定後、3〜5営業日以内に発送いたします。お届け先のエリアによって異なりますが、通常は発送から2〜3日でお届けとなります。'
    },
    {
      question: '注文完了メールが届きません。',
      answer: '迷惑メールフォルダをご確認ください。それでも見つからない場合は、ご登録のメールアドレスが正しいかご確認の上、お問い合わせください。'
    },
    {
      question: '領収書が必要です。',
      answer: 'マイページの注文履歴から領収書を発行できます。PDFでダウンロード可能です。'
    },
    {
      question: 'お届け先を変更できますか？',
      answer: '発送前であれば変更可能です。マイページまたはお問い合わせフォームよりご連絡ください。'
    }
  ] : [
    {
      question: 'Quando chega meu pedido?',
      answer: 'Após confirmação do pedido, enviamos em 3-5 dias úteis. A entrega geralmente leva 2-3 dias após o envio.'
    },
    {
      question: 'Não recebi o email de confirmação.',
      answer: 'Verifique sua caixa de spam. Se não encontrar, confirme seu email e entre em contato conosco.'
    },
    {
      question: 'Preciso de nota fiscal.',
      answer: 'Você pode gerar a nota fiscal na seção "Meus Pedidos" da sua conta. Download em PDF disponível.'
    },
    {
      question: 'Posso alterar o endereço de entrega?',
      answer: 'Sim, se ainda não foi enviado. Entre em contato conosco através do formulário ou da sua conta.'
    }
  ];

  return (
    <section className="py-16 bg-[#FAF7F2]">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm mb-4">
            FAQ
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-gray-900">
            {locale === 'ja' ? 'よく見られているご質問' : 'Perguntas Frequentes'}
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">Q</span>
                  </div>
                  <span className="text-gray-900 font-medium pt-2">{faq.question}</span>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-orange-600" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              {/* Answer */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5 pl-20">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA mais perguntas */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            {locale === 'ja' ? '他にご質問がありますか？' : 'Tem outras dúvidas?'}
          </p>
          <a
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            {locale === 'ja' ? 'お問い合わせ' : 'Entre em contato'}
          </a>
        </div>
      </div>
    </section>
  );
}