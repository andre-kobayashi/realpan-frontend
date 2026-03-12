import { Suspense } from 'react';
import CheckoutClient from './CheckoutClient';
export const dynamic = 'force-dynamic';
export default function Page() {
  return <Suspense fallback={<div className="min-h-screen" />}><CheckoutClient /></Suspense>;
}
