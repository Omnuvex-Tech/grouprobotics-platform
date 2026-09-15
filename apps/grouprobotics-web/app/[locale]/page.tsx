import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/i18n';
import { Connect } from './components/Connect/connect-wrapper';
import { Approach } from './components/Approach/approach-wrapper';
import { WhatWeDo } from './components/WhatWeDo/what-we-do-wrapper';

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
    <>
      <Connect locale={locale} />
      <Approach locale={locale} />
      <WhatWeDo locale={locale}/>


    </>
  );
}