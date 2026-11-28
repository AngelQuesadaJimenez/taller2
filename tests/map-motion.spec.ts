import { expect, test } from "./map-fixture";
import { business } from "../data/business.config";
import { messages } from "../i18n/messages";

test("la vista 3D recupera la inclinación desde la vista general sin movimiento", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es/#ubicacion");
  const map = page.locator(".map-shell");
  const canvas = map.locator(".map-canvas--3d");
  const canvasHandle = await canvas.elementHandle();
  const shop = map.getByRole("button", { name: business.name, exact: true });
  const position = () => shop.evaluate((marker) => {
    const bounds = marker.getBoundingClientRect();
    const frame = marker.closest(".map-canvas--3d")!.getBoundingClientRect();
    return { x: bounds.left - frame.left, y: bounds.top - frame.top };
  });

  const topView = map.getByRole("button", { name: messages.es.views.aerial });
  await expect(topView).toBeEnabled({ timeout: 15000 });
  await topView.click();
  await map.getByRole("button", { name: messages.es.map.overview }).click();
  // MapLibre draws DOM markers on its next render, after the immediate camera change.
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  const topPosition = await position();
  const oblique = map.getByRole("button", { name: messages.es.views.oblique });
  await oblique.click();
  await expect(oblique).toHaveAttribute("aria-pressed", "true");
  await expect.poll(async () => {
    const next = await position();
    return Math.hypot(next.x - topPosition.x, next.y - topPosition.y);
  }).toBeGreaterThan(4);
  expect(await canvas.evaluate((element, initial) => element === initial, canvasHandle)).toBe(true);
});
