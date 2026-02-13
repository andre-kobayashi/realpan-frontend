import {
  HeroSection,
  FlashDealsSection,
  AboutSection,
  ProductsSection,
  QualitySection,
  ServicesSection,
  OrderGuideSection,
} from '@/components/home';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FlashDealsSection />
      <AboutSection />
      <ProductsSection />
      <QualitySection />
      <ServicesSection />
      <OrderGuideSection />
    </>
  );
}
