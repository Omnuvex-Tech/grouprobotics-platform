import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/i18n';
import { Connect } from './components/Connect/connect-wrapper';
import { Approach } from './components/Approach/approach-wrapper';
import { WhatWeDo } from './components/WhatWeDo/what-we-do-wrapper';
import { Capabilities } from './components/Capabilities/capabilities-wrapper';
import { Industries } from './components/Industries/industries-wrapper';
import { Reseller } from './components/Reseller/reseller-wrapper';

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
      <Connect      locale={locale} />
      <Approach     locale={locale} />
      <WhatWeDo     locale={locale} />
      <Capabilities locale={locale} />
      <Industries   locale={locale}/>
      <Reseller     locale={locale}/>


    </>
  );
}