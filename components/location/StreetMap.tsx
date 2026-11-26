"use client";

import { usePreferences } from "@/components/Preferences";
import { Layers, MapPin, Move, Signpost } from "lucide-react";
import { layerGroup, map, polygon, polyline, tileLayer, type Map as LeafletMap, type Polyline } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { businessLocation, mapTiles } from "@/data/business.config";
import { accessBounds } from "@/data/map.config";
import { AppIcon } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";
import { GlassInfoBadge } from "@/components/ui/GlassInfoBadge";
import { LocationFallback } from "./LocationFallback";
import { MapControls } from "./MapControls";
import { MapSkeleton } from "./MapSkeleton";
import { BusinessMarker, EntranceMarker, LandmarkMarker, renderLeafletLocale } from "./Markers";
import "leaflet/dist/leaflet.css";

const {
  accessPath, areaCenter, coordinates, entranceCoordinates, entranceGuide, landmarks, propertyOutline,
} = businessLocation;
const baseCenter = coordinates ?? areaCenter;
const baseZoom = coordinates ? 17 : 16;

export function StreetMap() {
  const { t } = usePreferences();
  const copy = t.map;
  const container = useRef<HTMLDivElement>(null);
  const instance = useRef<LeafletMap | null>(null);
  const landmarkLayer = useRef<ReturnType<typeof layerGroup> | null>(null);
  const entrance = useRef<ReturnType<typeof EntranceMarker> | null>(null);
  const guide = useRef<Polyline | null>(null);
  const [zoom, setZoom] = useState(baseZoom);
  const [expanded, setExpanded] = useState(false);
  const [showRefs, setShowRefs] = useState(true);
  const [showEntrance, setShowEntrance] = useState(false);
  const [touch, setTouch] = useState(false);
  const [gestures, setGestures] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = container.current;
    if (!node) return;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    setTouch(coarsePointer);
    const view = map(node, {
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: !coarsePointer,
      touchZoom: !coarsePointer,
      minZoom: 3,
      maxZoom: mapTiles.maxZoom,
      zoomAnimation: false,
      fadeAnimation: false,
      markerZoomAnimation: false,
    }).setView([baseCenter[0], baseCenter[1]], baseZoom);
    instance.current = view;
    view.attributionControl.setPrefix(false);
    view.on("zoomend", () => setZoom(view.getZoom()));

    let tileCount = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tiles = tileLayer(mapTiles.url, {
      attribution: mapTiles.attribution,
      maxZoom: mapTiles.maxZoom,
      referrerPolicy: "strict-origin-when-cross-origin",
    });
    tiles.on("loading", () => {
      tileCount = 0;
      clearTimeout(timer);
      timer = setTimeout(() => { if (!tileCount) setFailed(true); }, 10000);
    });
    tiles.on("tileload", () => {
      if (tileCount++ !== 0) return;
      setReady(true);
      setFailed(false);
    });
    tiles.on("load", () => {
      clearTimeout(timer);
      if (!tileCount) setFailed(true);
    });
    tiles.addTo(view);

    const colors = getComputedStyle(node);
    const propertyColor = colors.getPropertyValue("--map-property").trim();
    const accessColor = colors.getPropertyValue("--map-access").trim();
    if (propertyOutline.length >= 4) {
      polygon(propertyOutline.map(([lat, lng]) => [lat, lng]), {
        color: propertyColor, weight: 1.5, fillOpacity: 0.08, interactive: false, className: "map-property-outline",
      }).addTo(view);
    }
    if (accessPath.length > 1) {
      const points = accessPath.map(([lat, lng]) => [lat, lng] as [number, number]);
      polyline(points, { color: colors.getPropertyValue("--map-outline").trim(), weight: 4, opacity: 0.65, interactive: false }).addTo(view);
      polyline(points, { color: accessColor, weight: 1.8, opacity: 0.9, interactive: false, className: "map-access-line" })
        .addTo(view);
    }
    if (coordinates) BusinessMarker(coordinates).addTo(view);
    if (entranceCoordinates) entrance.current = EntranceMarker(entranceCoordinates).addTo(view);
    landmarkLayer.current = layerGroup(landmarks.map(LandmarkMarker)).addTo(view);

    const observer = new ResizeObserver(() => view.invalidateSize({ pan: false }));
    observer.observe(node);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      tiles.off();
      view.remove();
      instance.current = null;
      landmarkLayer.current = null;
      entrance.current = null;
      guide.current = null;
    };
  }, [attempt]);

  useEffect(() => {
    const view = instance.current;
    if (!view) return;
    const update = () => renderLeafletLocale(view.getContainer(), copy, t.common.directions);
    update();
    view.on("popupopen tooltipopen layeradd", update);
    return () => { view.off("popupopen tooltipopen layeradd", update); };
  }, [attempt, copy, t.common.directions]);

  function reset() {
    guide.current?.remove();
    guide.current = null;
    setShowEntrance(false);
    instance.current?.closePopup().setView([baseCenter[0], baseCenter[1]], baseZoom, { animate: false });
  }

  function toggleRefs() {
    const view = instance.current;
    const layer = landmarkLayer.current;
    if (!view || !layer) return;
    if (showRefs) layer.remove();
    else layer.addTo(view);
    setShowRefs(!showRefs);
  }

  function focusAccess() {
    const bounds = accessBounds();
    if (!bounds) return;
    instance.current?.closePopup().fitBounds(bounds.map(([lng, lat]) => [lat, lng] as [number, number]), {
      padding: [38, 38], maxZoom: 18, animate: false,
    });
    setShowEntrance(true);
  }

  function focusEntrance() {
    const view = instance.current;
    if (!view || !entranceCoordinates) return;
    view.setView([entranceCoordinates[0], entranceCoordinates[1]], 19, { animate: false });
    if (!guide.current && entranceGuide.length > 1) {
      guide.current = polyline(entranceGuide.map(([lat, lng]) => [lat, lng] as [number, number]), {
        color: getComputedStyle(view.getContainer()).getPropertyValue("--map-access").trim(), weight: 3, dashArray: "5 8", interactive: false,
      }).addTo(view);
    }
    entrance.current?.openPopup();
    setShowEntrance(true);
  }

  function toggleGestures() {
    const view = instance.current;
    if (!view) return;
    if (gestures) {
      view.dragging.disable();
      view.touchZoom.disable();
    } else {
      view.dragging.enable();
      view.touchZoom.enable();
    }
    setGestures(!gestures);
  }

  function retry() {
    setZoom(baseZoom);
    setShowRefs(true);
    setShowEntrance(false);
    setGestures(false);
    setFailed(false);
    setReady(false);
    setAttempt((value) => value + 1);
  }

  return (
    <div className={"business-map " + (expanded ? "business-map--expanded" : "")}>
      <div className="map-viewport">
        <div ref={container} className="map-canvas" aria-label={copy.region} role="region" inert={!ready || failed} />
        {!failed && ready && (
          <>
            <GlassInfoBadge className="map-caption" icon={<AppIcon icon={MapPin} />}
              title={copy.streetMap} detail={businessLocation.street + ", " + businessLocation.district} />
            <MapControls zoom={zoom} maxZoom={mapTiles.maxZoom} expanded={expanded}
              onZoomIn={() => instance.current?.zoomIn()} onZoomOut={() => instance.current?.zoomOut()}
              onReset={reset} onExpand={() => setExpanded(!expanded)} canCenter={coordinates !== null}
              onCenter={() => {
                if (!coordinates) return;
                instance.current?.setView([coordinates[0], coordinates[1]], 18, { animate: false });
              }} />
          </>
        )}
        {failed && <LocationFallback onRetry={retry} />}
        {!failed && !ready && <MapSkeleton label={t.mapLoading.streets} />}
      </div>
      <div className="map-toolbar">
        {!failed && ready && landmarks.length > 0 && <Button variant="quiet" aria-pressed={showRefs} onClick={toggleRefs}>
          <AppIcon icon={Layers} /> {showRefs ? copy.hideLandmarks : copy.showLandmarks}
        </Button>}
        {!failed && ready && accessPath.length > 1 && <Button variant="quiet" onClick={focusAccess}>
          <AppIcon icon={Signpost} /> {copy.showAccess}
        </Button>}
        {!failed && ready && entranceCoordinates && <Button variant="quiet" aria-pressed={showEntrance} onClick={focusEntrance}>
          <AppIcon icon={Signpost} /> {copy.showEntrance}
        </Button>}
        {!failed && ready && touch && <Button variant="quiet" aria-pressed={gestures} onClick={toggleGestures}>
          <AppIcon icon={Move} /> {gestures ? copy.release : copy.move}
        </Button>}
        {showEntrance ? <p role="status">{copy.accessInstructions}</p>
          : !coordinates && <p>{copy.wazeDestination}</p>}
      </div>
    </div>
  );
}
