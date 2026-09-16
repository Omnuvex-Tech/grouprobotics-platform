import { Footer as FooterUI } from '@repo/ui';
import { getDictionary } from '@/lib/i18n';

export function Footer({ locale }: { locale: string }) {
  const t = getDictionary(locale);
  const year = new Date().getFullYear();

  return (
    <FooterUI
      brandName={t.footer.brandName}
      brandCountry={t.footer.brandCountry}
      tagline={t.footer.tagline}
      domain={t.footer.domain}
      phone={t.footer.phone}
      navLinks={[
        { label: t.navbar.navLinks.about, href: '#about' },
        { label: t.navbar.navLinks.capabilities, href: '#capabilities' },
        { label: t.navbar.navLinks.technologies, href: '#technologies' },
        { label: t.navbar.navLinks.industries, href: '#industries' },
        { label: t.navbar.navLinks.partners, href: '#partners' },
        { label: t.footer.contact, href: '#contact' },
      ]}
      copyright={t.footer.copyright.replace('{year}', String(year))}
      privacyLabel={t.footer.privacy}
      privacyHref="/privacy"
    />
  );
}