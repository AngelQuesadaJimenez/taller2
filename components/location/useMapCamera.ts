import { useMemo, type RefObject } from "react";
import type { Map, CameraOptions, LngLatBoundsLike } from "maplibre-gl";
import { businessLocation } from "@/data/business.config";
import { accessBounds, lngLat, mapConfig, type MapView } from "@/data/map.config";

const camera = mapConfig.camera;

export function minimizeMapMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4);
}

export function cameraAngle(view: MapView): CameraOptions {
  return view === "oblique" ? { pitch: camera.pitch, bearing: camera.bearing } : { pitch: 0, bearing: 0 };
}

export function useMapCamera(instance: RefObject<Map | null>) {
  return useMemo(() => {
    function move(options: CameraOptions, fly = false, duration: number = camera.duration) {
      const map = instance.current;
      if (!map) return;
      map.stop();
      if (minimizeMapMotion()) map.jumpTo(options);
      else if (fly) map.flyTo({ ...options, duration: camera.introDuration });
      else map.easeTo({ ...options, duration });
    }

    return {
      zoomBy(step: number) {
        const map = instance.current;
        if (map) {
          const zoom = Math.max(camera.minZoom, Math.min(camera.maxZoom, map.getZoom() + step));
          move({ zoom }, false, camera.zoomDuration);
        }
      },
      focusLandmark(center: [number, number]) {
        const map = instance.current;
        if (map) move({ center, zoom: Math.max(map.getZoom(), camera.zoom) });
      },
      focusBusiness(view: MapView) {
        if (!businessLocation.coordinates) return;
        move({ ...cameraAngle(view), center: lngLat(businessLocation.coordinates), zoom: camera.focusZoom });
      },
      focusAccess(view: MapView) {
        const bounds = accessBounds();
        const map = instance.current;
        if (!map || !bounds) return;
        map.stop();
        map.fitBounds(bounds, {
          ...cameraAngle(view),
          padding: 44,
          maxZoom: camera.focusZoom,
          duration: minimizeMapMotion() ? 0 : camera.duration,
        });
      },
      focusEntrance(view: MapView) {
        if (!businessLocation.entranceCoordinates) return;
        move({ ...cameraAngle(view), center: lngLat(businessLocation.entranceCoordinates), zoom: camera.entranceZoom });
      },
      showSurroundings(view: MapView) {
        move({ ...cameraAngle(view), center: lngLat(businessLocation.areaCenter), zoom: camera.contextZoom });
      },
      resetCamera(view: MapView) {
        move({ ...cameraAngle(view), center: lngLat(camera.center), zoom: camera.zoom });
      },
      switchView(view: MapView) {
        move(cameraAngle(view));
      },
      rotate() {
        const map = instance.current;
        if (map) move({ bearing: map.getBearing() + camera.turn });
      },
      fitRoute(bounds: LngLatBoundsLike) {
        instance.current?.stop();
        instance.current?.fitBounds(bounds, {
          pitch: 0, bearing: 0, padding: mapConfig.route.inset,
          maxZoom: camera.entranceZoom, duration: minimizeMapMotion() ? 0 : camera.duration,
        });
      },
      playIntroAnimation(view: MapView) {
        if (!businessLocation.coordinates || minimizeMapMotion()) return;
        move({ ...cameraAngle(view), center: lngLat(businessLocation.coordinates), zoom: camera.focusZoom }, true);
      },
      stopCameraAnimation() { instance.current?.stop(); },
    };
  }, [instance]);
}
