import {
  HeroSection,
  AboutSection,
  QualitySection,
  ServicesSection,
  ProductsSection,
  OrderGuideSection,
  ContactSection
} from '@/components/home';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <QualitySection />
      <ServicesSection />
      <ProductsSection />
      <OrderGuideSection />
      <ContactSection />
    </>
  );
}