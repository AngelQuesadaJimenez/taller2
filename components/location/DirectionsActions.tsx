"use client";

import { usePreferences } from "@/components/Preferences";
import { LoaderCircle, LocateFixed } from "lucide-react";
import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Button } from "@/components/ui/Button";
import { businessLocation } from "@/data/business.config";
import { googleDirectionsUrl } from "@/lib/directions";

export function DirectionsActions() {
  const { t } = usePreferences();
  const copy = t.directions;
  const manualGoogle = googleDirectionsUrl();
  const [status, setStatus] = useState<keyof typeof copy | null>(null);
  const [pending, setPending] = useState(false);
  const [route, setRoute] = useState<string | null>(null);

  function locate() {
    setRoute(null);
    if (!navigator.geolocation) {
      setStatus("unavailable");
      return;
    }

    setPending(true);
    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const google = googleDirectionsUrl([coords.latitude, coords.longitude]);
        setRoute(google ?? businessLocation.wazeUrl);
        setStatus(google ? "ready" : "wazeReady");
        setPending(false);
      },
      (error) => {
        setStatus(error.code === 1
          ? "denied"
          : "failed");
        setPending(false);
      },
      { enableHighAccuracy: false, timeout: 9000, maximumAge: 0 },
    );
  }

  const isWaze = route === businessLocation.wazeUrl;

  return (
    <div className="directions-actions">
      <div className="navigation-links" role="group" aria-label={copy.apps}>
        <Button href={businessLocation.wazeUrl} target="_blank" rel="noopener noreferrer"
          variant="glass" aria-label={copy.waze}>
          <BrandIcon brand="waze" /> Waze
        </Button>
        {manualGoogle && <Button href={manualGoogle} target="_blank" rel="noopener noreferrer"
          variant="glass" aria-label={copy.google}>
          <BrandIcon brand="googleMaps" /> Google Maps
        </Button>}
      </div>
      <Button onClick={locate} disabled={pending} variant="ghost">
        <AppIcon icon={pending ? LoaderCircle : LocateFixed} className={pending ? "is-loading" : ""} />
        {pending ? copy.pending : copy.fromHere}
      </Button>
      <div role="status">{status && <p>{copy[status]}</p>}</div>
      {route && <Button href={route} target="_blank" rel="noopener noreferrer" variant="primary">
        <BrandIcon brand={isWaze ? "waze" : "googleMaps"} />
        {isWaze ? copy.continueWaze : copy.viewRoute}
      </Button>}
    </div>
  );
}
