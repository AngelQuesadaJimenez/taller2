"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { usePreferences } from "@/components/Preferences";
import { useServiceExperience } from "@/components/ServiceExperience";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { AppIcon } from "@/components/ui/AppIcon";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { GlassNavbar } from "@/components/ui/GlassNavbar";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { business } from "@/data/business.config";
import { navigation, services } from "@/data/site-content";

export function Header() {
  const { t } = usePreferences();
  const openService = useServiceExperience();
  const copy = t.nav;
  const [servicesOpen, setServicesOpen] = useState(false);
  const [current, setCurrent] = useState<string>("inicio");
  const header = useRef<HTMLDivElement>(null);
  const servicesToggle = useRef<HTMLButtonElement>(null);
  const servicesGroup = useRef<HTMLDivElement>(null);

  function navigate(section: string) {
    setCurrent(section);
    setServicesOpen(false);
  }

  useEffect(() => {
    if (!servicesOpen) return;
    function dismissOutside(event: PointerEvent) {
      if (event.target instanceof Node && !servicesGroup.current?.contains(event.target)) setServicesOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setServicesOpen(false);
      servicesToggle.current?.focus();
    }
    window.addEventListener("pointerdown", dismissOutside);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", dismissOutside);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [servicesOpen]);

  useEffect(() => {
    const sections = navigation.map(({ id }) => document.getElementById(id)).reverse();
    const root = document.documentElement;
    const sticky = header.current?.closest(".site-header");
    let headerHeight = 0;
    let frame = 0;
    function scheduleActive() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const readingLine = Math.max(headerHeight + 16, Math.min(window.innerHeight * 0.28, 180));
        const active = sections.find((section) => section && section.getBoundingClientRect().top <= readingLine);
        setCurrent(active?.id ?? "inicio");
        frame = 0;
      });
    }
    function measureHeader() {
      if (sticky) {
        headerHeight = Math.ceil(sticky.getBoundingClientRect().height);
        root.style.setProperty("--sticky-header-height", headerHeight + "px");
      }
      scheduleActive();
    }
    const observer = sticky && "ResizeObserver" in window ? new ResizeObserver(measureHeader) : null;
    if (sticky) observer?.observe(sticky);
    measureHeader();
    window.addEventListener("scroll", scheduleActive, { passive: true });
    window.addEventListener("resize", measureHeader);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleActive);
      window.removeEventListener("resize", measureHeader);
      observer?.disconnect();
      root.style.removeProperty("--sticky-header-height");
    };
  }, []);

  return (
    <GlassNavbar>
      <div ref={header} className="header-inner header-inner--home">
        <a href="#inicio" className="header-brand" aria-label={business.tradeName + ", " + copy.labels.inicio} onClick={() => navigate("inicio")}>
          <BrandLogo name={business.tradeName} size="small" />
        </a>
        <nav id="navegacion" className="nav" aria-label={copy.main}>
          {navigation.map(({ id }) => {
            const link = (
              <a className="nav-link" href={"#" + id} aria-current={current === id ? "location" : undefined} onClick={() => navigate(id)}>
                {copy.labels[id]}
              </a>
            );
            if (id !== "servicios") return <div key={id} className="nav-item">{link}</div>;
            return (
              <div key={id} className="nav-item nav-item--services" ref={servicesGroup}
                onBlur={(event) => {
                  if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false);
                }}>
                {link}
                <button type="button" ref={servicesToggle} className="nav-disclosure" aria-label={copy.services} title={copy.services}
                  aria-expanded={servicesOpen} aria-controls="servicios-menu" onClick={() => setServicesOpen(!servicesOpen)}>
                  <AppIcon icon={ChevronDown} size="small" />
                </button>
                <GlassPanel variant="floating" className="nav-dropdown" id="servicios-menu" hidden={!servicesOpen}>
                  {services.map((service) => (
                    <button type="button" key={service.id} aria-haspopup="dialog" onClick={(event) => {
                      setServicesOpen(false);
                      openService(service, servicesToggle.current ?? event.currentTarget);
                    }}>
                      <AppIcon icon={service.icon} />{t.parts[service.component].plural}
                    </button>
                  ))}
                </GlassPanel>
              </div>
            );
          })}
        </nav>
        <div className="header-actions">
          <div className="header-preferences"><LanguageSwitcher /><ThemeSwitcher /></div>
          <WhatsAppCTA className="header-whatsapp" variant="glass" ariaLabel="WhatsApp">
            <span className="header-whatsapp-label">WhatsApp</span>
          </WhatsAppCTA>
        </div>
      </div>
    </GlassNavbar>
  );
}
