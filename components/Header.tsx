"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { waLink } from "@/lib/whatsapp";

const nav = [
  { href: "#servicios", label: "Servicios" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#por-que", label: "Por qué elegirnos" },
  { href: "#proceso", label: "Proceso" },
  { href: "#faq", label: "Preguntas" },
  { href: "#contacto", label: "Contacto" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 shadow-card backdrop-blur"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between lg:h-20">
        <a href="#top" className="flex-none" aria-label="Ir al inicio">
          <Logo />
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-brand-700 transition-colors hover:text-brand-500"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <Icon name="whatsapp" className="h-5 w-5" />
            Cotizar ahora
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-lg text-brand-800 hover:bg-brand-50 lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
        </button>
      </div>

      {/* Menú móvil */}
      <div
        id="mobile-menu"
        className={`lg:hidden ${open ? "block" : "hidden"} border-t border-brand-100 bg-white`}
      >
        <nav className="container-x flex flex-col py-4" aria-label="Móvil">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-3 text-base font-medium text-brand-700 hover:bg-brand-50"
            >
              {item.label}
            </a>
          ))}
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="btn-primary mt-3"
          >
            <Icon name="whatsapp" className="h-5 w-5" />
            Cotizar por WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
