import { Industries as IndustriesUI, type IndustryItem } from '@repo/ui';
import { getIndustries } from '@/lib/api';

export async function Industries({ locale }: { locale: string }) {
  const data = await getIndustries();
  const lang = (locale in data.title ? locale : 'az') as keyof typeof data.title;

  const items: IndustryItem[] = data.tags.map((tag) => ({
    emoji: tag.icon,
    label: tag.label[lang],
  }));

  const half = Math.ceil(items.length / 2);
  const rowOne = items.slice(0, half);
  const rowTwo = items.slice(half);

  return (
    <IndustriesUI
      badge={data.badge[lang]}
      title={data.title[lang]}
      rowOne={rowOne}
      rowTwo={rowTwo}
    />
  );
}