"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { usePreferences } from "@/components/Preferences";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { AppIcon } from "@/components/ui/AppIcon";
import { HeroGallery } from "@/components/HeroGallery";
import { GlassButton } from "@/components/ui/Button";
import { businessLocation } from "@/data/business.config";

export function Hero() {
  const { t } = usePreferences();
  const { hero, viewServices } = t.home;

  return (
    <section id="inicio" className="hero" aria-labelledby="titulo">
      <div className="wrap hero-content">
        <div className="hero-copy">
          <p className="hero-location">{hero.kicker}</p>
          <h1 id="titulo"><span className="hero-service">{hero.emphasis}</span>{" "}<span className="hero-component">{hero.suffix}</span></h1>
          <p className="hero-intro">{hero.description}</p>
          <div className="hero-actions">
            <WhatsAppCTA variant="primary" size="large">{t.common.consult}</WhatsAppCTA>
            <GlassButton href="#servicios" variant="glass" size="large">{viewServices} <AppIcon icon={ArrowUpRight} size="small" /></GlassButton>
          </div>
          <a className="hero-access" href="#ubicacion">
            <AppIcon icon={MapPin} size="small" />
            {t.common.directions}
            <span>{businessLocation.street}</span>
          </a>
        </div>
        <HeroGallery />
      </div>
    </section>
  );
}
