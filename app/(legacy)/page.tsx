import { HomePage } from "@/components/HomePage";
import { SitePreferences } from "@/components/SiteDocument";
import { defaultLocale } from "@/i18n/config";
import { metadataFor } from "@/i18n/metadata";

export const metadata = metadataFor(defaultLocale, "home");

export default function LegacyHome() {
  return <SitePreferences locale={defaultLocale} page="home" suggestLocale><HomePage /></SitePreferences>;
}
