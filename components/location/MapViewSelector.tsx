"use client";

import { usePreferences } from "@/components/Preferences";
import { Box, Layers, Map as MapIcon } from "lucide-react";
import { mapViews, type MapView } from "@/data/map.config";
import { AppIcon } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";

const icons = { oblique: Box, aerial: Layers, streets: MapIcon };

export function MapViewSelector({ view, onChange, available }: {
  view: MapView; onChange: (value: MapView) => void; available: boolean;
}) {
  const { t } = usePreferences();
  const copy = t.map;
  return (
    <div className="map-views" role="group" aria-label={copy.views}>
      {mapViews.map((id) => {
        const Icon = icons[id];
        return (
          <Button key={id} variant="glass" className="map-view-option" disabled={!available}
            aria-pressed={available && id === view} onClick={() => onChange(id)}>
            <AppIcon icon={Icon} /> {t.views[id]}
          </Button>
        );
      })}
    </div>
  );
}
