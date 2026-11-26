"use client";

import { usePreferences } from "@/components/Preferences";
import { ClipboardList, MessageCircle, CalendarCheck } from "lucide-react";
import { process } from "@/data/site-content";
import { AppIcon } from "@/components/ui/AppIcon";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassSection } from "@/components/ui/GlassSection";
import { SectionHeading } from "@/components/ui/SectionHeading";

const stepIcons = { consulta: MessageCircle, revision: ClipboardList, atencion: CalendarCheck };

export function Process() {
  const { t } = usePreferences();
  const copy = t.home;
  return (
    <GlassSection className="wrap process" id="proceso" aria-labelledby="proceso-titulo">
      <SectionHeading id="proceso-titulo" {...copy.process} />
      <GlassPanel variant="elevated" className="process-panel" data-reveal="">
        <ol className="process-grid" role="list">
          {process.map((id, index) => (
            <li className="process-step" key={id}>
              <GlassPanel variant="interactive" className="step-icon" aria-hidden="true">
                <AppIcon icon={stepIcons[id]} size="large" />
              </GlassPanel>
              <div className="step-copy">
                <span className="step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{t.process[id].title}</h3>
                <p>{t.process[id].text}</p>
              </div>
            </li>
          ))}
        </ol>
      </GlassPanel>
    </GlassSection>
  );
}
