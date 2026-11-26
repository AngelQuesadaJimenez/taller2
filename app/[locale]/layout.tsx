import { notFound } from "next/navigation";
import { SiteDocument, siteViewport } from "@/components/SiteDocument";
import { isLocale, locales } from "@/i18n/config";

export const viewport = siteViewport;
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode; params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SiteDocument locale={locale}>{children}</SiteDocument>;
}
