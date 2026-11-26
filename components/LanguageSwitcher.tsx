"use client";

import { languages } from "@/i18n/config";
import { usePreferences } from "./Preferences";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = usePreferences();
  const code = locale.toUpperCase();
  const label = code + " · " + t.common.switchLanguage;

  return (
    <button type="button" className="preference-choice" data-preference="language"
      title={label} aria-label={label} onClick={() => setLocale(locale === "es" ? "en" : "es")}>
      <span className="language-flag" aria-hidden="true" style={{ backgroundImage: `url("${languages[locale].flag}")` }} />
      <span>{code}</span>
    </button>
  );
}
