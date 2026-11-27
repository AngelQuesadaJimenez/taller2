"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { languages, locales } from "@/i18n/config";
import { usePreferences } from "./Preferences";
import { AppIcon } from "./ui/AppIcon";
import { GlassPanel } from "./ui/GlassPanel";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = usePreferences();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const picker = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const code = locale.toUpperCase();
  const label = t.common.language + " · " + code;

  useEffect(() => {
    if (!open) return;
    function dismissOutside(event: PointerEvent) {
      if (event.target instanceof Node && !picker.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", dismissOutside);
    return () => document.removeEventListener("pointerdown", dismissOutside);
  }, [open]);

  return (
    <div ref={picker} className="language-picker"
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
      onKeyDown={(event) => {
        if (!open || event.key !== "Escape") return;
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        toggle.current?.focus();
      }}>
      <button ref={toggle} type="button" className="preference-choice language-trigger" data-preference="language"
        title={label} aria-label={label} aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(!open)}>
        <span className="language-flag" aria-hidden="true" style={{ backgroundImage: `url("${languages[locale].flag}")` }} />
        <span>{code}</span>
        <AppIcon icon={ChevronDown} size="small" />
      </button>
      <GlassPanel id={menuId} variant="floating" className="nav-dropdown language-options" hidden={!open}
        role="group" aria-label={t.common.language}>
        {locales.map((id) => {
          const language = languages[id];
          return (
            <button key={id} type="button" lang={language.tag} aria-pressed={id === locale} onClick={() => {
              setLocale(id);
              setOpen(false);
              toggle.current?.focus();
            }}>
              <span className="language-flag" aria-hidden="true" style={{ backgroundImage: `url("${language.flag}")` }} />
              <span>{language.label}</span>
              {id === locale && <AppIcon icon={Check} size="small" />}
            </button>
          );
        })}
      </GlassPanel>
    </div>
  );
}
