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

export { cn } from "./lib/utils";
