import { type Locator, type Page, type TestInfo } from "@playwright/test";
import { expect, test } from "./map-fixture";
import { businessLocation } from "../data/business.config";
import { messages } from "../i18n/messages";

const es = messages.es;
const en = messages.en;
const nav = (page: Page) => page.getByRole("banner").getByRole("navigation");

test.beforeEach(async ({ page, context }) => {
  // Exercise real navigation targets without opening a messaging or routing service.
  await context.route(/^https:\/\/(?:wa\.me|www\.waze\.com|www\.google\.com)\//, (route) => route.abort());
  await page.addInitScript(() => {
    const record = (url: string) => { document.documentElement.dataset.releaseTarget = url; };
    window.open = (url) => { record(String(url)); return null; };
    document.addEventListener("click", (event) => {
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (anchor instanceof HTMLAnchorElement && /^(wa\.me|www\.waze\.com|www\.google\.com)$/.test(anchor.hostname)) {
        event.preventDefault();
        record(anchor.href);
      }
    }, true);
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es/");
  await expect(page.locator('#contacto button[type="submit"]')).toBeEnabled();
});

async function record(info: TestInfo, start: number, actions: string[]) {
  const result = {
    scenario: info.title, profile: info.project.name, actions, actionCount: actions.length,
    durationMs: Math.round(performance.now() - start),
  };
  await info.attach("recorrido", { body: JSON.stringify(result, null, 2), contentType: "application/json" });
}

async function whatsAppMessage(page: Page) {
  const target = page.locator("html");
  await expect(target).toHaveAttribute("data-release-target", /^https:\/\/wa\.me\/50689391999\?/);
  const text = new URL((await target.getAttribute("data-release-target"))!).searchParams.get("text");
  expect(text).toBeTruthy();
  expect(text).not.toMatch(/undefined|null|\{(?:part|piece|name)\}/);
  return text;
}

async function clickCardPhoto(page: Page, photo: Locator, touch: boolean) {
  await photo.evaluate((node) => node.scrollIntoView({ block: "center" }));
  const box = (await photo.boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  if (touch) await page.touchscreen.tap(x, y);
  else await page.mouse.click(x, y);
}

test("A · comprar un alternador por referencia", async ({ page, isMobile }, info) => {
  const started = performance.now();
  await nav(page).getByRole("link", { name: es.nav.labels.repuestos }).click();
  const catalog = page.locator("#repuestos");
  await catalog.getByRole("button", { name: es.parts.alternador.plural, exact: true }).click();
  const title = es.catalog.titles["toyota-lexus"];
  const card = catalog.getByRole("article").filter({ has: page.getByRole("heading", { name: title, exact: true }) });
  await clickCardPhoto(page, card.locator(".catalog-photo"), isMobile);
  const dialog = page.getByRole("dialog", { name: title });
  await dialog.getByRole("button", { name: es.common.consult, exact: true }).click();
  const text = await whatsAppMessage(page);
  expect(text).toContain("la compra de un alternador");
  expect(text).toContain("Toyota Corolla / RAV4 · Lexus ES");
  await record(info, started, ["Repuestos", "Alternadores", "Foto Toyota/Lexus", "Consultar"]);
});

test("B · describir una avería del arrancador", async ({ page }, info) => {
  const started = performance.now();
  await nav(page).getByRole("button", { name: es.nav.services }).click();
  await nav(page).getByRole("button", { name: es.parts.arrancador.plural, exact: true }).click();
  const dialog = page.getByRole("dialog", { name: es.parts.arrancador.plural });
  await dialog.getByRole("tab", { name: es.serviceDetail.repair }).click();
  await dialog.getByText(es.serviceDetail.addDetails, { exact: true }).click();
  const symptom = "Solo hace clic al girar la llave.";
  await dialog.getByLabel(es.serviceDetail.problem, { exact: true }).fill(symptom);
  await dialog.getByRole("button", { name: es.common.consult, exact: true }).click();
  const text = await whatsAppMessage(page);
  expect(text).toContain("la reparación de un arrancador");
  expect(text).toContain(symptom);
  await record(info, started, ["Opciones de servicios", "Arrancadores", "Reparación", "Datos adicionales", "Escribir síntoma", "Consultar"]);
});

test("C · consultar placas de diodos identificándose por placa", async ({ page }, info) => {
  const started = performance.now();
  await nav(page).getByRole("link", { name: es.nav.labels.repuestos }).click();
  await page.getByRole("link", { name: es.breakdown.title, exact: true }).click();
  const title = es.breakdown.items["placas-diodos"].name;
  await page.getByRole("button", { name: es.catalog.availability + " · " + title, exact: true }).click();
  const dialog = page.getByRole("dialog", { name: title });
  await dialog.getByRole("radio", { name: es.vehicleIdentification.plate }).click();
  const plate = dialog.getByLabel(es.form.plate, { exact: true });
  await expect(plate).toHaveAccessibleDescription(es.form.plateHelp);
  await plate.fill("QA-248");
  await dialog.getByRole("button", { name: es.common.consult, exact: true }).click();
  const text = await whatsAppMessage(page);
  expect(text).toContain(es.breakdown.inquiry.replace("{piece}", title));
  expect(text).toContain("Placa: QA-248");
  await record(info, started, ["Repuestos", "Despiece", title, "Identificación por placa", "Escribir placa", "Consultar"]);
});

test("D · encontrar la dirección y abrir la ruta", async ({ page }, info) => {
  const started = performance.now();
  await nav(page).getByRole("link", { name: es.nav.labels.ubicacion }).click();
  const location = page.locator("#ubicacion");
  await expect(location.getByText(businessLocation.address, { exact: true })).toBeVisible();
  const google = location.getByRole("link", { name: es.directions.google, exact: true });
  expect(new URL((await google.getAttribute("href"))!).searchParams.get("destination")).toBe("10.002114,-84.182999");
  await location.getByRole("link", { name: es.directions.waze, exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-release-target", businessLocation.wazeUrl);
  await record(info, started, ["Ubicación", "Abrir Waze"]);
});

test("E · descubrir medios de pago y plazo BAC", async ({ page }, info) => {
  const started = performance.now();
  await nav(page).getByRole("link", { name: es.nav.labels.contacto }).click();
  const footer = page.getByRole("contentinfo");
  const link = footer.getByRole("link", { name: es.payments.title });
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await expect(page).toHaveURL(/#pagos$/);
  const payments = page.locator("#pagos");
  await expect(payments.getByRole("heading", { level: 3 })).toHaveText(
    Object.values(es.payments.methods).map((method) => method.name),
  );
  await expect(payments.getByText(es.payments.methods.bac.description.replace("{months}", "3"))).toBeVisible();
  await record(info, started, ["Contacto", "Desplazarse al pie", es.payments.title]);
});

test("F · contactar en inglés desde la portada en español", async ({ page }, info) => {
  const started = performance.now();
  await page.getByRole("banner").getByRole("button", { name: es.common.language + " · ES" }).click();
  await page.getByRole("button", { name: "English", exact: true }).click();
  await nav(page).getByRole("link", { name: en.nav.labels.contacto, exact: true }).click();
  const contact = page.locator("#contacto");
  await expect(contact.getByRole("heading", { name: en.home.contact.title })).toBeVisible();
  await contact.getByRole("link", { name: "WhatsApp 8939-1999", exact: true }).click();
  const text = await whatsAppMessage(page);
  expect(text).toContain(en.whatsapp.greeting);
  expect(text).toContain(en.whatsapp.inquiry.general.replace("{part}", en.whatsapp.part.any));
  await record(info, started, ["Idioma", "English", "Contact", "WhatsApp 8939-1999"]);
});
