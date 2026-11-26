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

for (const width of [375, 768, 1440]) {
  test(`responsive y visual en ${width} px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: width === 375 ? "light" : "dark", reducedMotion: "reduce" });
    await page.goto("/es/");
    await expect(page.locator('#contacto button[type="submit"]')).toBeEnabled();
    await page.evaluate(() => document.fonts.ready);

    const header = page.getByRole("banner");
    const navigation = header.getByRole("navigation", { name: messages.es.nav.main });
    await expect(navigation.getByRole("link", { name: messages.es.nav.labels.contacto })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const heroPhoto = page.locator(".hero-visual img");
    await expect.poll(() => heroPhoto.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    await verifyAppearance(header.locator(".header-glass"), `encabezado-${width}.png`, testInfo);

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
    await verifyAppearance(dialog, `consulta-${width}.png`, testInfo);
    await page.keyboard.press("Escape");
    await expect(service.getByRole("button")).toBeFocused();

    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("navigation", { name: messages.es.footer.links })).toBeVisible();
    await expect(page.locator("#contacto form")).toBeVisible();
    await expect(page.locator("#pagos .payment-card")).toHaveCount(5);
    const overflow = await page.evaluate(() => {
      const selectors = [".site-header", ".services-grid", ".catalog-grid", ".parts-grid", ".payment-grid", ".contact-form", ".footer-grid"];
      const wide = Array.from(document.querySelectorAll(selectors.join(",")))
        .filter((element) => element.scrollWidth > element.clientWidth + 1)
        .map((element) => element.className);
      return { width: document.documentElement.scrollWidth, wide };
    });
    expect(overflow).toEqual({ width, wide: [] });
  });
}
