import { Contact as ContactUI } from '@repo/ui';
import { getContact } from '@/lib/api';

export async function Contact({ locale }: { locale: string }) {
  const data = await getContact();
  const lang = (locale in data.title ? locale : 'az') as keyof typeof data.title;

  const interestOptions = data.options.map((opt) => ({
    value: String(opt.id),
    label: opt.label[lang],
  }));

  return (
    <ContactUI
      badge={data.badge[lang]}
      title={data.title[lang]}
      description={data.description[lang]}
      labels={{
        name: data.nameLabel[lang],
        namePlaceholder: data.namePlaceholder[lang],
        phone: data.phoneLabel[lang],
        phonePlaceholder: data.phonePlaceholder[lang],
        company: data.companyLabel[lang],
        companyPlaceholder: data.companyPlaceholder[lang],
        email: data.emailLabel[lang],
        emailPlaceholder: data.emailPlaceholder[lang],
        interest: data.interestLabel[lang],
        interestPlaceholder: data.interestPlaceholder[lang],
        message: data.messageLabel[lang],
        messagePlaceholder: data.messagePlaceholder[lang],
        send: data.sendLabel[lang],
      }}
      interestOptions={interestOptions}
    />
  );
}