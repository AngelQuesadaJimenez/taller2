import { Icon } from "@/components/ui/Icon";

/**
 * Galería con placeholders.
 * TODO(owner): sustituir cada bloque por fotos reales del taller,
 * productos, instalaciones y trabajos realizados (colocar en /public/gallery).
 */
const items = [
  { label: "Fachada del taller", icon: "pin" },
  { label: "Alternadores en existencia", icon: "alternator" },
  { label: "Arrancadores livianos", icon: "starter" },
  { label: "Maquinaria pesada", icon: "machinery" },
  { label: "Banco de pruebas", icon: "repair" },
  { label: "Trabajo terminado", icon: "check" },
] as const;

export function Gallery() {
  return (
    <section id="galeria" className="section bg-brand-50">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Galería</span>
          <h2 className="h2">Conoce nuestro taller y nuestro trabajo</h2>
          <p className="mt-4 text-lg text-brand-600">
            Instalaciones, productos y reparaciones que respaldan más de 30 años de oficio.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <figure
              key={it.label}
              className={`group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 shadow-card ${
                i === 0 ? "lg:col-span-2 lg:row-span-1 lg:aspect-[16/9]" : ""
              }`}
            >
              <Icon name={it.icon} className="h-14 w-14 text-brand-400/70" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-brand-900/70 px-4 py-2 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {it.label} · (foto pendiente)
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
