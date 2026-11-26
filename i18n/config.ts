export const locales = ["es", "en"] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = "es";

export const languages = {
  es: { tag: "es-CR", og: "es_CR", label: "Español", flag: "/flags/cr.svg" },
  en: { tag: "en-US", og: "en_US", label: "English", flag: "/flags/us.svg" },
} as const;

export const pages = ["home", "privacidad", "cookies", "terminos"] as const;
export type SitePage = typeof pages[number];

export function localizedPath(locale: Locale, page: SitePage) {
  return "/" + locale + "/" + (page === "home" ? "" : page + "/");
}

export function isLocale(value: unknown): value is Locale {
  return value === "es" || value === "en";
}

export const themes = ["light", "dark", "system"] as const;
export type Theme = typeof themes[number];
export const themeKey = "rio2.theme";
export const localeKey = "rio2.locale";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}
