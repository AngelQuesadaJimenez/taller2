"use client";

import { useEffect, useRef, useState } from "react";
import { usePreferences } from "@/components/Preferences";
import { business } from "@/data/business.config";
import { waLink } from "@/lib/whatsapp";

export function WhatsAppBubble() {
  const { locale, t } = usePreferences();
  const link = useRef<HTMLAnchorElement>(null);
  const [overControls, setOverControls] = useState(false);

  useEffect(() => {
    const areas = document.querySelectorAll(".location-layout, .contact-phones, #contacto .contact-form, .catalog-grid, .parts-grid, .payment-grid");
    if (!areas.length || !("IntersectionObserver" in window)) return;
    let observer: IntersectionObserver | undefined;

    // Yield the corner when the shortcut would cover other controls or payment details.
    function watchCorner() {
      if (!link.current) return;
      observer?.disconnect();
      const box = link.current.getBoundingClientRect();
      const root = document.documentElement;
      const margins = [-box.top, box.right - root.clientWidth, box.bottom - root.clientHeight, -box.left];
      const overlapping = new Set<Element>();
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) overlapping.add(entry.target);
          else overlapping.delete(entry.target);
        }
        setOverControls(overlapping.size > 0);
      }, {
        rootMargin: margins.map((value) => Math.round(value) + "px").join(" "),
      });
      areas.forEach((area) => observer?.observe(area));
    }

    watchCorner();
    window.addEventListener("resize", watchCorner);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", watchCorner);
    };
  }, []);

  const label = t.common.consult + " · " + business.whatsapp.display;
  return (
    <a ref={link} className="whatsapp-bubble" data-over-controls={overControls || undefined}
      aria-label={label} title={label} href={waLink(undefined, locale)} target="_blank" rel="noopener noreferrer">
      <span className="whatsapp-bubble-icon" aria-hidden="true" />
      <span className="whatsapp-bubble-label">WhatsApp</span>
    </a>
  );
}
