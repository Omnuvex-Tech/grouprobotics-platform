'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { Connect as ConnectUI, HeroCtaButton } from '@repo/ui';
import { getDictionary } from '@/lib/i18n';
import { useHeroCta } from '../../hero-cta-context';

export function Connect({ locale }: { locale: string }) {
  const t = getDictionary(locale);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isHeroCtaInNavbar, setIsHeroCtaInNavbar } = useHeroCta();

  const isHeroInView = useInView(sectionRef, { amount: 0.4 });

  useEffect(() => {
    setIsHeroCtaInNavbar(!isHeroInView);
  }, [isHeroInView, setIsHeroCtaInNavbar]);

  return (
    <div ref={sectionRef}>
      <ConnectUI
        title={t.connect.title}
        description={t.connect.description}
        cta={!isHeroCtaInNavbar && <HeroCtaButton label={t.connect.cta} variant="hero" />}
      />
    </div>
  );
}