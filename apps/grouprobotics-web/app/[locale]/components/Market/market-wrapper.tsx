import { Market as MarketUI } from '@repo/ui';
import { getDictionary } from '@/lib/i18n';

export function Market({ locale }: { locale: string }) {
  const t = getDictionary(locale);

  return (
    <MarketUI
      badge={t.market.badge}
      title={t.market.title}
      rowOne={t.market.rowOne}
      rowTwo={t.market.rowTwo}
    />
  );
}