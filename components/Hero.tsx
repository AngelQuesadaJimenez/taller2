import { site, brands } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { waLink } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-brand-800 pt-24 text-white lg:pt-28"
    >
      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-spark-400/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="container-x relative grid items-center gap-12 pb-16 lg:grid-cols-2 lg:pb-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-spark-300 ring-1 ring-white/15">
            <Icon name="spark" className="h-4 w-4" />
            {site.tagline}
          </span>

          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Que tu motor{" "}
            <span className="text-spark-400">encienda a la primera</span>, siempre.
          </h1>

          <p className="mt-5 max-w-xl text-lg text-brand-100">
            Venta y reparación de <strong className="text-white">alternadores y arrancadores</strong>{" "}
            para vehículo liviano, pesado y maquinaria. Más de {site.yearsExperience} años de
            experiencia en Río Segundo, Alajuela.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <Icon name="whatsapp" className="h-5 w-5" />
              Cotizar por WhatsApp
            </a>
            <a href="#servicios" className="btn-secondary">
              Ver servicios
              <Icon name="arrow" className="h-5 w-5" />
            </a>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              { n: "+30", l: "años de experiencia" },
              { n: "Liviano", l: "pesado y maquinaria" },
              { n: "Venta", l: "y reparación" },
            ].map((s) => (
              <div key={s.l}>
                <dt className="font-heading text-2xl font-bold text-spark-400">{s.n}</dt>
                <dd className="mt-1 text-xs text-brand-200">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Composición visual */}
        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="relative mx-auto aspect-square max-w-md rounded-3xl bg-gradient-to-br from-brand-500/40 to-brand-900/60 p-1 ring-1 ring-white/10">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-[22px] bg-brand-900/40 p-8 text-center">
              {/* Placeholder de imagen — TODO(owner): reemplazar por foto real del taller */}
              <Icon name="alternator" className="h-28 w-28 text-spark-400" />
              <p className="mt-4 text-sm text-brand-200">
                Imagen del taller / producto
                <br />
                <span className="text-xs text-brand-300">
                  (placeholder — sustituir por foto real)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Marcas con las que trabajan */}
      <div className="relative border-t border-white/10 bg-brand-900/50">
        <div className="container-x flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-5 text-sm text-brand-200">
          <span className="font-semibold text-white">Trabajamos con:</span>
          {brands.map((b) => (
            <span key={b} className="opacity-80">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
