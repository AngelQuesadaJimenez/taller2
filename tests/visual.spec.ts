import { existsSync } from "node:fs";
import type { Locator, TestInfo } from "@playwright/test";
import { messages } from "../i18n/messages";
import { expect, test } from "./map-fixture";

async function verifyAppearance(locator: Locator, name: string, testInfo: TestInfo) {
  if (process.platform !== "linux") return;

  if (!existsSync(testInfo.snapshotPath(name, { kind: "screenshot" }))) {
    await locator.screenshot({
      path: testInfo.outputPath(`candidata-${name}`),
      animations: "disabled",
      caret: "hide",
      scale: "css",
    });
  }

  await expect.soft(locator).toHaveScreenshot(name);
}

const screenshotWidths = new Set([375, 768, 1440]);

for (const width of [320, 360, 375, 390, 428, 768, 1024, 1280, 1440, 1920]) {
  test(`responsive y visual en ${width} px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: width < 768 ? "light" : "dark", reducedMotion: "reduce" });
    await page.goto("/es/");
    await expect(page.locator('#contacto button[type="submit"]')).toBeEnabled();
    await page.evaluate(() => document.fonts.ready);

    const header = page.getByRole("banner");
    const navigation = header.getByRole("navigation", { name: messages.es.nav.main });
    await expect(navigation.getByRole("link", { name: messages.es.nav.labels.contacto })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const heroPhoto = page.locator(".hero-visual img");
    await expect.poll(() => heroPhoto.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    if (screenshotWidths.has(width)) {
      await verifyAppearance(header.locator(".header-glass"), `encabezado-${width}.png`, testInfo);
    }

    const language = header.locator('[data-preference="language"]');
    await language.click();
    const english = header.getByRole("button", { name: "English", exact: true });
    await expect(english).toBeInViewport({ ratio: 1 });
    await english.focus();
    await page.keyboard.press("Escape");
    await expect(language).toBeFocused();

    const service = page.locator("#servicios .service-card").first();
    await expect(service.getByRole("button")).toBeVisible();
    await service.getByRole("button").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("radio", { name: messages.es.vehicleIdentification.plate, exact: true }).click();
    const plate = dialog.getByRole("textbox", { name: messages.es.form.plate });
    await expect(plate).toBeVisible();
    await expect(dialog.getByRole("button", { name: messages.es.common.consult, exact: true })).toBeInViewport({ ratio: 1 });
    expect(await dialog.evaluate((element) => element.scrollWidth)).toBeLessThanOrEqual(width);
    if (screenshotWidths.has(width)) {
      await verifyAppearance(dialog, `consulta-${width}.png`, testInfo);
    }
    await plate.fill("QA-123");
    await expect(plate).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(service.getByRole("button")).toBeFocused();

    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("navigation", { name: messages.es.footer.links })).toBeVisible();
    await expect(page.locator("#contacto form")).toBeVisible();
    await expect(page.locator("#pagos .payment-card")).toHaveCount(5);
    const overflow = await page.evaluate(() => {
      const selectors = [".site-header", ".services-grid", ".catalog-grid", ".parts-grid", ".payment-grid", ".location-layout", ".contact-form", ".footer-grid"];
      const wide = Array.from(document.querySelectorAll(selectors.join(",")))
        .filter((element) => element.scrollWidth > element.clientWidth + 1)
        .map((element) => element.className);
      return { width: document.documentElement.scrollWidth, wide };
    });
    expect(overflow).toEqual({ width, wide: [] });
  });
}

for (const width of [390, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`evidencia por sección a ${width} px en ${theme}`, async ({ page }, info) => {
      test.setTimeout(75_000);
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      await page.goto("/es/");
      await expect(page.locator('#contacto button[type="submit"]')).toBeEnabled();
      await page.evaluate(() => document.fonts.ready);

      // Capture the actual visitor viewport, including the floating help and sticky navigation.
      for (const id of ["inicio", "servicios", "repuestos", "proceso", "reparaciones", "pagos", "ubicacion", "contacto", "pie"]) {
        const section = id === "pie" ? page.getByRole("contentinfo") : page.locator("#" + id);
        await section.evaluate((node) => node.scrollIntoView({ block: "start" }));
        if (id === "ubicacion") {
          await expect(section.getByRole("button", { name: messages.es.views.oblique })).toBeEnabled({ timeout: 15_000 });
        }
        await section.locator("img").evaluateAll(async (images) => {
          const visible = (images as HTMLImageElement[]).filter((img) => {
            const rect = img.getBoundingClientRect();
            return rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
          });
          await Promise.all(visible.map((img) => img.decode()));
        });
        await info.attach(id, { body: await page.screenshot({ animations: "disabled", scale: "css" }), contentType: "image/png" });
      }
      const part = page.locator("#despiece .part-availability").first();
      await part.click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toHaveAccessibleName(messages.es.breakdown.items["placas-diodos"].name);
      await info.attach("consulta-repuesto", { body: await dialog.screenshot({ animations: "disabled", scale: "css" }), contentType: "image/png" });
      await page.keyboard.press("Escape");
      await expect(part).toBeFocused();
    });
  }
}
