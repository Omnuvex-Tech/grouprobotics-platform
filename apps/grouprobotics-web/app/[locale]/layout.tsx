import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from './components/Navbar/navbar-wrapper';
import { isValidLocale, LOCALES } from '@/lib/i18n';
import { Footer } from './components/Footer/footer-wrapper';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <>
      <Navbar locale={locale} />
      <main>{children}</main>
      <Footer locale={locale}/>
    </>
  );
}