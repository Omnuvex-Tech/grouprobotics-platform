import { Approach as ApproachUI } from '@repo/ui';
import { getApproach } from '@/lib/api';

export async function Approach({ locale }: { locale: string }) {
  const data = await getApproach();
  const lang = (locale in data.title ? locale : 'az') as keyof typeof data.title;

  return (
    <ApproachUI
      badge={data.badge[lang]}
      title={data.title[lang]}
      paragraph={data.paragraph[lang]}
      highlight={data.highlight[lang]}
      quote={data.quote[lang]}
    />
  );
}