import { MapPin } from "lucide-react";
import { usePreferences } from "@/components/Preferences";
import { AppIcon } from "@/components/ui/AppIcon";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { businessLocation } from "@/data/business.config";

export function MapLegend() {
  const { t } = usePreferences();
  const copy = t.map;

  return (
    <details className="map-legend-disclosure">
      <summary>{copy.openLegend}</summary>
      <GlassPanel variant="floating" className="map-legend-panel">
        <ul className="map-legend" aria-label={copy.legend} role="list">
          {businessLocation.coordinates && <li><AppIcon icon={MapPin} size="small" className="map-key--pin" /> {copy.shopPin}</li>}
          {businessLocation.propertyOutline.length >= 4 && <li><span className="map-key map-key--property" aria-hidden="true" /> {copy.property}</li>}
          {businessLocation.accessPath.length > 1 && <li><span className="map-key map-key--access" aria-hidden="true" /> {copy.access}</li>}
        </ul>
      </GlassPanel>
    </details>
  );
}
