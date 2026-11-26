"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { usePreferences } from "@/components/Preferences";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { businessLocation } from "@/data/business.config";
import { mapConfig, type MapView } from "@/data/map.config";
import type { MapNotice } from "@/i18n/messages";
import { areaMapUrl } from "@/lib/directions";
import { LocationFallback } from "./LocationFallback";
import { MapSkeleton } from "./MapSkeleton";
import { MapLegend } from "./MapLegend";
import { MapViewSelector } from "./MapViewSelector";
import type { BusinessMapProps } from "./BusinessMap";

export function DeferredMap({ children }: { children: ReactNode }) {
  const { t } = usePreferences();
  const copy = t.map;
  const boundary = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [Map, setMap] = useState<ComponentType<BusinessMapProps> | null>(null);
  const [StreetMap, setStreetMap] = useState<ComponentType | null>(null);
  const [fallback, setFallback] = useState<MapNotice | null>(null);
  const [failed, setFailed] = useState(false);
  const [usable, setUsable] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [view, setView] = useState<MapView>("oblique");

  useEffect(() => {
    const element = boundary.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        setVisible(true);
      }
    }, { rootMargin: "200px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const showFallback = useCallback((reason: MapNotice) => {
    setUsable(false);
    setFallback(reason);
  }, []);

  useEffect(() => {
    if (!visible || fallback) return;
    let active = true;
    const timer = window.setTimeout(() => showFallback("importFailure"), mapConfig.tileTimeout);
    import("./BusinessMap")
      .then(({ BusinessMap }) => { if (active) setMap(() => BusinessMap); })
      .catch(() => { if (active) showFallback("importFailure"); })
      .finally(() => window.clearTimeout(timer));
    return () => { active = false; window.clearTimeout(timer); };
  }, [visible, attempt, fallback, showFallback]);

  useEffect(() => {
    if (!fallback) return;
    let active = true;
    const timer = window.setTimeout(() => { active = false; setFailed(true); }, mapConfig.tileTimeout);
    import("./StreetMap")
      .then(({ StreetMap }) => { if (active) setStreetMap(() => StreetMap); })
      .catch(() => { if (active) setFailed(true); })
      .finally(() => window.clearTimeout(timer));
    return () => { active = false; window.clearTimeout(timer); };
  }, [fallback, attempt]);

  function retry() {
    setFailed(false);
    setFallback(null);
    setStreetMap(null);
    setMap(null);
    setUsable(false);
    setView("oblique");
    setAttempt((value) => value + 1);
  }

  return (
    <div className="location-layout">
      <div className="map-shell" ref={boundary}>
        <div className="map-display-controls">
          <MapViewSelector view={view} onChange={setView} available={usable && !fallback} />
          <MapLegend />
        </div>
        {fallback
          ? (StreetMap ? <div className="street-fallback"><p role="status">{copy[fallback]}</p><StreetMap /></div>
            : failed ? <LocationFallback onRetry={retry} /> : <MapSkeleton label={copy[fallback]} detail={t.mapLoading.streets} />)
          : (Map ? <Map view={view} onViewChange={setView} onUnavailable={showFallback} onReadyChange={setUsable} />
            : <MapSkeleton label={copy.mapOf + businessLocation.district} detail={copy.preparing} />)}
        <noscript><a className="static-map-link" href={areaMapUrl()}>{copy.osmArea}</a></noscript>
      </div>
      <GlassPanel as="aside" variant="elevated" className="location-info">{children}</GlassPanel>
    </div>
  );
}
