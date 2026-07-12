import { site } from "@/data/site";

/**
 * Logotipo tipográfico (placeholder).
 * TODO(owner): reemplazar por el logo oficial en /public/logo.svg.
 */
export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const textColor = variant === "light" ? "text-white" : "text-brand-800";
  const subColor = variant === "light" ? "text-brand-100" : "text-brand-400";

  return (
    <span className="flex items-center gap-2.5" aria-label={site.name}>
      {/* Marca: rayo (chispa) dentro de un círculo */}
      <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-spark-400 text-brand-900 shadow-card">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
          <path d="M13 2L4.5 13.5H11l-1 8.5L20 10h-6.5L13 2z" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className={`block font-heading text-base font-bold ${textColor}`}>
          Alternadores &amp; Arrancadores
        </span>
        <span className={`block text-xs font-semibold uppercase tracking-wider ${subColor}`}>
          Río Segundo · +30 años
        </span>
      </span>
    </span>
  );
}
