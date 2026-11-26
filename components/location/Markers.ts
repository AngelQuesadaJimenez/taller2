import { divIcon, marker } from "leaflet";
import { business, businessLocation, type Coordinates, type Landmark } from "@/data/business.config";
import { googleDirectionsUrl } from "@/lib/directions";
import type { Messages } from "@/i18n/messages";

function pin(coordinates: Coordinates, title: string, kind: "business" | "entrance" | "landmark", permanent = false) {
  return marker([coordinates[0], coordinates[1]], {
    title,
    icon: divIcon({
      className: "map-pin map-pin--" + kind,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      tooltipAnchor: [0, -16],
      popupAnchor: [0, -16],
    }),
  }).bindTooltip(title, {
    permanent, direction: "top", className: kind === "entrance" ? "leaflet-entrance-tooltip" : "",
  });
}

export function BusinessMarker(coordinates: Coordinates) {
  const popup = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = business.name;
  const address = document.createElement("p");
  address.textContent = businessLocation.address;
  const phone = document.createElement("a");
  phone.href = "tel:" + business.voice.mobile.tel;
  phone.textContent = business.voice.mobile.display;
  const directions = document.createElement("a");
  directions.href = googleDirectionsUrl() ?? businessLocation.wazeUrl;
  directions.target = "_blank";
  directions.rel = "noopener noreferrer";
  directions.dataset.mapLabel = "directions";
  directions.textContent = businessLocation.street;
  popup.append(title, address, phone, document.createElement("br"), directions);
  return pin(coordinates, business.name, "business").bindPopup(popup);
}

export function EntranceMarker(coordinates: Coordinates) {
  const popup = document.createElement("p");
  popup.dataset.mapLabel = "accessInstructions";
  return pin(coordinates, "", "entrance").bindPopup(popup);
}

export function LandmarkMarker(landmark: Landmark) {
  const label = document.createElement("span");
  const suffix = document.createElement("span");
  suffix.dataset.mapLabel = "landmark";
  label.append(landmark.name + " · ", suffix);
  return pin(landmark.coordinates, landmark.name, "landmark", businessLocation.landmarks.length === 1).bindPopup(label);
}

export function renderLeafletLocale(container: HTMLElement, copy: Messages["map"], directions: string) {
  const labels = { directions, accessInstructions: copy.accessInstructions, landmark: copy.landmark };
  container.querySelectorAll<HTMLElement>("[data-map-label]").forEach((element) => {
    const key = element.dataset.mapLabel as keyof typeof labels;
    element.textContent = labels[key];
  });
  container.querySelector(".leaflet-popup-close-button")?.setAttribute("aria-label", copy.closePopup);
  const entrance = container.querySelector(".map-pin--entrance");
  entrance?.setAttribute("aria-label", copy.vehiclePin);
  entrance?.setAttribute("title", copy.vehiclePin);
  const tooltip = container.querySelector(".leaflet-entrance-tooltip");
  if (tooltip) tooltip.textContent = copy.vehiclePin;
}
