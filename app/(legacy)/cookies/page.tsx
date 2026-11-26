import { LegalPage } from "@/components/LegalPage";
import { SitePreferences } from "@/components/SiteDocument";
import { defaultLocale } from "@/i18n/config";
import { metadataFor } from "@/i18n/metadata";

export const metadata = metadataFor(defaultLocale, "cookies");

export default function LegacyLegalPage() {
  return <SitePreferences locale={defaultLocale} page="cookies" suggestLocale><LegalPage page="cookies" /></SitePreferences>;
}
