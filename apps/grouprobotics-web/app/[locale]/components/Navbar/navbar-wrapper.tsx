'use client';

import { Navbar as NavbarUI, HeroCtaButton, StaticCtaButton } from '@repo/ui';
import { LanguageSwitcher } from '@/app/[locale]/components/LanguageSwitcher/language-switcher';
import type { NavbarData } from '@/lib/api';
import { useHeroCta } from '../../hero-cta-context';

export function Navbar({
  locale,
  ctaLabel,
  navbarData,
}: {
  locale: string;
  ctaLabel: string;
  navbarData: NavbarData;
}) {
  const { isHeroCtaInNavbar } = useHeroCta();

  const lang = (locale in (navbarData.links[0]?.label ?? {}) ? locale : 'az') as 'az' | 'en' | 'ru';

  const navLinks = navbarData.links.map((link) => ({
    label: link.label[lang] || link.label.az,
    href: link.href,
  }));

  return (
    <NavbarUI
      navLinks={navLinks}
      logoSrc={navbarData.logo}
      languageSwitcher={<LanguageSwitcher locale={locale} />}
      mobileLanguageSwitcher={<LanguageSwitcher locale={locale} variant="mobile" />}
      cta={isHeroCtaInNavbar && <HeroCtaButton label={ctaLabel} variant="navbar" />}
      mobileCta={<StaticCtaButton label={ctaLabel} href="#contact" />}
    />
  );
}