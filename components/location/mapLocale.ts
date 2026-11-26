import type { Map } from "maplibre-gl";
import type { Messages } from "@/i18n/messages";

export function mapLocale(copy: Messages["map"]) {
  return {
    "Map.Title": copy.region,
    "CooperativeGesturesHandler.WindowsHelpText": copy.ctrl,
    "CooperativeGesturesHandler.MacHelpText": copy.cmd,
    "CooperativeGesturesHandler.MobileHelpText": copy.fingers,
    "AttributionControl.ToggleAttribution": copy.attribution,
  };
}

export function renderMapLocale(map: Map, copy: Messages["map"]) {
  // MapLibre shares the constructor locale with its gesture controller.
  // Update that table for new controls and refresh labels on existing elements.
  Object.assign(map._locale, mapLocale(copy));
  map.getCanvas().setAttribute("aria-label", copy.region);
  const container = map.getContainer();
  const desktop = container.querySelector(".maplibregl-desktop-message");
  if (desktop) desktop.textContent = navigator.userAgent.includes("Mac") ? copy.cmd : copy.ctrl;
  const mobile = container.querySelector(".maplibregl-mobile-message");
  if (mobile) mobile.textContent = copy.fingers;
  const attribution = container.querySelector(".maplibregl-ctrl-attrib-button");
  attribution?.setAttribute("title", copy.attribution);
  attribution?.setAttribute("aria-label", copy.attribution);
}
