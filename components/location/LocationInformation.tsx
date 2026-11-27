"use client";

import { usePreferences } from "@/components/Preferences";
import { Clock3, MapPin, Phone } from "lucide-react";
import { AppIcon } from "@/components/ui/AppIcon";
import { business, businessLocation } from "@/data/business.config";
import { DirectionsActions } from "./DirectionsActions";

export function LocationInformation() {
  const { t } = usePreferences();
  const copy = t.map;

  return (
    <>
      <div className="location-primary">
        <div className="location-detail" data-reveal="item">
          <AppIcon icon={MapPin} />
          <div>
            <h3>{business.name}</h3>
            <p>{businessLocation.address}</p>
          </div>
        </div>
        <div id="ubicacion-acciones"><DirectionsActions /></div>
      </div>
      <div className="location-secondary">
        <details className="location-more">
          <summary>{copy.vehicleEntrance}</summary>
          <div className="location-details"><p>{copy.accessInstructions}</p></div>
        </details>
        <details className="location-more">
          <summary>{copy.contactHours}</summary>
          <div className="location-details">
            <div className="location-detail location-hours">
              <AppIcon icon={Clock3} />
              <dl>{business.hours.map(({ id }) => (
                <div key={id}><dt>{t.hours[id].day}</dt><dd>{t.hours[id].display}</dd></div>
              ))}</dl>
            </div>
            <div className="location-detail">
              <AppIcon icon={Phone} />
              <div className="location-phone-list">
                {Object.values(business.voice).map((phone) => (
                  <a key={phone.tel} className="location-phone" href={"tel:" + phone.tel}>{phone.display}</a>
                ))}
              </div>
            </div>
          </div>
        </details>
        <details className="location-more">
          <summary>{copy.extraReferences}</summary>
          <div className="location-details">
            <p>{copy.reference}.</p>
          </div>
        </details>
      </div>
    </>
  );
}
