import { site } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { waLink } from "@/lib/whatsapp";
import { ContactForm } from "@/components/ContactForm";

export function Contact() {
  return (
    <section id="contacto" className="section bg-white">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Contacto</span>
          <h2 className="h2">Cotiza o agenda tu servicio hoy</h2>
          <p className="mt-4 text-lg text-brand-600">
            Escríbenos por el medio que prefieras. Respondemos rápido y con gusto te asesoramos.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Info de contacto */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-brand-800 p-6 text-white shadow-card">
              <h3 className="font-heading text-lg font-semibold">Datos de contacto</h3>
              <ul className="mt-4 space-y-4 text-sm">
                {site.phones.map((p) => (
                  <li key={p.number} className="flex items-center gap-3">
                    <Icon name="phone" className="h-5 w-5 flex-none text-spark-400" />
                    <a href={`tel:${p.tel}`} className="hover:text-spark-300">
                      <span className="text-brand-200">{p.label}: </span>
                      {p.number}
                    </a>
                  </li>
                ))}
                <li className="flex items-center gap-3">
                  <Icon name="whatsapp" className="h-5 w-5 flex-none text-spark-400" />
                  <a
                    href={waLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-spark-300"
                  >
                    WhatsApp: {site.whatsapp.display}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Icon name="mail" className="h-5 w-5 flex-none text-spark-400" />
                  <a href={`mailto:${site.email}`} className="break-all hover:text-spark-300">
                    {site.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="pin" className="mt-0.5 h-5 w-5 flex-none text-spark-400" />
                  <span>
                    {site.address.line}
                    <br />
                    {site.address.district}, {site.address.city}, {site.address.country}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="clock" className="mt-0.5 h-5 w-5 flex-none text-spark-400" />
                  <span>
                    {site.hours.map((h) => (
                      <span key={h.day} className="block">
                        <span className="text-brand-200">{h.day}:</span> {h.time}
                      </span>
                    ))}
                    <span className="mt-1 block text-xs text-brand-300">
                      (Horario por confirmar)
                    </span>
                  </span>
                </li>
              </ul>

              <div className="mt-6 flex gap-3">
                <SocialLink href={site.social.facebook} icon="facebook" label="Facebook" />
                <SocialLink href={site.social.instagram} icon="instagram" label="Instagram" />
                <SocialLink href={site.social.tiktok} icon="tiktok" label="TikTok" />
              </div>
            </div>

            {/* Mapa */}
            <div className="overflow-hidden rounded-2xl shadow-card">
              <iframe
                src={site.address.mapEmbed}
                title={`Ubicación de ${site.name}`}
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          {/* Formulario */}
          <div className="rounded-2xl border border-brand-100 p-6 shadow-card sm:p-8">
            <h3 className="font-heading text-lg font-semibold text-brand-800">
              Envíanos un mensaje
            </h3>
            <p className="mt-1 text-sm text-brand-500">
              Los campos con * son obligatorios.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: "facebook" | "instagram" | "tiktok";
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-white transition-colors hover:bg-spark-400 hover:text-brand-900"
    >
      <Icon name={icon} className="h-5 w-5" />
    </a>
  );
}
