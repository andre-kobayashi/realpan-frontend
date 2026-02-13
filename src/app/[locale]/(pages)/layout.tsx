import { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';

type Props = {
  children: ReactNode;
};

export default function PageLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/*
        pt-14   = altura do mobile header (56px)
        lg:pt-[148px] = altura total do desktop header (top bar 36 + main 64 + product nav 44)
      */}
      <main className="flex-1 pt-14 lg:pt-[148px]">
        {children}
      </main>

      <Footer />

      {/* Bottom nav: visível só em mobile, empurra conteúdo com pb-16 */}
      <BottomNav />
    </div>
  );
}
