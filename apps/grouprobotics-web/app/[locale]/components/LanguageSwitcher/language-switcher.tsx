'use client';

import { useRouter, usePathname } from 'next/navigation';
import { LanguageSwitcher as LanguageSwitcherUI } from '@repo/ui';
import { LOCALES, DEFAULT_LOCALE } from '@/lib/i18n';

const LANGUAGE_LABELS: Record<string, string> = {
  az: 'Azərbaycan',
  en: 'English',
  ru: 'Русский',
};

const LanguageSwitcher = ({
  locale,
  variant = 'dropdown',
}: {
  locale: string;
  variant?: 'dropdown' | 'inline' | 'mobile';
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    const pathWithoutLocale =
      locale !== DEFAULT_LOCALE && pathname.startsWith(`/${locale}`)
        ? pathname.slice(`/${locale}`.length) || '/'
        : pathname || '/';

    const target =
      newLocale === DEFAULT_LOCALE
        ? pathWithoutLocale
        : `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

    router.push(target);
  };

  return (
    <LanguageSwitcherUI
      locales={LOCALES}
      activeLocale={locale}
      onLocaleChange={handleLocaleChange}
      variant={variant}
      labels={LANGUAGE_LABELS}
    />
  );
};

export { LanguageSwitcher };