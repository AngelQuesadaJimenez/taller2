"use client";

import { usePreferences } from "@/components/Preferences";
import "./map.css";
import { GlassSection } from "@/components/ui/GlassSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DeferredMap } from "./DeferredMap";
import { LocationInformation } from "./LocationInformation";

export function BusinessLocationSection() {
  const { t } = usePreferences();
  const copy = t.home;
  return (
    <GlassSection id="ubicacion" variant="band" className="location-section" aria-labelledby="ubicacion-titulo">
      <div className="wrap">
        <SectionHeading id="ubicacion-titulo" {...copy.location} />
        <DeferredMap><LocationInformation /></DeferredMap>
      </div>
    </GlassSection>
  );
}
