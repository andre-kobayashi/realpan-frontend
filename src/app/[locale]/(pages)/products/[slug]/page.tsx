import { Suspense } from 'react';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProductDetailClient />
    </Suspense>
  );
}
