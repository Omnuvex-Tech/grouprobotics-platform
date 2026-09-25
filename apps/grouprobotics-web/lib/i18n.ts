export type Locale = "az" | "en" | "ru";
export const LOCALES: Locale[] = ["az", "en", "ru"];
export const DEFAULT_LOCALE: Locale = "az";

export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}