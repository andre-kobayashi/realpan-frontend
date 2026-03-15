import type { Metadata } from 'next';
import FeatureClient from './FeatureClient';

export const metadata: Metadata = {
  title: 'Nosso Compromisso com a Qualidade | Realpan',
  description:
    'Conheça o compromisso da Realpan com qualidade, tradição e excelência na distribuição de pães japoneses premium.',
  openGraph: {
    title: 'Nosso Compromisso com a Qualidade | Realpan',
    description:
      'Qualidade, tradição e excelência em cada produto Realpan.',
    images: ['/og.png'],
  },
};

export default function FeaturePage() {
  return <FeatureClient />;
}