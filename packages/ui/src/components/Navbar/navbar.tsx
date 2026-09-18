'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../../styles/Navbar/navbar.module.css';

export interface NavLinkItem {
  label: string;
  href: string;
  target?: string;
}

interface NavbarUIProps {
  navLinks: NavLinkItem[];
  languageSwitcher: ReactNode;
  mobileLanguageSwitcher: ReactNode;
  cta?: ReactNode;
}

export function NavbarUI({
  navLinks,
  languageSwitcher,
  mobileLanguageSwitcher,
  cta
}: NavbarUIProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <Image
            src="/images/Logo.svg"
            alt="Logo"
            width={100}
            height={32}
            className={styles.logoImage}
            priority
          />
        </Link>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${isActive(link.href) ? styles.navLinkActive : ''
                    }`}
                  target={link.target}
                  rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.actions}>
        
          <span className={styles.languageSwitcherWrap}>{languageSwitcher}</span>
            {cta}
        </div>

        <button
          type="button"
          className={styles.burger}
          aria-label="Menyunu aç"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
            <path
              d="M1 1H17M1 7H17M1 13H17"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className={`${styles.mobileOverlay} ${isMenuOpen ? styles.mobileOverlayOpen : ''}`}>
        <div className={styles.mobileHeader}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <Image src="/images/logo.svg" alt="Logo" width={100} height={32} className={styles.logoImage} />
          </Link>

          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Menyunu bağla"
            onClick={closeMenu}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 4L16 16M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav className={styles.mobileNavArea}>
          <ul className={styles.mobileNavList}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={styles.mobileNavLink}
                  target={link.target}
                  rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.mobileLangRow}>{mobileLanguageSwitcher}</div>
      </div>
    </header>
  );
}