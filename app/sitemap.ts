import type { MetadataRoute } from "next";
import { business } from "@/data/business.config";
import { locales, localizedPath } from "@/i18n/config";
import { pageMetadata } from "@/i18n/metadata";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: new URL(localizedPath(locale, "home"), business.website).href,
    alternates: {
      languages: Object.fromEntries(Object.entries(pageMetadata(locale, "home").alternates).map(
        ([tag, path]) => [tag, new URL(path, business.website).href],
      )),
    },
  }));
}
