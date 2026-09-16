export { Button, buttonVariants } from "./components/Button";
export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
} from "./components/Card";
export { NotifyProvider, useNotify } from "./components/Notify";
export { NotifyContainer, notifyVariants } from "./components/Notify";


export { NavbarUI as Navbar } from './components/Navbar/navbar';
export type { NavLinkItem } from './components/Navbar/navbar';

export { LanguageSwitcher } from './components/LanguageSwitcher/language-switcher';
export type { LanguageSwitcherProps } from './components/LanguageSwitcher/language-switcher';

export { ConnectUI as Connect } from './components/Connect/connect';
export type { ConnectProps } from './components/Connect/connect';

export { ApproachUI as Approach } from './components/Approach/approach';
export type { ApproachProps } from './components/Approach/approach';

export { WhatWeDoUI as WhatWeDo } from './components/WhatWeDo/what-we-do';
export type { WhatWeDoProps, WhatWeDoItem } from './components/WhatWeDo/what-we-do';

export { CapabilitiesUI as Capabilities } from './components/Capabilities/capabilities';
export type { CapabilitiesProps, CapabilityItem } from './components/Capabilities/capabilities';

export { IndustriesUI as Industries } from './components/Industries/industries';
export type { IndustriesProps, IndustryItem } from './components/Industries/industries';

export { ResellerUI as Reseller } from './components/Reseller/reseller';
export type { ResellerProps, ResellerItem } from './components/Reseller/reseller';

export { ProblemSolutionUI as ProblemSolution } from './components/ProblemSolution/problem-solution';
export type { ProblemSolutionProps } from './components/ProblemSolution/problem-solution';

export { MarketUI as Market } from './components/Market/market';
export type { MarketProps, MarketItem } from './components/Market/market';

export { ContactUI as Contact } from './components/Contact/contact';
export type { ContactProps, ContactOption } from './components/Contact/contact';

export { FooterUI as Footer } from './components/Footer/footer';
export type { FooterProps, FooterLinkItem } from './components/Footer/footer';

export { cn } from "./lib/utils";
