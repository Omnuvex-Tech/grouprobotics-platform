'use client';

import { Navbar as NavbarUI, HeroCtaButton } from '@repo/ui';
import { LanguageSwitcher } from '@/app/[locale]/components/LanguageSwitcher/language-switcher';
import { getDictionary } from '@/lib/i18n';
import { useHeroCta } from '../../hero-cta-context';

export function Navbar({ locale }: { locale: string }) {
  const t = getDictionary(locale);
  const { isHeroCtaInNavbar } = useHeroCta();

  const navLinks = [
    { label: t.navbar.navLinks.about, href: '#about' },
    { label: t.navbar.navLinks.capabilities, href: '#capabilities' },
    { label: t.navbar.navLinks.technologies, href: '#technologies' },
    { label: t.navbar.navLinks.industries, href: '#industries' },
    { label: t.navbar.navLinks.partners, href: '#partners' },
  ];

  return (
    <NavbarUI
      navLinks={navLinks}
      languageSwitcher={<LanguageSwitcher locale={locale} />}
      mobileLanguageSwitcher={<LanguageSwitcher locale={locale} variant="inline" />}
      cta={isHeroCtaInNavbar && <HeroCtaButton label={t.connect.cta} variant="navbar" />}
    />
  );
}