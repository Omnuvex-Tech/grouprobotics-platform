'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
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
  poweredByLabel: string;
  poweredByHref?: string;
  navLinks: FooterLinkItem[];
  copyright: string;
  logoSrc?: string | null;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

export function FooterUI({
  brandName,
  brandCountry,
  tagline,
  domain,
  phone,
  poweredByLabel,
  poweredByHref = 'https://omnuvex.net',
  navLinks,
  copyright,
  logoSrc,
}: FooterProps) {
  return (
    <footer className={styles.footer} style={{ overflow: 'hidden' }}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={itemVariants}
            transition={{ delay: 0.05 }}
          >
            <Link href="/" className={styles.brand}>
            <Image
                src={logoSrc || '/images/Logo.svg'}
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
          </motion.div>

          <motion.p
            className={styles.tagline}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={itemVariants}
            transition={{ delay: 0.15 }}
          >
            {tagline}
          </motion.p>

          <motion.div
            className={styles.contact}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={itemVariants}
            transition={{ delay: 0.25 }}
          >
            <span className={styles.domain}>{domain}</span>
            <span className={styles.phone}>{phone}</span>
          </motion.div>
        </div>

        <motion.div
          className={styles.divider}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={itemVariants}
          transition={{ delay: 0.3 }}
        />

        <div className={styles.bottom}>
          <nav className={styles.nav}>
            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                className={styles.navLink}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={itemVariants}
                transition={{ delay: 0.35 + index * 0.08 }}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          <motion.div
            className={styles.legal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={itemVariants}
            transition={{ delay: 0.5 }}
          >
            <span className={styles.copyright}>{copyright}</span>
          </motion.div>
        </div>

        <motion.a
          href={poweredByHref}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.powered}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={itemVariants}
          transition={{ delay: 0.55 }}
        >
        
          <span className={styles.poweredText}>{poweredByLabel}</span>
            <span className={styles.poweredBadge}>
            <Image
              src="/images/omnuvex.svg"
              alt="Omnuvex"
              width={30}
              height={30}
              className={styles.poweredLogo}
            />
          </span>
        </motion.a>
      </div>
    </footer>
  );
}