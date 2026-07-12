import { Icon } from "@/components/ui/Icon";
import { site } from "@/data/site";

/**
 * IMPORTANTE: no se inventan testimonios.
 * TODO(owner): agregar reseñas reales de clientes (Google/Facebook) en el array.
 * Ejemplo de estructura:
 * { name: "Nombre real", text: "Comentario real", rating: 5, source: "Google" }
 */
const testimonials: { name: string; text: string; rating: number; source: string }[] = [];

export function Testimonials() {
  return (
    <section id="testimonios" className="section bg-white">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Testimonios</span>
          <h2 className="h2">Lo que dicen nuestros clientes</h2>
        </div>

        {testimonials.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="flex flex-col rounded-2xl border border-brand-100 p-6 shadow-card"
              >
                <div className="flex gap-0.5 text-spark-400" aria-label={`${t.rating} de 5`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Icon key={i} name="spark" className="h-5 w-5" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-brand-700">“{t.text}”</p>
                <footer className="mt-4 text-sm font-semibold text-brand-800">
                  {t.name}
                  <span className="ml-2 font-normal text-brand-400">· {t.source}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        ) : (
          // Estado vacío honesto con invitación a dejar reseña
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-dashed border-brand-200 bg-brand-50 p-8 text-center">
            <div className="mx-auto flex w-fit gap-1 text-spark-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="spark" className="h-6 w-6" />
              ))}
            </div>
            <p className="mt-4 text-brand-700">
              Contamos con la confianza de cientos de clientes en Alajuela.
              ¿Ya nos visitaste? Déjanos tu opinión en nuestras redes.
            </p>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline mt-6"
            >
              <Icon name="facebook" className="h-5 w-5" />
              Dejar una reseña en Facebook
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
