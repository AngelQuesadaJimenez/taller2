"use client";

import { usePreferences } from "@/components/Preferences";
import type { MouseEventHandler, ReactNode } from "react";
import { Crosshair, Maximize2, Minus, Plus, RotateCcw, Shrink } from "lucide-react";
import { AppIcon } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";

interface Props {
  zoom: number;
  minZoom?: number;
  maxZoom: number;
  rotation?: ReactNode;
  expanded: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onCenter: MouseEventHandler<HTMLButtonElement>;
  onExpand: () => void;
  canCenter: boolean;
}

export function MapControls({ zoom, minZoom = 3, maxZoom, rotation, expanded, onZoomIn, onZoomOut, onReset, onCenter, onExpand, canCenter }: Props) {
  const { t } = usePreferences();
  const copy = t.map;
  return (
    <div className="map-controls" role="group" aria-label={copy.controls}>
      <Button className="map-tool" variant="glass" aria-label={copy.zoomIn} title={copy.zoomIn} onClick={onZoomIn} disabled={zoom >= maxZoom}><AppIcon icon={Plus} /></Button>
      <Button className="map-tool" variant="glass" aria-label={copy.zoomOut} title={copy.zoomOut} onClick={onZoomOut} disabled={zoom <= minZoom}><AppIcon icon={Minus} /></Button>
      <Button className="map-tool" variant="glass" aria-label={copy.reset} title={copy.reset} onClick={onReset}><AppIcon icon={RotateCcw} /></Button>
      {rotation}
      {canCenter && <Button className="map-tool" variant="glass" aria-label={copy.center} title={copy.center} onClick={onCenter}><AppIcon icon={Crosshair} /></Button>}
      <Button className="map-tool" variant="glass" aria-label={expanded ? copy.collapse : copy.fullscreen} title={expanded ? copy.collapse : copy.fullscreen} aria-expanded={expanded} onClick={onExpand}>
        {expanded ? <AppIcon icon={Shrink} /> : <AppIcon icon={Maximize2} />}
      </Button>
    </div>
  );
}
