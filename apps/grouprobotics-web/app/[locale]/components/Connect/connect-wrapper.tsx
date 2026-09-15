import { Connect as ConnectUI } from '@repo/ui';
import { getDictionary } from '@/lib/i18n';

export function Connect({ locale }: { locale: string }) {
  const t = getDictionary(locale);

  return (
    <ConnectUI
      title={t.connect.title}
      description={t.connect.description}
      ctaLabel={t.connect.cta}
    />
  );
}