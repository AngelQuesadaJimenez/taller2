import { site } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { waLink } from "@/lib/whatsapp";

const nav = [
  { href: "#servicios", label: "Servicios" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#proceso", label: "Proceso" },
  { href: "#galeria", label: "Galería" },
  { href: "#faq", label: "Preguntas frecuentes" },
  { href: "#contacto", label: "Contacto" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-900 text-brand-200">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo variant="light" />
          <p className="mt-4 max-w-sm text-sm">
            {site.description}
          </p>
          <div className="mt-5 flex gap-3">
            <Social href={site.social.facebook} icon="facebook" label="Facebook" />
            <Social href={site.social.instagram} icon="instagram" label="Instagram" />
            <Social href={site.social.tiktok} icon="tiktok" label="TikTok" />
            <Social href={waLink()} icon="whatsapp" label="WhatsApp" />
          </div>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
            Navegación
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-spark-400">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
            Contacto
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Icon name="phone" className="h-4 w-4 text-spark-400" />
              <a href={`tel:${site.phones[0].tel}`} className="hover:text-spark-400">
                {site.phones[0].number}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Icon name="mail" className="h-4 w-4 text-spark-400" />
              <a href={`mailto:${site.email}`} className="break-all hover:text-spark-400">
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="pin" className="mt-0.5 h-4 w-4 flex-none text-spark-400" />
              <span>
                {site.address.district}, {site.address.city}, {site.address.country}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row">
          <p>
            © {year} {site.legalName}. Todos los derechos reservados.
          </p>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1" aria-label="Legal">
            <a href="/privacidad" className="hover:text-spark-400">
              Aviso de Privacidad
            </a>
            <a href="/terminos" className="hover:text-spark-400">
              Términos y Condiciones
            </a>
            <a href="/cookies" className="hover:text-spark-400">
              Política de Cookies
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function Social({
  href,
  icon,
  label,
}: {
  href: string;
  icon: "facebook" | "instagram" | "tiktok" | "whatsapp";
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 transition-colors hover:bg-spark-400 hover:text-brand-900"
    >
      <Icon name={icon} className="h-4.5 w-4.5" />
    </a>
  );
}
