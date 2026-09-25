import { Market as MarketUI, type MarketItem } from '@repo/ui';
import { getMarket } from '@/lib/api';

export async function Market({ locale }: { locale: string }) {
  const data = await getMarket();
  const lang = (locale in data.title ? locale : 'az') as keyof typeof data.title;

  const items: MarketItem[] = data.pills.map((pill, index) => ({
    number: String(index + 1).padStart(2, '0'),
    label: pill.label[lang],
  }));

  const half = Math.ceil(items.length / 2);
  const rowOne = items.slice(0, half);
  const rowTwo = items.slice(half);

  return (
    <MarketUI
      badge={data.badge[lang]}
      title={data.title[lang]}
      rowOne={rowOne}
      rowTwo={rowTwo}
    />
  );
}