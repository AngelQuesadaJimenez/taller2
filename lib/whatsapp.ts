import { business } from "@/data/business.config";
import { serviceComponents, serviceIntents, undecidedComponent, type ConsultationContext, type ServiceComponent, type ServiceIntent, type SparePartId } from "@/data/services.config";
import { defaultLocale, type Locale } from "@/i18n/config";
import { messages } from "@/i18n/messages";

type Consultation = {
  intent?: ServiceIntent;
  component?: ServiceComponent;
  piece?: SparePartId;
  name?: string;
  make?: string;
  model?: string;
  year?: string;
  plate?: string;
  engine?: string;
  partNumber?: string;
  product?: string;
  description?: string;
  fromService?: boolean;
};

function formText(data: FormData, field: string) {
  const value = data.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function readVehicleDetails(data: FormData) {
  return {
    plate: formText(data, "plate"),
    make: formText(data, "make"),
    model: formText(data, "model"),
    year: formText(data, "year"),
  };
}

export function readConsultation(data: FormData, context?: ConsultationContext): Consultation | null {
  const vehicle = readVehicleDetails(data);
  const { year } = vehicle;
  if (year && !/^[0-9]{4}$/.test(year)) return null;

  const details = { ...vehicle, partNumber: formText(data, "partNumber"), description: formText(data, "description") };
  if (context && "piece" in context) return { ...details, piece: context.piece };

  const service = context;
  const name = formText(data, "name");
  const intent = service?.intent ?? serviceIntents.find(({ id }) => id === formText(data, "intent"))?.id;
  const component = service?.component ?? [...serviceComponents, undecidedComponent].find(({ id }) => id === formText(data, "component"))?.id;
  if ((!service && !name) || !intent || !component) return null;

  return {
    ...details,
    name, intent, component, fromService: !!service, product: service?.product,
    engine: formText(data, "engine"),
  };
}

export function consultationMessage(consultation: Consultation = {}, locale: Locale = defaultLocale) {
  const { name, intent, component, piece, make, model, year, engine, partNumber, product, description, fromService } = consultation;
  const plate = consultation.plate?.trim();
  const { whatsapp: copy, serviceMessage: service, breakdown } = messages[locale];
  const inquiry = piece
    ? breakdown.inquiry.replace("{piece}", breakdown.items[piece].name)
    : component === undecidedComponent.id ? copy.guidance
      : copy.inquiry[intent ?? "general"].replace("{part}", copy.part[component ?? "any"]);
  const vehicle = [
    plate && "- " + copy.plate + ": " + plate,
    make && "- " + copy.make + ": " + make,
    model && "- " + copy.model + ": " + model,
    year && "- " + copy.year + ": " + year,
    engine && "- " + service.engine + ": " + engine,
  ].filter(Boolean);
  const isRepair = fromService && intent === "reparacion";
  const followup = piece ? breakdown.followup : fromService ? (isRepair ? service.repair : service.purchase) : copy.next;

  return [
    copy.greeting,
    name && copy.name.replace("{name}", () => name),
    inquiry,
    isRepair && description && service.problem + "\n" + description,
    vehicle.length > 0 && [copy.vehicle, ...vehicle].join("\n"),
    product && service.product + ": " + product,
    partNumber && service.partNumber + ": " + partNumber,
    !isRepair && description && copy.detail + "\n" + description,
    followup,
    copy.thanks,
  ].filter(Boolean).join("\n\n");
}

export function waLink(consultation?: Consultation, locale: Locale = defaultLocale) {
  return "https://wa.me/" + business.whatsapp.number + "?text=" + encodeURIComponent(consultationMessage(consultation, locale));
}
