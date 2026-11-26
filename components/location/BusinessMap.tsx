"use client";

import { usePreferences } from "@/components/Preferences";
import { Layers, MapPin, Move, RotateCw, Scan, Signpost, X } from "lucide-react";
import { Map as LibreMap, setWorkerUrl, setWorkerCount, type MapSourceDataEvent, type RasterTileSource } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { business, businessLocation } from "@/data/business.config";
import { lngLat, mapConfig, type MapView } from "@/data/map.config";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { AppIcon } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";
import { GlassInfoBadge } from "@/components/ui/GlassInfoBadge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MapControls } from "./MapControls";
import { MapSkeleton } from "./MapSkeleton";
import { MapLocationMarker } from "./MapLocationMarker";
import { RouteControls } from "./RouteControls";
import { layers, mapStyle } from "./mapStyle";
import { mapLocale, renderMapLocale } from "./mapLocale";
import { messages, type MapNotice } from "@/i18n/messages";
import { cameraAngle, useMapCamera } from "./useMapCamera";
import { routeAvailable, routeBounds, useMapRoute } from "./useMapRoute";
import "maplibre-gl/dist/maplibre-gl.css";

export interface BusinessMapProps {
  view: MapView;
  onViewChange: (view: MapView) => void;
  onUnavailable: (reason: MapNotice) => void;
  onReadyChange: (ready: boolean) => void;
}

const { accessPath, coordinates, entranceCoordinates, landmarks } = businessLocation;
const camera = mapConfig.camera;
const distinctEntrance = entranceCoordinates && (!coordinates || entranceCoordinates.some((value, index) => value !== coordinates[index]));

export function BusinessMap({ view, onViewChange, onUnavailable, onReadyChange }: BusinessMapProps) {
  const { t } = usePreferences();
  const copy = t.map;
  const container = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const businessTrigger = useRef<HTMLButtonElement>(null);
  const instance = useRef<LibreMap | null>(null);
  const introduced = useRef(false);
  const drawnSources = useRef(new Set<string>());
  const [readyMap, setReadyMap] = useState<LibreMap | null>(null);
  const [styled, setStyled] = useState(false);
  const [hasTiles, setHasTiles] = useState(false);
  const interactive = !!readyMap && hasTiles;
  const [zoom, setZoom] = useState(camera.zoom as number);
  const [expanded, setExpanded] = useState(false);
  const [showRefs, setShowRefs] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [gestures, setGestures] = useState(false);
  const [imageryError, setImageryError] = useState(false);
  const [interruptedSource, setInterruptedSource] = useState<string | null>(null);
  const baseSource = view === "streets" ? "streets" : "imagery";
  const mapCamera = useMapCamera(instance);
  const route = useMapRoute(instance, () => mapCamera.focusEntrance(view));

  useEffect(() => {
    const target = container.current;
    if (!target) return;
    let map: LibreMap;
    const animateIntro = !!coordinates && window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
    setWorkerUrl("/maplibre/maplibre-gl-worker.js");
    setWorkerCount(2);
    try {
      map = new LibreMap({
        container: target,
        style: mapStyle(target),
        center: lngLat(animateIntro ? businessLocation.areaCenter : camera.center),
        zoom: animateIntro ? camera.contextZoom : camera.zoom,
        ...(animateIntro ? { pitch: 0, bearing: 0 } : cameraAngle("oblique")),
        minZoom: camera.minZoom,
        maxZoom: camera.maxZoom,
        maxPitch: 65,
        renderWorldCopies: false,
        cooperativeGestures: true,
        locale: mapLocale(messages[document.documentElement.lang.startsWith("en") ? "en" : "es"].map),
        attributionControl: { compact: false },
        maxTileCacheSize: 100,
        pixelRatio: Math.min(devicePixelRatio || 1, 1.5),
      });
    } catch {
      const frame = requestAnimationFrame(() => onUnavailable("webgl"));
      return () => cancelAnimationFrame(frame);
    }
    instance.current = map;
    let interacted = false;
    function trackInput() {
      if (!introduced.current) interacted = true;
      if (map.isMoving()) mapCamera.stopCameraAnimation();
    }
    target.addEventListener("pointerdown", trackInput, { passive: true });
    target.addEventListener("wheel", trackInput, { passive: true });
    target.addEventListener("keydown", trackInput);
    function recordTile(event: MapSourceDataEvent) {
      if (event.tile?.state !== "loaded" || drawnSources.current.has(event.sourceId)) return;
      drawnSources.current.add(event.sourceId);
      if (event.sourceId === "imagery" || event.sourceId === "streets") setHasTiles(true);
    }

    map.on("sourcedata", recordTile);
    map.on("error", () => { /* El respaldo se activa si la fuente no logra dibujar teselas. */ });
    map.once("style.load", () => setStyled(true));
    map.on("load", () => setReadyMap(map));
    map.on("zoomend", () => setZoom(map.getZoom()));
    map.on("webglcontextlost", () => onUnavailable("lost"));
    map.once("idle", () => {
      if (!animateIntro || interacted || introduced.current || !drawnSources.current.has("imagery") || map.getZoom() !== camera.contextZoom) return;
      introduced.current = true;
      mapCamera.playIntroAnimation("oblique");
    });
    const observer = new ResizeObserver(() => map.resize());
    observer.observe(target);

    return () => {
      observer.disconnect();
      target.removeEventListener("pointerdown", trackInput);
      target.removeEventListener("wheel", trackInput);
      target.removeEventListener("keydown", trackInput);
      map.remove();
      instance.current = null;
    };
  }, [onUnavailable, mapCamera]);

  useEffect(() => { onReadyChange(interactive); }, [onReadyChange, interactive]);

  useEffect(() => {
    if (readyMap) renderMapLocale(readyMap, copy);
  }, [readyMap, copy, gestures]);

  useEffect(() => {
    if (!readyMap) return;
    const streets = view === "streets";
    readyMap.setLayoutProperty(layers.imagery, "visibility", streets ? "none" : "visible");
    readyMap.setLayoutProperty(layers.focusMask, "visibility", streets ? "none" : "visible");
    readyMap.setLayoutProperty(layers.labels, "visibility", streets ? "none" : "visible");
    readyMap.setLayoutProperty(layers.streets, "visibility", streets ? "visible" : "none");
    if (!readyMap.isMoving() && (view !== "oblique" || !coordinates || introduced.current || readyMap.getZoom() !== camera.contextZoom)) {
      mapCamera.switchView(view);
    } else if (view !== "oblique") {
      mapCamera.switchView(view);
    }
  }, [view, readyMap, mapCamera]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (drawnSources.current.has(baseSource)) return;
      if (baseSource === "streets" || !readyMap) {
        onUnavailable("tileFailure");
      } else {
        setImageryError(true);
        onViewChange("streets");
      }
    }, mapConfig.tileTimeout);
    return () => clearTimeout(timer);
  }, [baseSource, readyMap, onViewChange, onUnavailable]);

  useEffect(() => {
    const source = readyMap?.getSource<RasterTileSource>(baseSource);
    if (!readyMap || !source) return;
    const reportFailure = () => {
      if (drawnSources.current.has(baseSource)) setInterruptedSource(baseSource);
    };
    const reportRecovery = (event: MapSourceDataEvent) => {
      if (event.sourceId === baseSource && event.tile?.state === "loaded") {
        setInterruptedSource((current) => current === baseSource ? null : current);
      }
    };
    source.on("error", reportFailure);
    readyMap.on("sourcedata", reportRecovery);
    return () => {
      source.off("error", reportFailure);
      readyMap.off("sourcedata", reportRecovery);
    };
  }, [baseSource, readyMap]);

  useEffect(() => {
    const fullscreen = () => {
      if (!document.fullscreenElement) setExpanded(false);
    };
    document.addEventListener("fullscreenchange", fullscreen);
    return () => document.removeEventListener("fullscreenchange", fullscreen);
  }, []);

  function expand() {
    const element = viewport.current;
    if (expanded) {
      if (element && document.fullscreenElement === element) void document.exitFullscreen();
      setExpanded(false);
    } else {
      setExpanded(true);
      if (element?.requestFullscreen && document.fullscreenEnabled) {
        void element.requestFullscreen().catch(() => { /* La vista ampliada sigue disponible. */ });
      }
    }
  }

  function focusBusiness(trigger: HTMLButtonElement) {
    businessTrigger.current = trigger;
    route.exit();
    setSelected("business");
    mapCamera.focusBusiness(view);
  }

  function focusAccess() {
    setSelected("access");
    mapCamera.focusAccess(view);
  }

  function focusEntrance() {
    route.exit();
    route.show();
    setSelected("entrance");
    mapCamera.focusEntrance(view);
  }

  function reset() {
    route.exit();
    setSelected(null);
    mapCamera.resetCamera(view);
  }

  function playRoute(restart = false) {
    if (!routeAvailable) return;
    setSelected("entrance");
    if (restart || route.state !== "paused") mapCamera.fitRoute(routeBounds());
    route.play(restart);
  }

  function enableGestures() {
    if (gestures) readyMap?.cooperativeGestures.enable();
    else readyMap?.cooperativeGestures.disable();
    setGestures(!gestures);
  }

  const reference = landmarks.find((landmark) => selected === landmark.name);

  return (
    <div className="business-map business-map--3d">
      <div ref={viewport} className={"map-viewport " + (expanded ? "map-viewport--expanded" : "")}>
        <GlassInfoBadge className="map-caption" icon={<AppIcon icon={MapPin} />}
          title={businessLocation.district + ", " + businessLocation.province}
          detail={view === "streets" ? copy.streetMap : (mapConfig.imagery.custom ? copy.providerImage : copy.aerialImage)} />
        <div ref={container} className="map-canvas map-canvas--3d" aria-label={copy.region} role="region" inert={!interactive} />
        {!interactive && <MapSkeleton label={styled ? t.mapLoading.tiles : t.mapLoading.style} />}
        {readyMap && hasTiles && (
          <>
            <MapControls zoom={zoom} minZoom={camera.minZoom} maxZoom={camera.maxZoom} expanded={expanded}
              onZoomIn={() => readyMap.zoomIn({ duration: 0 })}
              onZoomOut={() => readyMap.zoomOut({ duration: 0 })}
              onReset={reset} onExpand={expand} canCenter={coordinates !== null} onCenter={(event) => focusBusiness(event.currentTarget)}
              rotation={<Button className="map-tool" variant="glass" aria-label={copy.rotate} title={copy.rotate} onClick={mapCamera.rotate}><AppIcon icon={RotateCw} /></Button>} />
            {coordinates && <MapLocationMarker map={readyMap} point={coordinates} kind="business"
              label={business.name} shortLabel={business.shortName} selected={selected === "business"} onSelect={focusBusiness} />}
            {distinctEntrance && entranceCoordinates && <MapLocationMarker map={readyMap} point={entranceCoordinates} kind="entrance"
              label={copy.entrance} selected={selected === "entrance"} onSelect={focusEntrance} />}
            {showRefs && landmarks.map((landmark) => (
              <MapLocationMarker key={landmark.name} map={readyMap} point={landmark.coordinates} kind="landmark"
                label={landmark.name} selected={selected === landmark.name}
                onSelect={() => {
                  setSelected(landmark.name);
                  readyMap.easeTo({
                    center: lngLat(landmark.coordinates),
                    zoom: Math.max(readyMap.getZoom(), camera.zoom),
                    duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : camera.duration,
                  });
                }} />
            ))}
          </>
        )}
        {selected === "business" && (
          <GlassPanel variant="floating" className="map-selection" role="group" aria-label={copy.information}>
            <Button variant="quiet" className="map-selection-close" aria-label={copy.closeInfo} onClick={() => {
              setSelected(null);
              businessTrigger.current?.focus({ preventScroll: true });
            }}><AppIcon icon={X} /></Button>
            <strong>{business.name}</strong>
            <p>{t.common.specialty}. {businessLocation.address}.</p>
            <div>
              <Button variant="secondary" href={"tel:" + business.voice.mobile.tel}>{copy.call}</Button>
              <Button href={businessLocation.wazeUrl} variant="glass" target="_blank" rel="noopener noreferrer" aria-label={copy.wazeLocation}><BrandIcon brand="waze" /> Waze</Button>
            </div>
          </GlassPanel>
        )}
      </div>
      <div className="map-toolbar">
        {readyMap && hasTiles && (
          <>
            <Button variant="quiet" onClick={() => { route.exit(); setSelected(null); mapCamera.showSurroundings(view); }}><AppIcon icon={Scan} /> {copy.overview}</Button>
            {landmarks.length > 0 && <Button variant="quiet" aria-pressed={showRefs} onClick={() => { setShowRefs(!showRefs); if (reference) setSelected(null); }}>
              <AppIcon icon={Layers} /> {showRefs ? copy.hideLandmarks : copy.showLandmarks}
            </Button>}
            <Button variant="quiet" className="map-gesture-toggle" aria-pressed={gestures} onClick={enableGestures}>
              <AppIcon icon={Move} /> {gestures ? copy.release : copy.move}
            </Button>
            {accessPath.length > 1 && <Button variant="quiet" onClick={focusAccess}>
              <AppIcon icon={Signpost} /> {copy.showAccess}
            </Button>}
            {entranceCoordinates && <Button variant="quiet" onClick={focusEntrance}><AppIcon icon={Signpost} /> {copy.showEntrance}</Button>}
          </>
        )}
        {interruptedSource === baseSource
          ? <p role="status">{copy.partialTileFailure}</p>
          : imageryError && view === "streets" && <p role="status">{copy.imageryError}</p>}
        {reference && <p role="status">{reference.name} · {copy.landmark}</p>}
        {(selected === "access" || selected === "entrance") && <p role="status">{copy.accessInstructions}</p>}
      </div>
      {interactive && routeAvailable && <RouteControls playing={route.state === "playing"} started={route.state !== "idle"}
        onPlay={() => playRoute()} onPause={route.pause} onRestart={() => playRoute(true)} onExit={reset} />}
    </div>
  );
}
