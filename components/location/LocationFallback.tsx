"use client";

import { usePreferences } from "@/components/Preferences";
import { MapPin } from "lucide-react";
import { AppIcon } from "@/components/ui/AppIcon";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Button } from "@/components/ui/Button";
import { businessLocation } from "@/data/business.config";
import { areaMapUrl } from "@/lib/directions";

export function LocationFallback({ onRetry }: { onRetry: () => void }) {
  const { t } = usePreferences();
  const copy = t.map;
  return (
    <div className="location-fallback">
      <AppIcon icon={MapPin} size="large" />
      <div role="status">
        <strong>{copy.unavailable}</strong>
        <p>{businessLocation.address}</p>
      </div>
      <div className="fallback-actions">
        <Button variant="secondary" onClick={onRetry}>{copy.retry}</Button>
        <Button variant="outline" href={areaMapUrl()} target="_blank" rel="noopener noreferrer">
          <BrandIcon brand="openStreetMap" /> {copy.osm}
        </Button>
      </div>
    </div>
  );
}
