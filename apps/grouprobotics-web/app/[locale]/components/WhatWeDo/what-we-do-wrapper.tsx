import { WhatWeDo as WhatWeDoUI, type WhatWeDoItem } from '@repo/ui';
import { getWhatWeDo } from '@/lib/api';

export async function WhatWeDo({ locale }: { locale: string }) {
  const data = await getWhatWeDo();
  const lang = (locale in data.title ? locale : 'az') as keyof typeof data.title;

  const items: WhatWeDoItem[] = data.items.map((item, index) => ({
    number: String(index + 1).padStart(2, '0'),
    image: item.image || '/images/wwd1.jpg',
    label: item.label[lang],
    title: item.label[lang],
    description: item.description[lang],
  }));
  return <WhatWeDoUI badge={data.badge[lang]} title={data.title[lang]} items={items} />;
}