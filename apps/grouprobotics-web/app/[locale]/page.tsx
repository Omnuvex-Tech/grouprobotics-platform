import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/i18n';
import { getConnect } from '@/lib/api';
import { Connect } from './components/Connect/connect-wrapper';
import { Approach } from './components/Approach/approach-wrapper';
import { WhatWeDo } from './components/WhatWeDo/what-we-do-wrapper';
import { Capabilities } from './components/Capabilities/capabilities-wrapper';
import { Industries } from './components/Industries/industries-wrapper';
import { Reseller } from './components/Reseller/reseller-wrapper';
import { ProblemSolution } from './components/ProblemSolution/problem-solution-wrapper';
import { Market } from './components/Market/market-wrapper';
import { Contact } from './components/Contact/contact-wrapper';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const connectData = await getConnect();

  return (
    <>
      <Connect          data={connectData} locale={locale} />
      <Approach         locale={locale} />
      <WhatWeDo         locale={locale} />
      <Capabilities     locale={locale} />
      <Industries       locale={locale} />
      <Reseller         locale={locale} />
      <ProblemSolution  locale={locale} />
      <Market           locale={locale} />
      <Contact          locale={locale} />


    </>
  );
}