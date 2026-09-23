// import { Capabilities as CapabilitiesUI, type CapabilityItem } from '@repo/ui';
// import { getDictionary } from '@/lib/i18n';

// const IMAGES = [
//   '/images/capabilities1.png',
//   '/images/capabilities2.png',
//   '/images/capabilities4.png',
//   '/images/capabilities3.png'

// ];

// export function Capabilities({ locale }: { locale: string }) {
//   const t = getDictionary(locale);

//   const items: CapabilityItem[] = t.capabilities.items.map((item, index) => ({
//     image: IMAGES[index] ?? IMAGES[0]!,
//     title: item.title,
//     description: item.description,
//   }));

//   return <CapabilitiesUI badge={t.capabilities.badge} title={t.capabilities.title} items={items} />;
// }


import { Capabilities as CapabilitiesUI, type CapabilityItem } from '@repo/ui';
import { getDictionary } from '@/lib/i18n';

const IMAGES = [
  '/images/capabilities1.png',
  '/images/capabilities2.png',
  '/images/capabilities3.png',
  '/images/capabilities4.png',
  '/images/capabilities5.jpg',
];

export function Capabilities({ locale }: { locale: string }) {
  const t = getDictionary(locale);

  const items: CapabilityItem[] = t.capabilities.items.map((item, index) => ({
    image: IMAGES[index] ?? IMAGES[0]!,
    title: item.title,
    description: item.description,
  }));

  return <CapabilitiesUI badge={t.capabilities.badge} title={t.capabilities.title} items={items} />;
}