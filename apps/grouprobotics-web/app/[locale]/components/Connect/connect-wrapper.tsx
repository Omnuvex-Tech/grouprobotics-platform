'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { Connect as ConnectUI, HeroCtaButton } from '@repo/ui';
import type { ConnectData } from '@/lib/api';
import { useHeroCta } from '../../hero-cta-context';

export function Connect({ data, locale }: { data: ConnectData; locale: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isHeroCtaInNavbar, setIsHeroCtaInNavbar } = useHeroCta();

  const isHeroInView = useInView(sectionRef, { amount: 0.4 });

  useEffect(() => {
    setIsHeroCtaInNavbar(!isHeroInView);
  }, [isHeroInView, setIsHeroCtaInNavbar]);

  const lang = (locale in data.title ? locale : 'az') as keyof typeof data.title;

  return (
    <div ref={sectionRef}>
      <ConnectUI
        title={data.title[lang]}
        description={data.description[lang]}
        bgColor={data.bgColor}
        imageLeft={data.imageLeft}
        imageRight={data.imageRight}
        cta={
          !isHeroCtaInNavbar && (
            <HeroCtaButton label={data.cta[lang]} variant="hero" />
          )
        }
      />
    </div>
  );
}