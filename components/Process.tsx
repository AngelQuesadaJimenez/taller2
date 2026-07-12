import { process } from "@/data/site";

export function Process() {
  return (
    <section id="proceso" className="section bg-brand-800 text-white">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-spark-400">
            Cómo trabajamos
          </span>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            Solicitar tu servicio es muy sencillo
          </h2>
          <p className="mt-4 text-lg text-brand-100">
            En cuatro pasos tienes tu alternador o arrancador listo para rodar.
          </p>
        </div>

        <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => (
            <li key={p.step} className="relative">
              {/* Línea conectora en desktop */}
              {i < process.length - 1 && (
                <span
                  className="absolute left-12 top-6 hidden h-px w-full bg-white/15 lg:block"
                  aria-hidden="true"
                />
              )}
              <span className="relative grid h-12 w-12 place-items-center rounded-full bg-spark-400 font-heading text-lg font-bold text-brand-900">
                {p.step}
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-brand-200">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
