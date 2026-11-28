import type { Polygon } from "geojson";
import { businessLocation, mapTiles, type Coordinates } from "./business.config";

export type MapView = "oblique" | "aerial" | "streets";

const officialOrtho = "https://geos1.snitcr.go.cr/Ortofoto1k/wms"
  + "?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=ortofoto2017_1000&STYLES="
  + "&FORMAT=image%2Fjpeg&SRS=EPSG%3A3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}";

const imageryAttribution = process.env.NEXT_PUBLIC_MAP_IMAGERY_ATTRIBUTION;
const customImagery = imageryAttribution && process.env.NEXT_PUBLIC_MAP_IMAGERY_URL;

export const mapConfig = {
  imagery: {
    url: customImagery || officialOrtho,
    attribution: customImagery && imageryAttribution || '<a href="https://www.snitcr.go.cr/servicios_ogc_completo">IGN / Registro Nacional · Ortofoto 2015–2018</a>',
    custom: Boolean(customImagery),
    maxZoom: 19,
  },
  streets: mapTiles,
  labels: {
    tiles: "https://tiles.openfreemap.org/planet",
    glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
    font: "Noto Sans Regular",
    attribution: '<a href="https://openfreemap.org/">OpenFreeMap</a> · <a href="https://openmaptiles.org/">© OpenMapTiles</a> · Datos de <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  focus: {
    contextPadding: 0.5,
    maskOpacity: 0.56,
  },
  camera: {
    center: businessLocation.coordinates ?? businessLocation.areaCenter,
    zoom: 17.5,
    contextZoom: 15,
    focusZoom: 18,
    entranceZoom: 18.5,
    minZoom: 13,
    maxZoom: 20,
    pitch: 52,
    bearing: -22,
    turn: 30,
    duration: 600,
    zoomDuration: 260,
    introDuration: 1400,
  },
  route: {
    duration: 4200,
    frameInterval: 40,
    inset: 74,
  },
  tileTimeout: 11000,
} as const;

export const mapViews = ["oblique", "aerial", "streets"] as const;

export function lngLat([latitude, longitude]: Coordinates): [number, number] {
  return [longitude, latitude];
}

export function propertyFocusMask(outline: readonly Coordinates[]): Polygon | null {
  const ring = outline.map(lngLat);
  const first = ring[0];
  const last = ring.at(-1);
  if (ring.length < 4 || !first || !last || first[0] !== last[0] || first[1] !== last[1]) return null;

  const area = ring.slice(1).reduce((sum, point, index) => {
    const previous = ring[index];
    return sum + (previous[0] - first[0]) * (point[1] - first[1])
      - (point[0] - first[0]) * (previous[1] - first[1]);
  }, 0);
  if (!Number.isFinite(area) || area === 0) return null;

  const margin = mapConfig.focus.contextPadding;
  const longitudes = ring.map(([lng]) => lng);
  const latitudes = ring.map(([, lat]) => lat);
  const west = Math.min(...longitudes) - margin;
  const south = Math.min(...latitudes) - margin;
  const east = Math.max(...longitudes) + margin;
  const north = Math.max(...latitudes) + margin;
  const context = [[west, south], [east, south], [east, north], [west, north], [west, south]];

  return { type: "Polygon", coordinates: [context, area > 0 ? [...ring].reverse() : ring] };
}

export function accessBounds(): [[number, number], [number, number]] | null {
  if (!businessLocation.accessPath.length) return null;
  const points = [...businessLocation.accessPath, ...businessLocation.propertyOutline];
  const eastings = points.map(([, longitude]) => longitude);
  const northings = points.map(([latitude]) => latitude);
  return [
    [Math.min(...eastings), Math.min(...northings)],
    [Math.max(...eastings), Math.max(...northings)],
  ];
}
