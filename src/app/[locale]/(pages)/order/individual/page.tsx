import { redirect } from 'next/navigation';

export default function OrderIndividualPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/products`);
}