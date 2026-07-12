import Link from "next/link";
import { site } from "@/data/site";
import { Logo } from "@/components/ui/Logo";

/** Contenedor reutilizable para páginas legales. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-brand-100">
        <div className="container-x flex h-16 items-center justify-between lg:h-20">
          <Link href="/" aria-label="Volver al inicio">
            <Logo />
          </Link>
          <Link href="/" className="text-sm font-medium text-brand-500 hover:underline">
            ← Volver al sitio
          </Link>
        </div>
      </header>

      <main className="container-x max-w-3xl py-14">
        <h1 className="font-heading text-3xl font-bold text-brand-800 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-brand-400">Última actualización: {updated}</p>
        <div className="prose-legal mt-8 space-y-5 text-brand-600 [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-brand-800 [&_a]:text-brand-500 [&_a]:underline">
          {children}
        </div>

        <p className="mt-10 rounded-xl bg-brand-50 p-4 text-sm text-brand-500">
          ⚠️ Texto base de referencia. Debe ser revisado y adaptado por el propietario y, de
          preferencia, validado por un profesional legal según la Ley N.° 8968 de Protección de
          la Persona frente al tratamiento de sus datos personales (Costa Rica).
        </p>

        <p className="mt-6 text-sm text-brand-500">
          ¿Dudas? Escríbenos a{" "}
          <a href={`mailto:${site.email}`} className="text-brand-500 underline">
            {site.email}
          </a>
          .
        </p>
      </main>
    </div>
  );
}
