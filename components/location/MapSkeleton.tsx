import { MapPin } from "lucide-react";
import { AppIcon } from "@/components/ui/AppIcon";
import { Skeleton } from "@/components/ui/Skeleton";

export function MapSkeleton({ label, detail }: { label: string; detail?: string }) {
  return (
    <div className="map-skeleton" role="status">
      <div className="map-skeleton-art" aria-hidden="true">
        <Skeleton className="map-skeleton-caption" />
        <Skeleton className="map-skeleton-pin" />
        <Skeleton className="map-skeleton-controls" />
      </div>
      <div className="map-skeleton-status">
        <AppIcon icon={MapPin} />
        <div><strong>{label}</strong>{detail && <p>{detail}</p>}</div>
      </div>
    </div>
  );
}
