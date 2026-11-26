import type { ExpressionSpecification, StyleSpecification } from "maplibre-gl";
import type { FeatureCollection, LineString, Polygon } from "geojson";
import { businessLocation } from "@/data/business.config";
import { lngLat, mapConfig, propertyFocusMask } from "@/data/map.config";

export const layers = {
  imagery: "orthophoto",
  streets: "street-map",
  labels: "street-names",
  focusMask: "business-focus-mask",
  propertyBorder: "business-property-border",
  accessLine: "business-access-line",
  accessOutline: "business-access-outline",
  route: "access-route",
  routeOutline: "access-outline",
};

const streetName: ExpressionSpecification = ["coalesce", ["get", "name:es"], ["get", "name"], ""];
// Evita que el proveedor vuelva a rotular el tramo de referencia del acceso.
const accessStreetNames = ["calle coricafé", "calle coricafe"];

const { propertyOutline, accessPath } = businessLocation;
const referenceData: FeatureCollection<Polygon | LineString> = { type: "FeatureCollection", features: [] };

const focusMask = propertyFocusMask(propertyOutline);

if (focusMask) {
  referenceData.features.push({ type: "Feature", properties: { kind: "focus-mask" }, geometry: focusMask });
  referenceData.features.push({
    type: "Feature", properties: { kind: "property" },
    geometry: { type: "Polygon", coordinates: [propertyOutline.map(lngLat)] },
  });
}

if (accessPath.length > 1) {
  referenceData.features.push({
    type: "Feature", properties: { kind: "access" },
    geometry: { type: "LineString", coordinates: accessPath.map(lngLat) },
  });
}

export function mapStyle(element: HTMLElement): StyleSpecification {
  const styles = getComputedStyle(element);
  const color = (name: string) => styles.getPropertyValue(name).trim();

  return {
    version: 8,
    glyphs: mapConfig.labels.glyphs,
    sources: {
      imagery: {
        type: "raster", tiles: [mapConfig.imagery.url], tileSize: 256,
        maxzoom: mapConfig.imagery.maxZoom, attribution: mapConfig.imagery.attribution,
      },
      streets: {
        type: "raster", tiles: [mapConfig.streets.url], tileSize: 256,
        maxzoom: mapConfig.streets.maxZoom, attribution: mapConfig.streets.attribution,
      },
      labels: {
        type: "vector", url: mapConfig.labels.tiles, attribution: mapConfig.labels.attribution,
      },
      references: { type: "geojson", data: referenceData },
      route: { type: "geojson", data: { type: "FeatureCollection", features: [] }, lineMetrics: true },
    },
    layers: [
      { id: "map-background", type: "background", paint: { "background-color": color("--map-base") } },
      { id: layers.imagery, type: "raster", source: "imagery", paint: { "raster-fade-duration": 100 } },
      { id: layers.streets, type: "raster", source: "streets", layout: { visibility: "none" } },
      {
        id: layers.focusMask, type: "fill", source: "references",
        filter: ["==", ["get", "kind"], "focus-mask"],
        paint: { "fill-color": color("--map-mask"), "fill-opacity": mapConfig.focus.maskOpacity },
      },
      {
        id: layers.propertyBorder, type: "line", source: "references",
        filter: ["==", ["get", "kind"], "property"],
        layout: { "line-join": "round" },
        paint: { "line-color": color("--map-property"), "line-width": 1.5, "line-opacity": 0.9 },
      },
      {
        id: layers.accessOutline, type: "line", source: "references",
        filter: ["==", ["get", "kind"], "access"],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": color("--map-outline"), "line-width": 4.2, "line-opacity": 0.65 },
      },
      {
        id: layers.accessLine, type: "line", source: "references",
        filter: ["==", ["get", "kind"], "access"],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": color("--map-access"), "line-width": 1.8, "line-opacity": 0.85 },
      },
      {
        id: layers.labels, type: "symbol", source: "labels", "source-layer": "transportation_name", minzoom: 15,
        filter: ["!", ["in", ["downcase", streetName], ["literal", accessStreetNames]]],
        layout: {
          "symbol-placement": "line", "symbol-spacing": 260, "text-font": [mapConfig.labels.font],
          "text-field": streetName,
          "text-size": ["interpolate", ["linear"], ["zoom"], 15, 11, 18, 15],
        },
        paint: { "text-color": color("--map-label"), "text-halo-color": color("--map-outline"), "text-halo-width": 2 },
      },
      {
        id: layers.routeOutline, type: "line", source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": color("--map-outline"), "line-width": 10 },
      },
      {
        id: layers.route, type: "line", source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": color("--map-marker"), "line-width": 6 },
      },
    ],
  };
}
