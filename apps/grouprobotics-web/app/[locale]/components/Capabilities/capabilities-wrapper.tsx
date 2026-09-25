import { Capabilities as CapabilitiesUI, type CapabilityItem } from '@repo/ui';
import { getCapabilities } from '@/lib/api';

const FALLBACK_IMAGE = '/images/capabilities1.png';

export async function Capabilities({ locale }: { locale: string }) {
  const data = await getCapabilities();
  const lang = (locale in data.title ? locale : 'az') as keyof typeof data.title;

  const items: CapabilityItem[] = data.cards.map((card) => ({
    image: card.image || FALLBACK_IMAGE,
    title: card.title[lang],
    description: card.description[lang],
  }));

  return <CapabilitiesUI badge={data.badge[lang]} title={data.title[lang]} items={items} />;
}