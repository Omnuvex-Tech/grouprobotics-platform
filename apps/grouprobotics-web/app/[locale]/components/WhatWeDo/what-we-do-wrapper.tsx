import { WhatWeDo as WhatWeDoUI, type WhatWeDoItem } from '@repo/ui';
import { getDictionary } from '@/lib/i18n';

const NUMBERS = ['01', '02', '03', '04', '05', '06'];
const IMAGES = [
  '/images/wwd1.jpg',
  '/images/wwd2.png',
  '/images/wwd3.png',
  '/images/wwd4.png',
  '/images/wwd5.svg',
  '/images/wwd6.svg',
];

export function WhatWeDo({ locale }: { locale: string }) {
  const t = getDictionary(locale);

  const items: WhatWeDoItem[] = t.whatWeDo.items.map((item, index) => ({
    number: NUMBERS[index] ?? String(index + 1).padStart(2, '0'),
    image: IMAGES[index] ?? IMAGES[0]!,
    label: item.label,
    title: item.title,
    description: item.description,
  }));

  return <WhatWeDoUI badge={t.whatWeDo.badge} title={t.whatWeDo.title} items={items} />;
}