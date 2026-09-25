import { ApiClient } from "@/classes/api-client";
export const api = new ApiClient();

const API_URL = process.env.API_URL;

export interface LangValue {
  az: string;
  en: string;
  ru: string;
}

export interface ConnectData {
  title: LangValue;
  description: LangValue;
  cta: LangValue;
  bgColor: string;
  imageLeft: string | null;
  imageRight: string | null;
}

function toAbsoluteUrl(path: string | null): string | null {
  if (!path) return null;
  return `${API_URL}${path}`;
}
export async function getConnect(): Promise<ConnectData> {
  const res = await fetch(`${API_URL}/connect`, { cache: 'no-store' });
  const data = await res.json();

  return {
    ...data,
    imageLeft: toAbsoluteUrl(data.imageLeft),
    imageRight: toAbsoluteUrl(data.imageRight),
  };
}

export interface NavLinkData {
  id: number;
  label: LangValue;
  href: string;
}

export interface NavbarData {
  logo: string | null;
  links: NavLinkData[];
}

export async function getNavbar(): Promise<NavbarData> {
  const res = await fetch(`${API_URL}/navbar`, { cache: 'no-store' });
  const data = await res.json();

  return {
    logo: toAbsoluteUrl(data.logo),
    links: data.links ?? [],
  };
}

export interface ApproachData {
  badge: LangValue;
  title: LangValue;
  paragraph: LangValue;
  highlight: LangValue;
  quote: LangValue;
}

export async function getApproach(): Promise<ApproachData> {
  const res = await fetch(`${API_URL}/approach`, { cache: 'no-store' });
  return res.json();
}

export interface WhatWeDoItemData {
  id: number;
  label: LangValue;
  description: LangValue;
  image: string | null;
  order: number;
}

export interface WhatWeDoData {
  badge: LangValue;
  title: LangValue;
  items: WhatWeDoItemData[];
}

export async function getWhatWeDo(): Promise<WhatWeDoData> {
  const res = await fetch(`${API_URL}/what-we-do`, { cache: 'no-store' });
  const data = await res.json();

  return {
    ...data,
    items: (data.items ?? []).map((item: WhatWeDoItemData) => ({
      ...item,
      image: toAbsoluteUrl(item.image),
    })),
  };
}

export interface CapabilityCardData {
  id: number;
  title: LangValue;
  description: LangValue;
  image: string | null;
  order: number;
}

export interface CapabilitiesData {
  badge: LangValue;
  title: LangValue;
  cards: CapabilityCardData[];
}

export async function getCapabilities(): Promise<CapabilitiesData> {
  const res = await fetch(`${API_URL}/capabilities`, { cache: 'no-store' });
  const data = await res.json();

  return {
    ...data,
    cards: (data.cards ?? []).map((card: CapabilityCardData) => ({
      ...card,
      image: toAbsoluteUrl(card.image),
    })),
  };
}

export interface IndustryTagData {
  id: number;
  icon: string;
  label: LangValue;
  order: number;
}

export interface IndustriesData {
  badge: LangValue;
  title: LangValue;
  tags: IndustryTagData[];
}

export async function getIndustries(): Promise<IndustriesData> {
  const res = await fetch(`${API_URL}/industries`, { cache: 'no-store' });
  return res.json();
}

export interface PartnerCardData {
  id: number;
  icon: string;
  title: LangValue;
  description: LangValue;
  order: number;
}

export interface PartnersData {
  badge: LangValue;
  title: LangValue;
  cards: PartnerCardData[];
}

export async function getPartners(): Promise<PartnersData> {
  const res = await fetch(`${API_URL}/partners`, { cache: 'no-store' });
  return res.json();
}

export interface ProblemSolutionData {
  badge: LangValue;
  headline: LangValue;
  description: LangValue;
  backgroundImage: string | null;
}

export async function getProblemSolution(): Promise<ProblemSolutionData> {
  const res = await fetch(`${API_URL}/problem-solution`, { cache: 'no-store' });
  const data = await res.json();

  return {
    ...data,
    backgroundImage: toAbsoluteUrl(data.backgroundImage),
  };
}

export interface MarketPillData {
  id: number;
  label: LangValue;
  order: number;
}

export interface MarketData {
  badge: LangValue;
  title: LangValue;
  pills: MarketPillData[];
}

export async function getMarket(): Promise<MarketData> {
  const res = await fetch(`${API_URL}/market`, { cache: 'no-store' });
  return res.json();
}

export interface FooterData {
  logo: string | null;
  companyName: LangValue;
  location: LangValue;
  websiteUrl: string;
  phone: string;
  copyrightLine: LangValue;
  tagline: LangValue;
}

export async function getFooter(): Promise<FooterData> {
  const res = await fetch(`${API_URL}/footer`, { cache: 'no-store' });
  const data = await res.json();

  return {
    ...data,
    logo: toAbsoluteUrl(data.logo),
  };
}

export interface ContactOptionData {
  id: number;
  label: LangValue;
  order: number;
}

export interface ContactData {
  badge: LangValue;
  title: LangValue;
  description: LangValue;
  nameLabel: LangValue;
  namePlaceholder: LangValue;
  phoneLabel: LangValue;
  phonePlaceholder: LangValue;
  companyLabel: LangValue;
  companyPlaceholder: LangValue;
  emailLabel: LangValue;
  emailPlaceholder: LangValue;
  interestLabel: LangValue;
  interestPlaceholder: LangValue;
  messageLabel: LangValue;
  messagePlaceholder: LangValue;
  sendLabel: LangValue;
  options: ContactOptionData[];
}

export async function getContact(): Promise<ContactData> {
  const res = await fetch(`${API_URL}/contact`, { cache: 'no-store' });
  return res.json();
}