"use client";

import { ArrowUpRight } from "lucide-react";
import { useServiceExperience } from "@/components/ServiceExperience";
import { Catalog } from "@/components/Catalog";
import { usePreferences } from "@/components/Preferences";
import { services } from "@/data/site-content";
import { AppIcon } from "@/components/ui/AppIcon";
import { AutomotivePhoto } from "@/components/ui/AutomotivePhoto";
import { GlassButton } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassSection } from "@/components/ui/GlassSection";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CommercialServices() {
  const openService = useServiceExperience();
  const { t } = usePreferences();
  const copy = t.home;

  return (
    <>
      <GlassSection id="servicios" className="wrap" aria-labelledby="servicios-titulo">
        <SectionHeading id="servicios-titulo" {...copy.services} />
        <p className="service-scope">{t.serviceDetail.scope}</p>
        <div className="services-grid" data-reveal="group">
          {services.map((service) => (
            <GlassCard key={service.id} id={service.id} className="service-card"
              title={t.parts[service.component].plural} description={t.parts[service.component].description}
              icon={<AppIcon size="large" icon={service.icon} />}
              action={
                <div className="service-card-actions">
                  <GlassButton variant="quiet" className="service-explore" aria-haspopup="dialog"
                    aria-label={t.serviceDetail.explore + " · " + t.parts[service.component].plural}
                    onClick={(event) => openService(service, event.currentTarget)}>
                    {t.serviceDetail.explore} <AppIcon icon={ArrowUpRight} size="small" />
                  </GlassButton>
                </div>
              }
              image={
                <div className="service-photo">
                  <AutomotivePhoto photo={{ ...service.image, alt: t.photos[service.photoKey] }} sizes="(max-width: 767px) 94vw, (max-width: 1280px) 46vw, 592px" />
                </div>
              }
            />
          ))}
        </div>
      </GlassSection>
      <Catalog onSelect={(product, trigger) => {
        const service = services.find(({ component }) => component === product.category);
        if (service) openService(service, trigger, product);
      }} />
    </>
  );
}
