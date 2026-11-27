"use client";

import { useId, useState, useSyncExternalStore, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { usePreferences } from "@/components/Preferences";
import { VehicleDetailsFields } from "@/components/VehicleDetailsFields";
import { VehicleIdentification } from "@/components/VehicleIdentification";
import { VehiclePlateField } from "@/components/VehiclePlateField";
import { AppIcon } from "@/components/ui/AppIcon";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Button } from "@/components/ui/Button";
import { readConsultation, waLink } from "@/lib/whatsapp";
import { serviceComponents, serviceIntents, undecidedComponent, type ConsultationContext } from "@/data/services.config";

type ValidationError = "invalidName" | "invalidIntent" | "invalidPart" | "invalidYear" | "invalid";

const subscribeToHydration = () => () => {};
const clientInteractive = () => true;
const serverInteractive = () => false;

type ContactFormProps = { context?: never; formId?: never } | { context: ConsultationContext; formId: string };

export function ContactForm({ context, formId }: ContactFormProps) {
  const service = context && "intent" in context ? context : undefined;
  const { t, locale } = usePreferences();
  const copy = t.form;
  const detail = t.serviceDetail;
  const id = useId();
  const interactive = useSyncExternalStore(subscribeToHydration, clientInteractive, serverInteractive);
  const notice = id + "-notice";
  const errorId = id + "-error";
  const [prepared, setPrepared] = useState<ReturnType<typeof readConsultation>>(null);
  const [error, setError] = useState<ValidationError | null>(null);
  const yearErrorId = error === "invalidYear" ? errorId : undefined;
  const messageUrl = prepared && (!service || prepared.intent === service.intent) ? waLink(prepared, locale) : null;
  const repair = service?.intent === "reparacion";

  function validationProps(field: ValidationError) {
    const invalid = error === field;
    return { "aria-invalid": invalid || undefined, "aria-describedby": invalid ? errorId : undefined };
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const invalid = form.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input:invalid, select:invalid, textarea:invalid",
    );
    const consultation = readConsultation(new FormData(form), context);
    if (invalid || !consultation) {
      switch (invalid?.name) {
        case "name": setError("invalidName"); break;
        case "intent": setError("invalidIntent"); break;
        case "component": setError("invalidPart"); break;
        case "year": setError("invalidYear"); break;
        default: setError("invalid");
      }
      const disclosure = invalid?.closest("details");
      if (disclosure) disclosure.open = true;
      invalid?.focus();
      return;
    }

    setError(null);
    const url = waLink(consultation, locale);
    window.open(url, "_blank", "noopener,noreferrer");
    setPrepared(consultation);
  }

  const fields = (
    <div className="fields">
      {!context && (
        <>
          <label>{copy.name}
            <input name="name" {...validationProps("invalidName")} autoComplete="name" required pattern={".*\\S.*"} maxLength={100} />
          </label>
          <label><span id={id + "-intent"}>{copy.intent}</span>
            <select name="intent" aria-labelledby={id + "-intent"} {...validationProps("invalidIntent")} defaultValue="" required>
              <option value="" disabled>{copy.selectIntent}</option>
              {serviceIntents.map(({ id }) => <option key={id} value={id}>{copy[id]}</option>)}
            </select>
          </label>
          <label><span id={id + "-component"}>{copy.part}</span>
            <select name="component" aria-labelledby={id + "-component"} {...validationProps("invalidPart")} defaultValue="" required>
              <option value="" disabled>{copy.selectPart}</option>
              {serviceComponents.map(({ id }) => <option key={id} value={id}>{t.parts[id].singular}</option>)}
              <option value={undecidedComponent.id}>{t.parts.orientacion.singular}</option>
            </select>
          </label>
          <VehiclePlateField />
        </>
      )}
      {!context && <VehicleDetailsFields yearErrorId={yearErrorId} />}
      {service && (
        <label>{detail.engine}
          <input name="engine" placeholder={detail.engineExample} maxLength={80} />
        </label>
      )}
      {context && (
        <label className={service ? undefined : "field-wide"}>{detail.partNumber}
          <input name="partNumber" placeholder={detail.partExample} maxLength={100} />
        </label>
      )}
      <label className="field-wide">{repair ? detail.problem : copy.description}
        <textarea name="description" rows={context ? 2 : 4} maxLength={700} placeholder={repair ? detail.problemExample : copy.detailsPlaceholder} />
      </label>
    </div>
  );

  return (
    <form id={formId} className={"contact-form" + (context ? " service-inquiry" : "")} onSubmit={onSubmit}
      aria-describedby={context ? undefined : notice} method="post" noValidate onChange={() => { setError(null); setPrepared(null); }}>
      {context ? (
        <>
          <details className="service-disclosure">
            <summary>{detail.addDetails}</summary>
            {fields}
          </details>
          <VehicleIdentification yearErrorId={yearErrorId} />
        </>
      ) : (
        <>
          <p className="form-field-instructions">{copy.requiredFields}</p>
          {fields}
        </>
      )}
      {!context && (
        <>
          <p id={notice}>{interactive ? copy.notice : copy.directContact}</p>
          <Button type="submit" variant="whatsapp" disabled={!interactive}><BrandIcon brand="whatsappFilled" /> {copy.submit}</Button>
        </>
      )}
      {error && !yearErrorId && <p role="alert" id={errorId} className="form-error">{copy[error]}</p>}
      {messageUrl && (
        <p role="status" className="form-feedback">
          <AppIcon icon={CheckCircle2} />
          <span>{copy.ready} <a href={messageUrl} target="_blank" rel="noopener noreferrer">{copy.review}</a>.</span>
        </p>
      )}
    </form>
  );
}
