import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/i18n';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <div style={{ padding: '48px 24px' }}>
<h1>hello world !</h1>    </div>
  );
}