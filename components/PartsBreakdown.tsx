"use client";

import { useId, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { usePreferences } from "@/components/Preferences";
import { ContactForm } from "@/components/ContactForm";
import { AppIcon } from "@/components/ui/AppIcon";
import { AutomotivePhoto } from "@/components/ui/AutomotivePhoto";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Button, GlassButton } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { ServiceModal } from "@/components/ui/ServiceModal";
import { sparePartGroups, type SparePart } from "@/data/services.config";
import "./spare-parts.css";

const entries = sparePartGroups.flatMap(({ id, parts }) =>
  parts.map((part: SparePart) => ({ part, group: id })),
);

function PartConsultation({ part, onDismiss }: { part: SparePart; onDismiss: () => void }) {
  const { t } = usePreferences();
  const { name, description } = t.breakdown.items[part.id];
  const formId = useId();

  return (
    <ServiceModal compact title={name} emblem={<AppIcon icon={part.icon} size="large" />}
      onDismiss={onDismiss}
      footer={
        <Button type="submit" variant="whatsapp" form={formId}>
          <BrandIcon brand="whatsappFilled" />{t.common.consult}
        </Button>
      }>
      {part.photo && (
        <div className="part-detail-photo">
          <AutomotivePhoto photo={{ ...part.photo, alt: name }} sizes="(max-width: 767px) 75vw, 250px" />
        </div>
      )}
      <div className="part-dialog-copy">
        <p>{description}</p>
        <p className="part-dialog-details">{t.breakdown.details}</p>
      </div>
      <ContactForm formId={formId} context={{ piece: part.id }} />
    </ServiceModal>
  );
}

export function PartsBreakdown() {
  const { t } = usePreferences();
  const copy = t.breakdown;
  const [selected, setSelected] = useState<{ part: SparePart; trigger: HTMLButtonElement } | null>(null);

  return (
    <section id="despiece" className="parts-breakdown" aria-labelledby="despiece-titulo">
      <div className="section-heading parts-heading">
        <h3 id="despiece-titulo">{copy.title}</h3>
        <p>{copy.description}</p>
      </div>
      <ol className="parts-grid" role="list">
        {entries.map(({ part, group }, index) => {
          const item = copy.items[part.id];
          return (
            <li key={part.id}>
              <GlassCard title={item.name} description={item.description} heading="h4" eyebrow={copy.groups[group]}
                className="part-card"
                image={
                  <div className="part-card-visual">
                    <span className="part-card-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    {part.photo
                      ? <AutomotivePhoto photo={{ ...part.photo, alt: item.name }} sizes="(max-width: 580px) 30vw, 370px" />
                      : <AppIcon icon={part.icon} />}
                  </div>
                }
                action={
                  <GlassButton variant="quiet" className="part-availability" aria-haspopup="dialog"
                    aria-label={t.catalog.availability + " · " + item.name}
                    onClick={(event) => setSelected({ part, trigger: event.currentTarget })}>
                    {t.catalog.availability}<AppIcon icon={ArrowUpRight} size="small" />
                  </GlassButton>
                } />
            </li>
          );
        })}
      </ol>
      {selected && (
        <PartConsultation part={selected.part} onDismiss={() => {
          selected.trigger.focus({ preventScroll: true });
          setSelected(null);
        }} />
      )}
    </section>
  );
}
