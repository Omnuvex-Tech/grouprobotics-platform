'use client';

import { motion } from 'framer-motion';
import styles from '../../styles/HeroCtaButton/heroCtaButton.module.css';

export interface HeroCtaButtonProps {
  label: string;
  href?: string;
  variant: 'hero' | 'navbar';
}

export function HeroCtaButton({ label, href = '#contact', variant }: HeroCtaButtonProps) {
  return (
    <motion.a
      layoutId="cta-button"
      href={href}
      className={variant === 'navbar' ? styles.navbarVariant : styles.heroVariant}
      transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.9 }}
    >
      {label}
    </motion.a>
  );
}

export function StaticCtaButton({ label, href = '#contact' }: { label: string; href?: string }) {
  return (
    <a href={href} className={styles.heroVariant}>
      {label}
    </a>
  );
}