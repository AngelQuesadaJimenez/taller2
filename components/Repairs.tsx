"use client";

import { ZoomIn } from "lucide-react";
import { usePreferences } from "@/components/Preferences";
import { repairs, type PhotoAsset } from "@/data/photos";
import { AppIcon } from "@/components/ui/AppIcon";
import { AutomotivePhoto } from "@/components/ui/AutomotivePhoto";
import { GlassButton } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassSection } from "@/components/ui/GlassSection";
import { SectionHeading } from "@/components/ui/SectionHeading";

const photoSizes = "(max-width: 767px) 43vw, (max-width: 1280px) 34vw, 430px";

function RepairPhoto({ photo, caption, label }: { photo: PhotoAsset & { alt: string }; caption: string; label: string }) {
  return (
    <figure>
      <a className="repair-photo" href={photo.src} target="_blank" rel="noopener noreferrer" aria-label={label}>
        <AutomotivePhoto photo={photo} sizes={photoSizes} />
        <span className="repair-photo-icon"><AppIcon icon={ZoomIn} size="small" /></span>
      </a>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function RepairComparison({ item }: { item: typeof repairs[number] }) {
  const { t } = usePreferences();
  const copy = t.home;
  const job = t.repairs[item.id];
  return (
    <GlassPanel as="article" className="repair-case">
      <h3>{job.title}</h3>
      <div className="repair-comparison">
        <RepairPhoto photo={{ ...item.before, alt: job.before }} caption={copy.before} label={copy.viewPhoto + " · " + job.before} />
        <RepairPhoto photo={{ ...item.after, alt: job.after }} caption={copy.after} label={copy.viewPhoto + " · " + job.after} />
      </div>
    </GlassPanel>
  );
}

export function Repairs() {
  const { t } = usePreferences();
  const copy = t.home;
  return (
    <GlassSection id="reparaciones" className="wrap repair-gallery" aria-labelledby="reparaciones-titulo">
      <SectionHeading id="reparaciones-titulo" title={copy.repairs} description={copy.repairGallery} />
      <div className="repair-cases" data-reveal="">
        {repairs.filter(({ featured }) => featured).map((item) => <RepairComparison key={item.id} item={item} />)}
      </div>
      <details className="repair-more">
        <summary>{copy.moreRepairs}</summary>
        <div className="repair-cases">
          {repairs.filter(({ featured }) => !featured).map((item) => <RepairComparison key={item.id} item={item} />)}
        </div>
      </details>
      <div className="section-actions"><GlassButton href="#contacto" variant="glass">{copy.repairCta}</GlassButton></div>
    </GlassSection>
  );
}
