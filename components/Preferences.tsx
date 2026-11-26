"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { business } from "@/data/business.config";
import { languages, isLocale, isTheme, localizedPath, localeKey, themeKey, type Locale, type SitePage, type Theme } from "@/i18n/config";
import { pageMetadata } from "@/i18n/metadata";
import { messages } from "@/i18n/messages";

function readPreference(key: string) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function savePreference(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* Storage can be unavailable. */ }
}

function updateLanguage(locale: Locale, page: SitePage) {
  const root = document.documentElement;
  const url = localizedPath(locale, page);
  const location = window.location;
  if (location.pathname !== url) history.replaceState(null, "", url + location.search + location.hash);
  root.lang = languages[locale].tag;

  const { title, description, imageAlt, path } = pageMetadata(locale, page);
  document.title = title;
  const setMeta = (selector: string, value: string) => document.head.querySelector(selector)?.setAttribute("content", value);
  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:locale"]', languages[locale].og);
  setMeta('meta[property="og:locale:alternate"]', locale === "es" ? languages.en.og : languages.es.og);
  setMeta('meta[property="og:image:alt"]', imageAlt);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
  setMeta('meta[name="twitter:image:alt"]', imageAlt);
  const canonical = new URL(path, business.website).href;
  setMeta('meta[property="og:url"]', canonical);
  document.head.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical);
}

const Preferences = createContext<{
  locale: Locale;
  theme: Theme;
  t: typeof messages.es;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
} | null>(null);

export function PreferencesProvider({ children, initialLocale, page, suggestLocale }: {
  children: ReactNode; initialLocale: Locale; page: SitePage; suggestLocale: boolean;
}) {
  const [locale, setLocale] = useState(initialLocale);
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const savedTheme = readPreference(themeKey);
      if (isTheme(savedTheme)) setTheme(savedTheme);
      if (suggestLocale) {
        const stored = readPreference(localeKey);
        const preferred = isLocale(stored) ? stored : navigator.languages.map((value) => value.split("-")[0]).find(isLocale);
        if (preferred && preferred !== initialLocale) {
          setLocale(preferred);
          updateLanguage(preferred, page);
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [initialLocale, page, suggestLocale]);

  return (
    <Preferences.Provider value={{
      locale,
      theme,
      t: messages[locale],
      setLocale(nextLocale) {
        savePreference(localeKey, nextLocale);
        setLocale(nextLocale);
        updateLanguage(nextLocale, page);
      },
      setTheme(nextTheme) {
        savePreference(themeKey, nextTheme);
        document.documentElement.dataset.theme = nextTheme;
        setTheme(nextTheme);
      },
    }}>
      <SkipLink />
      {children}
    </Preferences.Provider>
  );
}

function SkipLink() {
  const { t } = usePreferences();
  return <a href="#contenido" className="skip-link">{t.common.skip}</a>;
}

export function usePreferences() {
  const value = useContext(Preferences);
  if (!value) throw new Error("PreferencesProvider is required.");
  return value;
}
