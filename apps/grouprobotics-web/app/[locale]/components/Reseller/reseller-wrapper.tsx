import { Reseller as ResellerUI, type ResellerItem } from '@repo/ui';
import { getDictionary } from '@/lib/i18n';

const ICONS = [
  '/images/reseller1.svg',
  '/images/reseller2.svg',
  '/images/reseller3.svg',
  '/images/reseller4.svg',
];

export function Reseller({ locale }: { locale: string }) {
  const t = getDictionary(locale);

  const items: ResellerItem[] = t.reseller.items.map((item, index) => ({
    icon: ICONS[index] ?? ICONS[0]!,
    title: item.title,
    description: item.description,
  }));

  return (
    <ResellerUI
      badge={t.reseller.badge}
      titleLineOne={t.reseller.titleLineOne}
      titleLineTwo={t.reseller.titleLineTwo}
      items={items}
    />
  );
}