import { Navbar as NavbarUI } from '@repo/ui';
import { LanguageSwitcher } from '@/app/[locale]/components/LanguageSwitcher/language-switcher';
import { getDictionary } from '@/lib/i18n';

export function Navbar({ locale }: { locale: string }) {
  const t = getDictionary(locale);

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
    />
  );
}