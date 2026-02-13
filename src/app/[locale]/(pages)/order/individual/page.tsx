'use client';
import { useLocale } from 'next-intl';

export default function OrderIndividualPage() {
  const locale = useLocale();
  return (
    <div className="flex flex-col">
      <section className="bg-primary-800 py-24 text-center text-white">
        <p className="text-accent-400 text-sm font-semibold tracking-widest uppercase mb-3">
          {locale === 'pt' ? 'Pessoa Física' : '個人向け注文'}
        </p>
        <h1 className="heading-1">
          {locale === 'pt' ? 'Pedido Individual' : '個人注文フォーム'}
        </h1>
      </section>
      <section className="py-20 container-custom text-center text-neutral-500">
        <p>{locale === 'pt' ? 'Formulário em breve.' : '準備中です。'}</p>
      </section>
    </div>
  );
}
