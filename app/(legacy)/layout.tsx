import { SiteDocument, siteViewport } from "@/components/SiteDocument";
import { defaultLocale } from "@/i18n/config";

export const viewport = siteViewport;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <SiteDocument locale={defaultLocale}>{children}</SiteDocument>;
}
