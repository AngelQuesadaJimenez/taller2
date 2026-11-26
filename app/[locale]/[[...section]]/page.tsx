import { notFound } from "next/navigation";
import { HomePage } from "@/components/HomePage";
import { LegalPage } from "@/components/LegalPage";
import { SitePreferences } from "@/components/SiteDocument";
import { isLocale, pages } from "@/i18n/config";
import { metadataFor } from "@/i18n/metadata";

type Route = { params: Promise<{ locale: string; section?: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return pages.map((page) => ({ section: page === "home" ? [] : [page] }));
}

async function getRoute(params: Route["params"]) {
  const { locale, section } = await params;
  const page = section?.length ? pages.find((value) => value === section[0] && value !== "home") : "home";
  if (!isLocale(locale) || !page || (section && section.length > 1)) notFound();
  return { locale, page };
}

export async function generateMetadata({ params }: Route) {
  const { locale, page } = await getRoute(params);
  return metadataFor(locale, page);
}

export default async function LocalePage({ params }: Route) {
  const { locale, page } = await getRoute(params);
  return (
    <SitePreferences locale={locale} page={page}>
      {page === "home" ? <HomePage /> : <LegalPage page={page} />}
    </SitePreferences>
  );
}
