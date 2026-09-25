import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from './components/Navbar/navbar-wrapper';
import { getConnect, getNavbar } from '@/lib/api';
import { Footer } from './components/Footer/footer-wrapper';
import { HeroCtaProvider } from './hero-cta-context';
import { isValidLocale, LOCALES } from '@/lib/i18n';
import { project } from '@/config/project';

export const metadata: Metadata = {
  title: {
    default: project.projectName,
    template: `%s | ${project.projectName}`,
  },
  description: project.projectDescription,
  keywords: project.keywords,
};

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

  const [connectData, navbarData] = await Promise.all([getConnect(), getNavbar()]);
  const lang = (locale in connectData.cta ? locale : 'az') as keyof typeof connectData.cta;
  const ctaLabel = connectData.cta[lang];

  return (
    <HeroCtaProvider>
      <Navbar locale={locale} ctaLabel={ctaLabel} navbarData={navbarData} />
      <main>{children}</main>
      <Footer locale={locale} />
    </HeroCtaProvider>
  );
}