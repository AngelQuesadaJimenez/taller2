"use client";

import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { usePreferences } from "@/components/Preferences";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { business, businessLocation } from "@/data/business.config";
import { navigation } from "@/data/site-content";
import { AppIcon } from "@/components/ui/AppIcon";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { GlassButton } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { localizedPath } from "@/i18n/config";

export function Footer({ copyrightYear }: { copyrightYear: number }) {
  const { t, locale } = usePreferences();
  const { common, footer } = t;
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-identity" data-reveal="item">
            <a href="#inicio" className="footer-brand"><BrandLogo size="large" name={business.tradeName} /></a>
            <p>{footer.description}</p>
          </div>
          <nav className="footer-column" data-reveal="item" aria-labelledby="footer-links-title">
            <h2 id="footer-links-title">{footer.links}</h2>
            <ul className="footer-list">
              {navigation.map(({ id }) => <li key={id}><a href={"#" + id}>{t.nav.labels[id]}</a></li>)}
              <li><a href="#reparaciones">{footer.repairs}</a></li>
              <li><a href="#pagos">{t.payments.title}</a></li>
            </ul>
          </nav>
          <section className="footer-column" data-reveal="item" aria-labelledby="footer-contact-title">
            <h2 id="footer-contact-title">{t.nav.labels.contacto}</h2>
            <ul className="footer-list">
              <li><a href={"tel:" + business.voice.mobile.tel} aria-label={common.call + " " + business.voice.mobile.display}>
                <AppIcon icon={Phone} size="small" />{business.voice.mobile.display}
              </a></li>
              <li><a href={"tel:" + business.voice.landline.tel} aria-label={common.landline + " " + business.voice.landline.display}>
                <AppIcon icon={Phone} size="small" />{business.voice.landline.display}
              </a></li>
            </ul>
            <WhatsAppCTA variant="glass" className="footer-whatsapp">
              <span>WhatsApp <span className="whitespace-nowrap">{business.whatsapp.display}</span></span>
            </WhatsAppCTA>
            <div className="footer-socials">
              {business.socials.map(({ brand, label, url }) => (
                <GlassButton key={brand} href={url} target="_blank" rel="noopener noreferrer" variant="glass" size="icon"
                  aria-label={label + " " + common.socialSuffix} title={label}>
                  <BrandIcon brand={brand} />
                </GlassButton>
              ))}
            </div>
          </section>
          <section className="footer-column" data-reveal="item" aria-labelledby="footer-location-title">
            <h2 id="footer-location-title">{t.nav.labels.ubicacion}</h2>
            <address className="footer-address"><AppIcon icon={MapPin} size="small" />{businessLocation.address}</address>
            <h3>{footer.hours}</h3>
            <dl className="footer-hours">
              {business.hours.map(({ id }) => <div key={id}><dt>{t.hours[id].day}</dt><dd>{t.hours[id].display}</dd></div>)}
            </dl>
            <GlassButton href="#ubicacion" variant="outline" className="footer-directions">
              {common.directions} <AppIcon icon={ArrowUpRight} size="small" />
            </GlassButton>
          </section>
        </div>
        <div className="footer-meta">
          <p>© {copyrightYear} <span lang="es-CR">{business.tradeName}</span></p>
          <a href={localizedPath(locale, "privacidad")}>{common.privacy}</a>
          <p id="creditos">{common.credits}</p>
        </div>
      </div>
    </footer>
  );
}
