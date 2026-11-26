import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { CarFront, MapPin, Zap } from "lucide-react";
import { Marker, type Map } from "maplibre-gl";
import { AppIcon } from "@/components/ui/AppIcon";
import type { Coordinates } from "@/data/business.config";
import { lngLat } from "@/data/map.config";

export function MapLocationMarker({ map, point, label, shortLabel, kind, selected, onSelect }: {
  map: Map; point: Coordinates; label: string; kind: "business" | "entrance" | "landmark";
  shortLabel?: string; selected: boolean; onSelect: (trigger: HTMLButtonElement) => void;
}) {
  const [host] = useState(() => {
    const element = document.createElement("div");
    element.setAttribute("role", "presentation");
    return element;
  });
  const [latitude, longitude] = point;
  useEffect(() => {
    const marker = new Marker({ element: host, anchor: "bottom", subpixelPositioning: true })
      .setLngLat(lngLat([latitude, longitude])).addTo(map);
    return () => { marker.remove(); };
  }, [host, latitude, longitude, map]);

  const Icon = kind === "business" ? Zap : kind === "entrance" ? CarFront : MapPin;
  return createPortal(
    <button type="button" className={"geo-marker geo-marker--" + kind} aria-label={label} aria-pressed={selected} onClick={(event) => onSelect(event.currentTarget)}>
      <AppIcon icon={Icon} size="small" />
      <span className={shortLabel ? "geo-marker-full" : undefined}>{label}</span>
      {shortLabel && <span className="geo-marker-short" aria-hidden="true">{shortLabel}</span>}
    </button>,
    host,
  );
}
