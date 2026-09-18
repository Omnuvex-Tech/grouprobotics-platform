'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { LayoutGroup } from 'framer-motion';

interface HeroCtaContextValue {
  isHeroCtaInNavbar: boolean;
  setIsHeroCtaInNavbar: (value: boolean) => void;
}

const HeroCtaContext = createContext<HeroCtaContextValue | null>(null);

export function HeroCtaProvider({ children }: { children: ReactNode }) {
  const [isHeroCtaInNavbar, setIsHeroCtaInNavbar] = useState(false);

  return (
    <HeroCtaContext.Provider value={{ isHeroCtaInNavbar, setIsHeroCtaInNavbar }}>
      <LayoutGroup id="hero-cta">{children}</LayoutGroup>
    </HeroCtaContext.Provider>
  );
}

export function useHeroCta() {
  const ctx = useContext(HeroCtaContext);
  if (!ctx) {
    throw new Error('useHeroCta must be used within HeroCtaProvider');
  }
  return ctx;
}