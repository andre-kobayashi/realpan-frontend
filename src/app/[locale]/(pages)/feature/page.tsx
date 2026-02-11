import type { Metadata } from 'next';
import FeatureClient from './FeatureClient';

export const metadata: Metadata = {
  title: 'Nosso Compromisso com a Qualidade | Real Pan',
  description:
    'Conheça o compromisso da Real Pan com qualidade, tradição e excelência na distribuição de pães japoneses premium.',
  openGraph: {
    title: 'Nosso Compromisso com a Qualidade | Real Pan',
    description:
      'Qualidade, tradição e excelência em cada produto Real Pan.',
    images: ['/og.png'],
  },
};

export default function FeaturePage() {
  return <FeatureClient />;
}