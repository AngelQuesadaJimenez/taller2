import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.alternadoresyarrancadoresrio2.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Alternadores y Arrancadores Río Segundo | Venta y Reparación en Alajuela",
    template: "%s | Alternadores y Arrancadores Río Segundo",
  },
  description:
    "Venta y reparación de alternadores y arrancadores para vehículo liviano, pesado y maquinaria en Río Segundo, Alajuela. Más de 30 años de experiencia. Cotiza por WhatsApp.",
  keywords: [
    "alternadores Río Segundo",
    "arrancadores Alajuela",
    "reparación de alternadores Costa Rica",
    "taller eléctrico automotriz Río Segundo",
    "arrancadores maquinaria pesada",
    "alternadores liviano y pesado",
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CR",
    url: siteUrl,
    siteName: site.name,
    title: "Alternadores y Arrancadores Río Segundo",
    description:
      "Especialistas en arranque y generación. Venta y reparación para liviano, pesado y maquinaria. +30 años en Alajuela.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alternadores y Arrancadores Río Segundo",
    description:
      "Venta y reparación de alternadores y arrancadores en Alajuela. +30 años de experiencia.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

// Datos estructurados de negocio local (schema.org) para SEO local
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: site.name,
  alternateName: site.legalName,
  description: site.description,
  url: siteUrl,
  telephone: site.phones[0].tel,
  email: site.email,
  image: `${siteUrl}/og-image.jpg`,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.line,
    addressLocality: site.address.district,
    addressRegion: site.address.city,
    addressCountry: "CR",
  },
  areaServed: "Alajuela, Costa Rica",
  sameAs: [site.social.facebook, site.social.instagram, site.social.tiktok],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "12:00",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CR" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <a
          href="#servicios"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
