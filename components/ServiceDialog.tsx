"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { Info, ShoppingBag, Wrench } from "lucide-react";
import { usePreferences } from "@/components/Preferences";
import { ContactForm } from "@/components/ContactForm";
import { ProductDetail } from "@/components/ProductDetail";
import type { CatalogProduct } from "@/data/catalog";
import { AppIcon } from "@/components/ui/AppIcon";
import { AutomotivePhoto } from "@/components/ui/AutomotivePhoto";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Button } from "@/components/ui/Button";
import { ServiceModal } from "@/components/ui/ServiceModal";
import { repairs } from "@/data/photos";
import { serviceIntents, type ServiceIntent } from "@/data/services.config";
import type { Service } from "@/data/site-content";

const tabIcons = { compra: ShoppingBag, reparacion: Wrench };

function ServiceSteps({ steps }: { steps: readonly { title: string; text: string }[] }) {
  return (
    <ol className="service-steps" role="list">
      {steps.map(({ title, text }, index) => (
        <li key={title}>
          <span className="service-step-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <div><strong>{title}</strong><p>{text}</p></div>
        </li>
      ))}
    </ol>
  );
}

export function ServiceDialog({ service, product, onDismiss }: {
  service: Service; product?: CatalogProduct; onDismiss: () => void;
}) {
  const { t } = usePreferences();
  const copy = t.serviceDetail;
  const details = copy[service.component];
  const id = useId();
  const formId = id + "-consultation";
  const [intent, setIntent] = useState<ServiceIntent>("compra");
  const buying = intent === "compra";
  const repairPhoto = repairs.find(({ component, featured }) => component === service.component && featured);
  const photo = !buying && repairPhoto
    ? { ...repairPhoto.after, alt: t.repairs[repairPhoto.id].after }
    : { ...service.image, alt: t.photos[service.photoKey] };

  function navigateTabs(event: KeyboardEvent<HTMLDivElement>) {
    let next: ServiceIntent;
    switch (event.key) {
      case "Home": next = "compra"; break;
      case "End": next = "reparacion"; break;
      case "ArrowLeft":
      case "ArrowRight": next = intent === "compra" ? "reparacion" : "compra"; break;
      default: return;
    }
    event.preventDefault();
    setIntent(next);
    event.currentTarget.querySelector<HTMLButtonElement>('[data-intent="' + next + '"]')?.focus();
  }

  return (
    <ServiceModal title={product ? t.catalog.titles[product.id] : t.parts[service.component].plural}
      emblem={<AppIcon icon={service.icon} size="large" />} onDismiss={onDismiss}
      footer={
        <Button type="submit" variant="whatsapp" form={formId}><BrandIcon brand="whatsappFilled" /> {t.common.consult}</Button>
      }>
      {product ? <ProductDetail product={product} /> : <>
        <div className="service-tabs" role="tablist" aria-label={copy.tabs} onKeyDown={navigateTabs}>
          {serviceIntents.map(({ id: option }) => (
            <button type="button" key={option} role="tab" data-intent={option} aria-selected={intent === option}
              aria-controls={id + "-panel-" + option} id={id + "-tab-" + option}
              className="button service-tab" tabIndex={intent === option ? 0 : -1} onClick={() => setIntent(option)}>
              <AppIcon icon={tabIcons[option]} /> {option === "compra" ? copy.purchase : copy.repair}
            </button>
          ))}
        </div>
        {serviceIntents.map(({ id: option }) => (
          <div id={id + "-panel-" + option} key={option} role="tabpanel" aria-labelledby={id + "-tab-" + option}
            hidden={intent !== option} tabIndex={intent === option ? 0 : undefined} className="service-tab-panel">
            {intent === option && (
              <>
                <div className="service-detail-intro">
                  <div className="service-detail-photo"><AutomotivePhoto photo={photo} sizes="(max-width: 420px) 29vw, 190px" /></div>
                  <div>
                    <h3>{buying ? details.purchaseTitle : details.repairTitle}</h3>
                    <p>{buying ? details.purchaseIntro : details.repairIntro}</p>
                  </div>
                </div>
                {buying ? (
                  <>
                    <details className="service-disclosure">
                      <summary>{copy.purchaseReady}</summary>
                      <ul>{copy.purchaseFields.map((item) => <li key={item}>{item}</li>)}</ul>
                    </details>
                    <details className="service-disclosure">
                      <summary>{copy.purchaseSteps}</summary>
                      <ServiceSteps steps={copy.buySteps} />
                    </details>
                  </>
                ) : (
                  <>
                    <p className="service-caveat"><AppIcon icon={Info} /><span>{copy.scope} {copy.advice}</span></p>
                    <details className="service-disclosure">
                      <summary>{copy.symptoms}</summary>
                      <ul>{details.symptoms.map((item) => <li key={item}>{item}</li>)}</ul>
                    </details>
                    <details className="service-disclosure">
                      <summary>{copy.assessment}</summary>
                      <ul>{details.assessment.map((item) => <li key={item}>{item}</li>)}</ul>
                    </details>
                    <details className="service-disclosure">
                      <summary>{copy.repairSteps}</summary>
                      <p>{copy.processNote}</p>
                      <ServiceSteps steps={copy.fixSteps} />
                    </details>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </>}
      <ContactForm formId={formId} context={{ component: service.component, intent, product: product?.reference }} />
    </ServiceModal>
  );
}
