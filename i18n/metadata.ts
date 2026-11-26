import type { Metadata } from "next";
import { business } from "@/data/business.config";
import { sharePhoto } from "@/data/photos";
import { type Locale, type SitePage, languages, locales, localizedPath } from "./config";
import { messages } from "./messages";

export function pageMetadata(locale: Locale, page: SitePage) {
  const t = messages[locale];
  const path = localizedPath(locale, page);
  return {
    title: (page === "home" ? t.seo.title : t.legal[page].title) + " | " + business.name,
    description: t.seo.description,
    imageAlt: t.photos.alternator,
    path,
    alternates: {
      "es-CR": localizedPath("es", page),
      "en-US": localizedPath("en", page),
      "x-default": localizedPath("es", page),
    },
  };
}

export function metadataFor(locale: Locale, page: SitePage): Metadata {
  const { title, description, imageAlt, path, alternates } = pageMetadata(locale, page);
  return {
    metadataBase: new URL(business.website),
    title,
    description,
    alternates: { canonical: path, languages: alternates },
    ...(page !== "home" && { robots: { index: false, follow: true } }),
    openGraph: {
      type: "website",
      locale: languages[locale].og,
      alternateLocale: locales.filter((other) => other !== locale).map((other) => languages[other].og),
      url: path,
      siteName: business.name,
      title,
      description,
      images: [{ ...sharePhoto, url: sharePhoto.src, alt: imageAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [{ url: sharePhoto.src, alt: imageAlt }] },
  };
}
