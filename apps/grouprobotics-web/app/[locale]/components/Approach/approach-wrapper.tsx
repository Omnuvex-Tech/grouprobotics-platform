import { Approach as ApproachUI } from '@repo/ui';
import { getDictionary } from '@/lib/i18n';

export function Approach({ locale }: { locale: string }) {
  const t = getDictionary(locale);

  return (
    <ApproachUI
      badge={t.approach.badge}
      title={t.approach.title}
      paragraph={t.approach.paragraph}
      highlight={t.approach.highlight}
      quote={t.approach.quote}
    />
  );
}