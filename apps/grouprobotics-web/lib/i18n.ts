import az from "@/locales/az.json";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";

const dictionaries = { az, en, ru };

export type Locale = keyof typeof dictionaries;
export const LOCALES: Locale[] = ["az", "en", "ru"];
export const DEFAULT_LOCALE: Locale = "az";

export function getDictionary(locale: string) {
  return dictionaries[locale as Locale] ?? dictionaries[DEFAULT_LOCALE];
}

export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}