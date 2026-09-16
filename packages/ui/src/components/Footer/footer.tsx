import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/Footer/footer.module.css';

export interface FooterLinkItem {
  label: string;
  href: string;
}

export interface FooterProps {
  brandName: string;
  brandCountry: string;
  tagline: string;
  domain: string;
  phone: string;
  navLinks: FooterLinkItem[];
  copyright: string;
  privacyLabel: string;
  privacyHref: string;
}

export function FooterUI({
  brandName,
  brandCountry,
  tagline,
  domain,
  phone,
  navLinks,
  copyright,
  privacyLabel,
  privacyHref,
}: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <Link href="/" className={styles.brand}>
            <Image
              src="/images/logo.svg"
              alt={brandName}
              width={36}
              height={36}
              className={styles.brandLogo}
            />
            <span className={styles.brandText}>
              <span className={styles.brandName}>{brandName}</span>
              <span className={styles.brandCountry}>{brandCountry}</span>
            </span>
          </Link>

          <p className={styles.tagline}>{tagline}</p>

          <div className={styles.contact}>
            <span className={styles.domain}>{domain}</span>
            <span className={styles.phone}>{phone}</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <nav className={styles.nav}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className={styles.legal}>
            <span className={styles.copyright}>{copyright}</span>
            <a href={privacyHref} className={styles.privacyLink}>
              {privacyLabel}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}