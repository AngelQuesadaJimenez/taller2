import { Icon } from "@/components/ui/Icon";
import { site } from "@/data/site";

const points = [
  "Diagnóstico honesto: te decimos si conviene reparar o cambiar.",
  "Repuestos nuevos y reconstruidos en existencia.",
  "Atención para liviano, pesado, agrícola y maquinaria.",
  "Trato directo y asesoría de gente que conoce el oficio.",
];

export function About() {
  return (
    <section id="nosotros" className="section bg-white">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div className="relative order-last lg:order-first">
          <div className="grid grid-cols-2 gap-4">
            <div className="mt-8 rounded-2xl bg-brand-800 p-6 text-white shadow-card">
              <span className="font-heading text-4xl font-bold text-spark-400">
                +{site.yearsExperience}
              </span>
              <p className="mt-1 text-sm text-brand-100">años dándole vida a tu motor</p>
            </div>
            <div className="rounded-2xl bg-brand-50 p-6 shadow-card">
              <Icon name="repair" className="h-9 w-9 text-brand-500" />
              <p className="mt-2 text-sm font-medium text-brand-700">
                Reparación con banco de pruebas
              </p>
            </div>
            <div className="rounded-2xl bg-spark-400 p-6 text-brand-900 shadow-card">
              <Icon name="machinery" className="h-9 w-9" />
              <p className="mt-2 text-sm font-semibold">Especialistas en maquinaria pesada</p>
            </div>
            <div className="-mt-4 rounded-2xl bg-brand-50 p-6 shadow-card">
              <Icon name="pin" className="h-9 w-9 text-brand-500" />
              <p className="mt-2 text-sm font-medium text-brand-700">
                Río Segundo, Alajuela
              </p>
            </div>
          </div>
        </div>

        <div>
          <span className="eyebrow">Sobre el taller</span>
          <h2 className="h2">
            Tres décadas de experiencia al servicio de tu vehículo y tu equipo
          </h2>
          <p className="mt-5 text-lg text-brand-600">
            En <strong>{site.name}</strong> nos dedicamos a la venta y reparación de
            alternadores y arrancadores para vehículos livianos, pesados y maquinaria
            especializada. Con más de {site.yearsExperience} años en la zona de Alajuela,
            ofrecemos soluciones de calidad tanto para dueños de vehículos como para empresas
            y flotas.
          </p>
          <p className="mt-3 text-brand-600">
            Nuestro propósito es sencillo: que tu equipo arranque y cargue sin fallas, con un
            servicio confiable, honesto y a un precio justo.
          </p>

          <ul className="mt-7 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-spark-100 text-spark-500">
                  <Icon name="check" className="h-4 w-4" />
                </span>
                <span className="text-brand-700">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
