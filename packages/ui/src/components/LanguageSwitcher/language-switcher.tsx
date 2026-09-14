'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from '../../styles/LanguageSwitcher/languageSwitcher.module.css';

const flagSrc = (code: string) => `/images/${code}.svg`;

export interface LanguageSwitcherProps {
  locales: string[];
  activeLocale: string;
  onLocaleChange: (locale: string) => void;
  variant?: 'dropdown' | 'inline';
}

const LanguageSwitcher = ({
  locales,
  activeLocale,
  onLocaleChange,
  variant = 'dropdown',
}: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const otherLocales = locales.filter((code) => code !== activeLocale);

  const handleSelect = (code: string) => {
    onLocaleChange(code);
    setIsOpen(false);
  };

  if (variant === 'inline') {
    return (
      <div className={styles.inlineRow}>
        {locales.map((code) => (
          <button
            key={code}
            type="button"
            className={`${styles.inlineOption} ${
              code === activeLocale ? styles.inlineOptionActive : ''
            }`}
            onClick={() => onLocaleChange(code)}
          >
            <span className={styles.code}>{code.toUpperCase()}</span>
            <Image
              src={flagSrc(code)}
              alt=""
              width={18}
              height={18}
              className={styles.flag}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.wrapper} ref={rootRef}>
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Image
          src={flagSrc(activeLocale)}
          alt=""
          width={20}
          height={20}
          className={styles.flag}
          aria-hidden="true"
        />
        <span className={styles.code}>{activeLocale.toUpperCase()}</span>
      </button>

      {isOpen && (
        <ul className={styles.panel} role="listbox">
          {otherLocales.map((code) => (
            <li key={code} role="option" aria-selected={false}>
              <button type="button" className={styles.option} onClick={() => handleSelect(code)}>
                <Image
                  src={flagSrc(code)}
                  alt=""
                  width={20}
                  height={20}
                  className={styles.flag}
                  aria-hidden="true"
                />
                <span className={styles.code}>{code.toUpperCase()}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { LanguageSwitcher };