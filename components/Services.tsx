import { services } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { waLink } from "@/lib/whatsapp";

export function Services() {
  return (
    <section id="servicios" className="section bg-brand-50">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Productos y servicios</span>
          <h2 className="h2">Todo para el arranque y la generación de tu equipo</h2>
          <p className="mt-4 text-lg text-brand-600">
            Vendemos y reparamos alternadores y arrancadores para todo tipo de vehículo y
            maquinaria. Elige tu categoría y cotiza sin compromiso.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.slug}
              className="group flex flex-col rounded-2xl bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover"
            >
              <span className="grid h-14 w-14 place-items-center rounded-xl bg-brand-500/10 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                <Icon name={s.icon} className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-heading text-lg font-bold text-brand-800">
                {s.name}
              </h3>
              <p className="mt-2 text-sm text-brand-600">{s.description}</p>

              <p className="mt-4 flex items-start gap-2 rounded-lg bg-spark-50 px-3 py-2 text-sm text-brand-700">
                <Icon name="spark" className="mt-0.5 h-4 w-4 flex-none text-spark-500" />
                <span>{s.benefit}</span>
              </p>

              <a
                href={waLink(
                  `Hola, quiero información sobre "${s.name}". Mi vehículo/equipo es: `
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline mt-6"
              >
                Cotizar este servicio
                <Icon name="arrow" className="h-4 w-4" />
              </a>
            </article>
          ))}

          {/* Tarjeta CTA */}
          <article className="flex flex-col justify-center rounded-2xl bg-brand-800 p-6 text-white shadow-card">
            <h3 className="font-heading text-xl font-bold">
              ¿No sabes cuál necesitas?
            </h3>
            <p className="mt-2 text-sm text-brand-100">
              Escríbenos con la marca y modelo de tu vehículo o equipo y te asesoramos gratis.
            </p>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6"
            >
              <Icon name="whatsapp" className="h-5 w-5" />
              Habla con un técnico
            </a>
          </article>
        </div>

        <p className="mt-6 text-center text-sm text-brand-500">
          Precios según marca, modelo y estado de la pieza. Cotización sin compromiso.
        </p>
      </div>
    </section>
  );
}
