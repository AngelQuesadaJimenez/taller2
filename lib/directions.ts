import { businessLocation, type Coordinates } from "@/data/business.config";

export function googleDirectionsUrl(origin?: Coordinates, location = businessLocation) {
  const { entranceCoordinates, coordinates, googleMapsPlaceId, name, address } = location;
  const destination = entranceCoordinates ?? coordinates;
  if (!destination && !googleMapsPlaceId) return null;

  const query = new URLSearchParams({
    api: "1",
    destination: destination?.join(",") ?? name + ", " + address,
    travelmode: "driving",
  });
  if (googleMapsPlaceId && !entranceCoordinates) query.set("destination_place_id", googleMapsPlaceId);
  if (origin) query.set("origin", origin.join(","));
  return "https://www.google.com/maps/dir/?" + query.toString();
}

export function areaMapUrl() {
  return "https://www.openstreetmap.org/#map=17/" + businessLocation.areaCenter.join("/");
}
