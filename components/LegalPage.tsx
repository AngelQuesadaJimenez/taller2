"use client";

import { business } from "@/data/business.config";
import { languages, localizedPath, type SitePage } from "@/i18n/config";
import { GlassNavbar } from "@/components/ui/GlassNavbar";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { usePreferences } from "./Preferences";

export function LegalPage({ page }: { page: Exclude<SitePage, "home"> }) {
  const { t, locale } = usePreferences();
  const { title, paragraphs } = t.legal[page];

  return (
    <>
      <GlassNavbar>
        <div className="header-inner header-inner--legal">
          <a href={localizedPath(locale, "home")} aria-label={business.name + ", " + t.common.homeLink}><BrandLogo variant="compact" size="small" /></a>
          <div className="header-preferences">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </GlassNavbar>
      <main lang={languages[locale].tag} id="contenido" tabIndex={-1} className="wrap section legal-content">
        <div className="section-heading"><h1>{title}</h1></div>
        {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {page === "cookies" && <p><a href={localizedPath(locale, "privacidad")}>{t.legal.privacyLink}</a></p>}
        {page === "terminos" && <p><a href={localizedPath(locale, "home") + "#contacto"}>{t.legal.contactLink}</a></p>}
      </main>
    </>
  );
}
