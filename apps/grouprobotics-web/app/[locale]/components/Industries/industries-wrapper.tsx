import { Industries as IndustriesUI } from '@repo/ui';
import { getDictionary } from '@/lib/i18n';

export function Industries({ locale }: { locale: string }) {
  const t = getDictionary(locale);

  return (
    <IndustriesUI
      badge={t.industries.badge}
      title={t.industries.title}
      rowOne={t.industries.rowOne}
      rowTwo={t.industries.rowTwo}
    />
  );
}