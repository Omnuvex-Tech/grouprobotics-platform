import { Reseller as ResellerUI, type ResellerItem } from '@repo/ui';
import { getPartners } from '@/lib/api';
import { ICON_CATALOG } from '@/lib/icon-catalog';
import { Building2 } from 'lucide-react';
export async function Reseller({ locale }: { locale: string }) {
  const data = await getPartners();
  const lang = (locale in data.title ? locale : 'az') as keyof typeof data.title;

  const items: ResellerItem[] = data.cards.map((card) => {
    const IconComponent = ICON_CATALOG[card.icon] ?? Building2;
    return {
      icon: <IconComponent size={24} />,
      title: card.title[lang],
      description: card.description[lang],
    };
  });

  return (
    <ResellerUI
      badge={data.badge[lang]}
      title={data.title[lang]}
      items={items}
    />
  );
}