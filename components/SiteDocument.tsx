import type { ReactNode } from "react";
import type { Viewport } from "next";
import { PreferencesProvider } from "@/components/Preferences";
import { WhatsAppBubble } from "@/components/WhatsAppBubble";
import { business, businessLocation } from "@/data/business.config";
import { themes, languages, themeKey, type Locale, type SitePage } from "@/i18n/config";
import { messages } from "@/i18n/messages";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@/app/tokens.css";
import "@/app/globals.css";
import "@/app/glass.css";

export const siteViewport: Viewport = { viewportFit: "cover" };

const initialTheme = `try{const value=localStorage.getItem(${JSON.stringify(themeKey)});if(${JSON.stringify(themes)}.includes(value))document.documentElement.dataset.theme=value}catch{}`;

function businessSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: business.name,
    description: messages[locale].seo.description,
    telephone: business.phones.map((phone) => phone.tel),
    address: {
      "@type": "PostalAddress",
      streetAddress: businessLocation.street,
      addressLocality: businessLocation.district,
      addressRegion: businessLocation.province,
      addressCountry: "CR",
    },
    openingHoursSpecification: business.hours.map((slot) => ({
      "@type": "OpeningHoursSpecification", dayOfWeek: slot.days, opens: slot.opens, closes: slot.closes,
    })),
    hasMap: businessLocation.wazeUrl,
    sameAs: business.socials.map(({ url }) => url),
  };
}

export function SiteDocument({ children, locale }: {
  children: ReactNode; locale: Locale;
}) {
  return (
    <html lang={languages[locale].tag} suppressHydrationWarning>
      {/* The inline theme preference must run before the first paint. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: initialTheme }} />
      </head>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema(locale)).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}

export function SitePreferences({ children, locale, page, suggestLocale = false }: {
  children: ReactNode; locale: Locale; page: SitePage; suggestLocale?: boolean;
}) {
  return (
    <PreferencesProvider initialLocale={locale} page={page} suggestLocale={suggestLocale}>
      {children}
      <WhatsAppBubble />
    </PreferencesProvider>
  );
}
