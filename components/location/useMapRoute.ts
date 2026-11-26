import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { GeoJSONSource, Map } from "maplibre-gl";
import { businessLocation } from "@/data/business.config";
import { lngLat, mapConfig } from "@/data/map.config";

type Position = [number, number];
type RouteState = "idle" | "playing" | "paused" | "complete";

const positions = businessLocation.entranceCoordinates ? businessLocation.entranceGuide.map(lngLat) : [];
const lengths = positions.reduce<number[]>((distances, point, index) => {
  const previous = positions[index - 1];
  const distance = previous
    ? Math.hypot(
      (point[0] - previous[0]) * Math.cos((point[1] + previous[1]) * Math.PI / 360),
      point[1] - previous[1],
    )
    : 0;
  distances.push((distances.at(-1) ?? 0) + distance);
  return distances;
}, []);
const total = lengths.at(-1) ?? 0;

export const routeAvailable = positions.length > 1 && total > 0;

export function routeBounds(): [Position, Position] {
  const longitudes = positions.map(([longitude]) => longitude);
  const latitudes = positions.map(([, latitude]) => latitude);
  return [[Math.min(...longitudes), Math.min(...latitudes)], [Math.max(...longitudes), Math.max(...latitudes)]];
}

function visiblePositions(progress: number): Position[] {
  if (progress >= 1) return positions;
  const covered = total * progress;
  const end = lengths.findIndex((length) => length > covered);
  if (end < 1) return [];
  const from = positions[end - 1];
  const to = positions[end];
  const fraction = (covered - lengths[end - 1]) / (lengths[end] - lengths[end - 1]);
  return [...positions.slice(0, end), [
    from[0] + (to[0] - from[0]) * fraction, from[1] + (to[1] - from[1]) * fraction,
  ]];
}

export function useMapRoute(instance: RefObject<Map | null>, onFinish: () => void) {
  const [state, setState] = useState<RouteState>("idle");
  const frame = useRef<number | null>(null);
  const progress = useRef(0);

  function paint(visible: Position[]) {
    const source = instance.current?.getSource<GeoJSONSource>("route");
    source?.setData({
      type: "FeatureCollection",
      features: visible.length < 2 ? [] : [{
        type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: visible },
      }],
    });
  }

  const cancel = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  }, []);

  useEffect(() => cancel, [cancel]);

  return {
    state,
    show() { if (routeAvailable) paint(positions); },
    play(restart = false) {
      if (!routeAvailable) return;
      cancel();
      if (restart || progress.current >= 1) progress.current = 0;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        paint(positions);
        setState("complete");
        onFinish();
        return;
      }
      setState("playing");
      const start = performance.now() - progress.current * mapConfig.route.duration;
      let lastPaint = 0;
      function animate(now: number) {
        progress.current = Math.min(1, (now - start) / mapConfig.route.duration);
        if (now - lastPaint >= mapConfig.route.frameInterval || progress.current >= 1) {
          paint(visiblePositions(progress.current));
          lastPaint = now;
        }
        if (progress.current < 1) {
          frame.current = requestAnimationFrame(animate);
        } else {
          frame.current = null;
          setState("complete");
          onFinish();
        }
      }
      frame.current = requestAnimationFrame(animate);
    },
    pause() { cancel(); setState("paused"); },
    exit() {
      cancel();
      progress.current = 0;
      paint([]);
      setState("idle");
    },
  };
}
