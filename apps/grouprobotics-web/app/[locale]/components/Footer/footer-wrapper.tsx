import { Footer as FooterUI } from '@repo/ui';
import { getFooter, getNavbar } from '@/lib/api';

const POWERED_BY_LABEL: Record<string, string> = {
  // az: 'Tərəfindən hazırlanıb',
  az: 'Powered by',
  en: 'Powered by',
  ru: 'Разработано',
};

const CONTACT_LABEL: Record<string, string> = {
  az: 'Əlaqə',
  en: 'Contact',
  ru: 'Контакты',
};

export async function Footer({ locale }: { locale: string }) {
  const [footerData, navbarData] = await Promise.all([getFooter(), getNavbar()]);
  const lang = (locale in footerData.companyName ? locale : 'az') as keyof typeof footerData.companyName;

  const poweredByLabel = POWERED_BY_LABEL[lang] ?? POWERED_BY_LABEL.en ?? 'Powered by';
  const contactLabel = CONTACT_LABEL[lang] ?? CONTACT_LABEL.en ?? 'Contact';

  const navLinks = [
    ...navbarData.links.map((link) => ({
      label: (link.label[lang] || link.label.az) ?? '',
      href: link.href,
    })),
    { label: contactLabel, href: '#contact' },
  ];

  return (
    <FooterUI
      brandName={footerData.companyName[lang]}
      brandCountry={footerData.location[lang]}
      tagline={footerData.tagline[lang]}
      domain={footerData.websiteUrl}
      phone={footerData.phone}
      poweredByLabel={poweredByLabel} navLinks={navLinks}
      copyright={footerData.copyrightLine[lang]}
      logoSrc={footerData.logo}
    />
  );
}