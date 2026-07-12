import { Icon } from "@/components/ui/Icon";
import { waLink } from "@/lib/whatsapp";

/** Botón flotante de WhatsApp, siempre visible. */
export function WhatsAppFloat() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-white shadow-cardHover transition-transform hover:scale-105"
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-white/60" />
        <Icon name="whatsapp" className="relative h-6 w-6" />
      </span>
      <span className="hidden sm:inline">Escríbenos</span>
    </a>
  );
}
