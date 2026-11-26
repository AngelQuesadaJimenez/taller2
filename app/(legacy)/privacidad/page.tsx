import { LegalPage } from "@/components/LegalPage";
import { SitePreferences } from "@/components/SiteDocument";
import { defaultLocale } from "@/i18n/config";
import { metadataFor } from "@/i18n/metadata";

export const metadata = metadataFor(defaultLocale, "privacidad");

export default function LegacyLegalPage() {
  return <SitePreferences locale={defaultLocale} page="privacidad" suggestLocale><LegalPage page="privacidad" /></SitePreferences>;
}
