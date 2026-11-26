import { expect, test } from "./map-fixture";
import { catalog } from "../data/catalog";
import { locales } from "../i18n/config";
import { messages } from "../i18n/messages";

for (const locale of locales) {
  test(`detalle ${locale.toUpperCase()}: compra, reparación, teclado y WhatsApp`, async ({ page, isMobile }) => {
    const t = messages[locale];
    const copy = t.serviceDetail;
    const component = locale === "es" ? "alternador" : "arrancador";
    const service = copy[component];
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => {
      window.open = (url) => {
        document.documentElement.dataset.inquiry = String(url);
        return null;
      };
    });
    await page.goto("/" + locale + "/#servicios");
    const trigger = page.getByRole("button", { name: copy.explore + " · " + t.parts[component].plural });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: t.parts[component].plural });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: copy.close })).toBeFocused();
    await expect(dialog).toHaveCSS("animation-name", "none");
    await expect(page.locator("html")).toHaveCSS("overflow-y", "hidden");
    await trigger.evaluate((button) => button.focus());
    await expect(dialog.getByRole("button", { name: copy.close })).toBeFocused();
    await expect(dialog.getByRole("heading", { name: service.purchaseTitle })).toBeVisible();

    const form = dialog.locator("form");
    const consult = dialog.getByRole("button", { name: t.common.consult, exact: true });
    const plate = form.getByRole("textbox", { name: t.form.plate, exact: true });
    const readMessage = async () => new URL((await page.locator("html").getAttribute("data-inquiry"))!).searchParams.get("text");
    const plateMode = form.getByRole("radio", { name: t.vehicleIdentification.plate });
    const detailsMode = form.getByRole("radio", { name: t.vehicleIdentification.details });
    await expect(plate).toBeHidden();
    await plateMode.click();
    await expect(plate).toBeVisible();
    await plate.fill("ABC-507");
    await consult.click();
    const plateOnly = await readMessage();
    expect(plateOnly).toContain(t.whatsapp.vehicle + "\n- " + t.whatsapp.plate + ": ABC-507");
    expect(plateOnly).not.toContain("- " + t.whatsapp.make + ":");
    await plateMode.press("ArrowRight");
    await expect(detailsMode).toBeChecked();
    await expect(plate).toBeHidden();
    await dialog.getByText(copy.addDetails, { exact: true }).click();
    await form.getByLabel(t.form.make).fill("Toyota");
    await form.getByLabel(t.form.model, { exact: true }).fill("Corolla");
    await form.getByLabel(t.form.year, { exact: true }).fill("20");
    await consult.click();
    await expect(form.getByRole("alert")).toHaveText(t.form.invalidYear);
    await expect(form.getByLabel(t.form.year, { exact: true })).toBeFocused();
    await form.getByLabel(t.form.year, { exact: true }).fill("2016");
    await form.getByLabel(copy.engine, { exact: true }).fill("2.0");
    await form.getByLabel(copy.partNumber, { exact: true }).fill("A-123");
    await form.getByLabel(t.form.description).fill("Consulta de prueba");
    await consult.click();

    const purchaseMessage = await readMessage();
    expect(purchaseMessage).toContain(t.whatsapp.inquiry.compra.replace("{part}", t.whatsapp.part[component]));
    expect(purchaseMessage).toContain(t.serviceMessage.engine + ": 2.0");
    expect(purchaseMessage).toContain(t.serviceMessage.partNumber + ": A-123");
    expect(purchaseMessage).toContain(t.serviceMessage.purchase);
    expect(purchaseMessage).not.toContain(t.whatsapp.plate + ":");
    await expect(form.getByRole("status")).toContainText(t.form.ready);

    const buyTab = dialog.getByRole("tab", { name: copy.purchase });
    const repairTab = dialog.getByRole("tab", { name: copy.repair });
    await buyTab.focus();
    await page.keyboard.press("ArrowRight");
    await expect(repairTab).toBeFocused();
    await expect(repairTab).toHaveAttribute("aria-selected", "true");
    await expect(dialog.getByRole("heading", { name: service.repairTitle })).toBeVisible();
    await expect(form.getByLabel(t.form.make)).toHaveValue("Toyota");
    await dialog.getByText(copy.repairSteps, { exact: true }).click();
    await expect(dialog.getByText(copy.processNote)).toBeVisible();
    await expect(dialog.getByText(copy.fixSteps[3].title, { exact: true })).toBeVisible();
    await expect(dialog.getByText(copy.advice)).toBeVisible();
    await form.getByLabel(copy.problem, { exact: true }).fill("Solo se oye un clic");
    await form.getByLabel(copy.partNumber, { exact: true }).clear();
    await consult.click();
    const repairMessage = await readMessage();
    expect(repairMessage).toContain(t.whatsapp.inquiry.reparacion.replace("{part}", t.whatsapp.part[component]));
    expect(repairMessage).toContain(t.serviceMessage.problem + "\nSolo se oye un clic");
    expect(repairMessage).not.toMatch(/A-123|undefined|null/);
    expect(repairMessage).toContain(t.serviceMessage.repair);
    expect(repairMessage).not.toContain(t.whatsapp.plate + ":");
    expect(repairMessage).toContain(t.whatsapp.model + ": Corolla");

    await plateMode.click();
    await expect(plate).toHaveValue("ABC-507");
    await form.getByLabel(copy.engine, { exact: true }).clear();
    await consult.click();
    const repairWithPlate = await readMessage();
    expect(repairWithPlate).toContain(t.whatsapp.vehicle + "\n- " + t.whatsapp.plate + ": ABC-507");
    expect(repairWithPlate).not.toContain("- " + t.whatsapp.model + ":");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(page.locator("html")).not.toHaveCSS("overflow-y", "hidden");

    const card = page.locator(".service-card").filter({ has: trigger });
    const target = card.locator(locale === "es" ? ".service-photo" : ".glass-card-copy p");
    await target.scrollIntoViewIfNeeded();
    const box = (await target.boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    if (isMobile) {
      await page.touchscreen.tap(x, y);
    } else {
      await page.mouse.move(x, y);
      await expect(trigger).toHaveCSS("cursor", "pointer");
      await page.mouse.click(x, y);
    }
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: copy.close }).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
}

test("el catálogo filtra por componente, amplía las fotos y cotiza la referencia elegida", async ({ page }) => {
  const t = messages.es;
  const product = catalog.find(({ id }) => id === "cat-mit")!;
  const title = t.catalog.titles[product.id];
  await page.addInitScript(() => {
    window.open = (url) => {
      document.documentElement.dataset.catalogQuote = String(url);
      return null;
    };
  });
  await page.goto("/es/#repuestos");
  const section = page.locator("#repuestos");
  const results = section.locator(".catalog-toolbar + #catalogo-resultados");
  const cards = results.locator(".catalog-card");
  const rowOffset = () => cards.first().evaluate((card) =>
    card.getBoundingClientRect().top - card.parentElement!.previousElementSibling!.getBoundingClientRect().bottom);
  const partCards = section.locator("#despiece .part-card");
  await expect(cards).toHaveCount(4);
  await expect(section.locator("#catalogo-resultados + #despiece")).toHaveCount(1);
  await expect(cards.first().getByRole("heading", { name: t.catalog.titles["toyota-lexus"], exact: true })).toBeVisible();
  for (const card of await cards.all()) {
    await card.scrollIntoViewIfNeeded();
    const photo = card.locator("picture img");
    await expect(photo).toHaveAttribute("loading", "lazy");
    await expect(card.locator('source[type="image/webp"]')).toHaveAttribute("srcset", /\.webp/);
    await expect(photo).toHaveCSS("object-fit", "contain");
    await expect.poll(() => photo.evaluate(async (image: HTMLImageElement) => {
      await image.decode();
      return image.currentSrc;
    })).toMatch(/\.avif$/);
  }
  await section.getByRole("button", { name: t.parts.alternador.plural, exact: true }).click();
  await expect(cards).toHaveCount(2);
  const alternatorOffset = await rowOffset();
  const starters = section.getByRole("button", { name: t.parts.arrancador.plural, exact: true });
  await starters.click();
  await expect(starters).toHaveAttribute("aria-pressed", "true");
  await expect(cards).toHaveCount(2);
  await expect(cards.first()).toBeInViewport();
  await expect(cards.first().getByRole("heading", { name: title, exact: true })).toBeVisible();
  expect(await rowOffset()).toBeCloseTo(alternatorOffset, 1);
  await expect(partCards).toHaveCount(9);
  await expect(section.getByRole("heading", { name: t.catalog.titles["ford-mazda"] })).toBeVisible();

  const quote = section.getByRole("button", { name: t.catalog.availability + " · " + title });
  await quote.click();
  const dialog = page.getByRole("dialog", { name: title });
  await expect(dialog.getByText("24 V", { exact: true })).toBeVisible();
  await expect(dialog.getByText("10D", { exact: true })).toBeVisible();
  const side = dialog.getByRole("button", { name: t.catalog.angle.side, exact: true });
  await side.focus();
  await page.keyboard.press("Enter");
  await expect(side).toHaveAttribute("aria-pressed", "true");
  await expect(dialog.getByRole("img", { name: title + " · " + t.catalog.angle.side })).toBeVisible();
  await dialog.getByRole("button", { name: t.catalog.zoomIn }).click();
  await expect(dialog.getByRole("button", { name: t.catalog.zoomOut })).toHaveAttribute("aria-pressed", "true");
  await expect(dialog.getByRole("textbox", { name: t.form.plate })).toBeHidden();
  await dialog.getByRole("radio", { name: t.vehicleIdentification.plate }).click();
  await dialog.getByRole("textbox", { name: t.form.plate }).fill("234567");
  await dialog.getByRole("button", { name: t.common.consult, exact: true }).click();
  const parsed = new URL((await page.locator("html").getAttribute("data-catalog-quote"))!);
  expect(parsed.origin + parsed.pathname).toBe("https://wa.me/50689391999");
  expect(parsed.searchParams.get("text")).toContain(t.serviceMessage.product + ": " + product.reference);
  expect(parsed.searchParams.get("text")).toContain(t.whatsapp.plate + ": 234567");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(quote).toBeFocused();
  await section.getByRole("button", { name: t.catalog.all, exact: true }).click();
  await expect(cards).toHaveCount(4);
});

test("las fotos reservan su tamaño con red lenta y muestran un respaldo al fallar", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/photos/taller-arrancador-detalle-*.webp", async (route) => {
    await pending;
    await route.continue();
  });
  await page.route("**/photos/lexus-despues-*.webp", (route) => route.abort());
  try {
    await page.goto("/es/#servicios", { waitUntil: "domcontentloaded" });
    const frame = page.locator("#starters .photo-frame");
    await frame.scrollIntoViewIfNeeded();
    await expect(frame.locator(".photo-skeleton")).toBeVisible();
    await expect(frame.locator(".photo-skeleton")).toHaveCSS("animation-name", "none");
    const initial = await frame.boundingBox();
    release();
    await expect(frame.locator(".photo-skeleton")).toHaveCount(0);
    await expect(frame.locator("img")).toHaveJSProperty("complete", true);
    expect((await frame.boundingBox())?.height).toBe(initial?.height);
    const fallback = page.locator("#reparaciones .photo-fallback");
    const more = page.locator("#reparaciones .repair-more");
    await expect(more).not.toHaveAttribute("open");
    await more.getByText(messages.es.home.moreRepairs).click();
    await expect(more.getByRole("heading", { name: messages.es.repairs["audi-q7"].title })).toBeVisible();
    await more.getByRole("heading", { name: messages.es.repairs.lexus.title }).scrollIntoViewIfNeeded();
    await expect(fallback).toContainText(messages.es.media.unavailable);
    await expect(fallback).toHaveAttribute("role", "img");
  } finally {
    release();
  }
});

test("el mapa espera la cartografía y mantiene los controles reservados durante la carga", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/Ortofoto1k/wms?**", async (route) => {
    await pending;
    await route.fulfill({ path: "public/photos/taller-alternador-detalle-320.webp", contentType: "image/webp" });
  });
  try {
    await page.goto("/es/#ubicacion", { waitUntil: "domcontentloaded" });
    const canvas = page.locator(".maplibregl-canvas");
    await expect(canvas).toBeAttached();
    const loading = page.locator(".map-viewport .map-skeleton");
    await expect(loading).toBeVisible();
    const oblique = page.getByRole("button", { name: messages.es.views.oblique });
    await expect(oblique).toBeDisabled();
    await expect(page.getByRole("button", { name: messages.es.map.rotate })).toHaveCount(0);
    const size = await page.locator(".map-viewport").boundingBox();
    release();
    await expect(loading).toHaveCount(0, { timeout: 10000 });
    await expect(oblique).toBeEnabled();
    await expect(page.getByRole("button", { name: messages.es.map.rotate })).toBeVisible();
    expect((await page.locator(".map-viewport").boundingBox())?.height).toBe(size?.height);
  } finally {
    release();
  }
});

test("el recorrido conserva las anclas y respeta el movimiento reducido", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/es/");
  const sections = page.locator("main > section");
  expect(await sections.evaluateAll((nodes) => nodes.map(({ id }) => id))).toEqual([
    "inicio", "servicios", "repuestos", "pagos", "reparaciones", "proceso", "ubicacion", "contacto",
  ]);
  const process = page.locator(".process-panel");
  await process.scrollIntoViewIfNeeded();
  await expect(process).toHaveAttribute("data-entered", "");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(process).toHaveCSS("animation-name", "none");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});
