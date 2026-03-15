import { redirect } from 'next/navigation';

export default function OrderBusinessPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/products`);
}