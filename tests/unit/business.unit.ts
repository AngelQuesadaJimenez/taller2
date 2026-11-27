import { expect, test } from "@playwright/test";
import { business, businessLocation } from "../../data/business.config";
import { locales, localizedPath } from "../../i18n/config";
import { messages } from "../../i18n/messages";
import { businessSchema, pageMetadata } from "../../i18n/metadata";
import { googleDirectionsUrl } from "../../lib/directions";
import { readConsultation, waLink } from "../../lib/whatsapp";

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

test("una consulta general requiere nombre, intención y componente válidos", () => {
  const valid = { name: "  Ana  ", component: "alternador", intent: "compra" };
  expect(readConsultation(form(valid))).toMatchObject({ name: "Ana", intent: "compra", component: "alternador" });
  const invalidInputs: Record<string, string>[] = [{ name: "  " }, { intent: "otro" }, { component: "otro" }, { year: "20a1" }];
  for (const invalid of invalidInputs) {
    expect(readConsultation(form({ ...valid, ...invalid }))).toBeNull();
  }
});

for (const locale of locales) {
  test(`${locale} conserva los datos, acentos y símbolos en un solo parámetro de WhatsApp`, () => {
    const t = messages[locale];
    const fields = { plate: " CL-123 ", description: "Río & Cía. #2 + 50%\nEntrega mañana" };
    const inquiry = readConsultation(form(fields), { piece: "placas-diodos" });
    expect(inquiry).not.toBeNull();
    const url = new URL(waLink(inquiry!, locale));
    expect(url.origin + url.pathname).toBe("https://wa.me/50689391999");
    expect([...url.searchParams.keys()]).toEqual(["text"]);
    const text = url.searchParams.get("text");
    expect(text).toContain(fields.description);
    expect(text).toContain(t.breakdown.items["placas-diodos"].name);
    expect(text).toContain(t.whatsapp.plate + ": CL-123");
    expect(text).not.toMatch(/undefined|null/);
    expect(new URL(waLink(undefined, locale, business.whatsappSecondary.number)).pathname).toBe("/50683927096");
  });

  test(`${locale} publica el domicilio, horarios y metadatos localizados`, () => {
    const schema = businessSchema(locale);
    expect(schema.url).toBe(new URL(localizedPath(locale, "home"), business.website).href);
    expect(schema.address.streetAddress).toBe(businessLocation.street);
    expect([schema.geo?.latitude, schema.geo?.longitude]).toEqual(businessLocation.coordinates);
    expect(schema.openingHoursSpecification).toHaveLength(business.hours.length);
    expect(schema.description).toBe(messages[locale].seo.description);
    expect(pageMetadata(locale, "privacidad").description).toBe(messages[locale].legal.privacidad.paragraphs[0]);
    expect(pageMetadata(locale, "home").alternates["x-default"]).toBe("/es/");
  });
}

test("las indicaciones usan la ubicación verificada y solo incluyen el origen al proporcionarlo", () => {
  const url = new URL(googleDirectionsUrl()!);
  expect(url.origin).toBe("https://www.google.com");
  expect(url.searchParams.get("destination")).toBe(businessLocation.coordinates?.join(","));
  expect(url.searchParams.has("origin")).toBe(false);
  expect(new URL(googleDirectionsUrl([10.1, -84.2])!).searchParams.get("origin")).toBe("10.1,-84.2");
});
