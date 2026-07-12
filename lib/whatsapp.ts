import { site } from "@/data/site";

/** Genera un enlace de WhatsApp con mensaje prellenado. */
export function waLink(message?: string): string {
  const text = encodeURIComponent(message ?? site.whatsapp.defaultMessage);
  return `https://wa.me/${site.whatsapp.number}?text=${text}`;
}
