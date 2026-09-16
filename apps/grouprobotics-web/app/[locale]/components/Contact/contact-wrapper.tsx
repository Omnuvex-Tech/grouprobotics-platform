'use client';

import { Contact as ContactUI } from '@repo/ui';
import { getDictionary } from '@/lib/i18n';

export function Contact({ locale }: { locale: string }) {
  const t = getDictionary(locale);

  return (
    <ContactUI
      badge={t.contact.badge}
      title={t.contact.title}
      description={t.contact.description}
      labels={t.contact.labels}
      interestOptions={t.contact.interestOptions}
      onSubmit={(data) => {
        console.log('Contact form submitted:', data, locale);
      }}
    />
  );
}