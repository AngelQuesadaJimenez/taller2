"use client";

import type { ReactNode } from "react";
import { Phone } from "lucide-react";
import { usePreferences } from "@/components/Preferences";
import { business } from "@/data/business.config";
import { waLink } from "@/lib/whatsapp";
import { ContactForm } from "@/components/ContactForm";
import { AppIcon } from "@/components/ui/AppIcon";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassSection } from "@/components/ui/GlassSection";
import { SectionHeading } from "@/components/ui/SectionHeading";

function ContactMethod({ href, label, number, icon, newTab }: {
  href: string;
  label: string;
  number: string;
  icon: ReactNode;
  newTab?: boolean;
}) {
  return (
    <GlassPanel variant="interactive" className="contact-method">
      <span className="contact-method-icon">{icon}</span>
      <a className="contact-method-main" href={href} target={newTab ? "_blank" : undefined} rel={newTab ? "noopener noreferrer" : undefined}>
        <span>{label}</span>
        <strong>{number}</strong>
      </a>
    </GlassPanel>
  );
}

export function Contact() {
  const { t, locale } = usePreferences();
  const { landline } = business.voice;

  return (
    <GlassSection id="contacto" variant="feature" aria-labelledby="contacto-titulo">
      <div className="wrap contact-layout">
        <div>
          <SectionHeading id="contacto-titulo" {...t.home.contact} />
          <div className="contact-phones">
            {[business.whatsapp, business.whatsappSecondary].map(({ number, display }) => (
              <ContactMethod key={number} href={waLink(undefined, locale, number)} newTab label="WhatsApp" number={display}
                icon={<BrandIcon brand="whatsapp" />} />
            ))}
            <ContactMethod href={"tel:" + landline.tel} label={t.common.landline} number={landline.display}
              icon={<AppIcon icon={Phone} size="large" />} />
          </div>
        </div>
        <GlassPanel variant="elevated"><ContactForm /></GlassPanel>
      </div>
    </GlassSection>
  );
}
