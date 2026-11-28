import { expect, test } from "./map-fixture";

test("el proceso conserva los conectores entre nodos en las seis resoluciones", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/es/#proceso");
  const panel = page.locator(".process-panel");
  const steps = panel.locator(".process-step");
  for (const width of isMobile ? [320, 375, 390] : [768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await panel.scrollIntoViewIfNeeded();
    await expect(panel).toHaveAttribute("data-entered", "");
    const geometry = await steps.evaluateAll((nodes) => {
      const first = nodes[0];
      const bounds = first.getBoundingClientRect();
      const style = getComputedStyle(first, "::after");
      const icon = first.querySelector(".step-icon")!.getBoundingClientRect();
      const next = nodes[1].querySelector(".step-icon")!.getBoundingClientRect();
      const left = bounds.left + parseFloat(style.left);
      const top = bounds.top + parseFloat(style.top);
      const vertical = next.top > icon.bottom;
      return {
        axis: vertical ? "vertical" : "horizontal",
        animation: style.animationName,
        distance: vertical ? [
          left - (icon.left + icon.width / 2), top - icon.bottom,
          top + parseFloat(style.height) - next.top,
        ] : [
          top - (icon.top + icon.height / 2), left - icon.right,
          left + parseFloat(style.width) - next.left,
        ],
      };
    });
    expect(geometry.axis).toBe(width < 768 ? "vertical" : "horizontal");
    expect(geometry.animation).toBe(width < 768 ? "connect-steps-vertically" : "connect-steps");
    for (const distance of geometry.distance) expect(Math.abs(distance)).toBeLessThanOrEqual(1);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await steps.first().evaluate(node => getComputedStyle(node, "::after").animationName)).toBe("none");
});

test("la aparición de una tarjeta ocurre una vez y conserva la acción de toda la tarjeta", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/es/");
  const card = page.locator("#despiece li").last();
  const starts = await card.evaluateHandle(node => {
    const counter = { starts: 0 };
    node.addEventListener("animationstart", event => {
      if (event.target === node) counter.starts++;
    });
    return counter;
  });
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute("data-entered", "");
  await expect.poll(() => starts.evaluate(counter => counter.starts)).toBe(1);
  await page.locator("#inicio").scrollIntoViewIfNeeded();
  await card.scrollIntoViewIfNeeded();
  const title = await card.getByRole("heading").innerText();
  const visual = card.locator(".part-card-visual");
  await visual.evaluate(node => node.scrollIntoView({ block: "center", behavior: "instant" }));
  const box = (await visual.boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  if (isMobile) await page.touchscreen.tap(x, y);
  else await page.mouse.click(x, y);
  await expect(page.getByRole("dialog")).toHaveAccessibleName(title);
  await page.keyboard.press("Escape");
  await expect(card.getByRole("button")).toBeFocused();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(card).not.toHaveAttribute("data-entered", "");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(card).toHaveCSS("animation-name", "none");
  expect(await starts.evaluate(counter => counter.starts)).toBe(1);
  await starts.dispose();
});

test("los encabezados y las tarjetas siguen disponibles sin IntersectionObserver", async ({ page }) => {
  await page.addInitScript(() => { Reflect.deleteProperty(window, "IntersectionObserver"); });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/es/#despiece");
  const heading = page.locator("#despiece .parts-heading");
  const card = page.locator("#despiece .part-availability").first();
  await expect(heading).toHaveCSS("opacity", "1");
  await expect(heading).toHaveCSS("animation-name", "none");
  await card.click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("el diálogo conserva el foco hasta completar el cierre en escritorio y móvil", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/es/#servicios");
  const trigger = page.locator("#servicios .service-card button").first();
  await trigger.click();
  const dialog = page.getByRole("dialog");
  const close = dialog.locator(".service-dialog-close");
  await expect(close).toBeFocused();
  const style = await dialog.evaluate(node => {
    const computed = getComputedStyle(node);
    return {
      from: computed.getPropertyValue("--dialog-from").trim(),
      duration: computed.transitionDuration,
      backdrop: getComputedStyle(node, "::backdrop").transitionProperty,
    };
  });
  expect(style.from).toContain(isMobile ? "translateY" : "scale");
  expect(style.duration).toContain("0.25s");
  expect(style.backdrop).toContain("opacity");
  await dialog.evaluate(async node => {
    await Promise.allSettled(node.getAnimations().map(animation => animation.finished));
    // Hold the real exit transitions while checking native dialog and focus state.
    node.querySelector<HTMLElement>(".service-dialog-close")!.click();
    node.getAnimations().forEach(animation => animation.pause());
  });
  await expect(dialog).toHaveAttribute("data-closing", "");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await dialog.evaluate(node => node.getAnimations().forEach(animation => animation.finish()));
  await expect(trigger).toBeFocused();
  await expect(dialog).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await trigger.click();
  await expect(close).toBeFocused();
  expect(await dialog.evaluate(node => node.getAnimations().length)).toBe(0);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test.describe("primera pintura sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("las secciones y el acceso directo al taller permanecen visibles", async ({ page }) => {
    await page.goto("/es/");
    for (const id of ["servicios", "repuestos", "proceso", "reparaciones", "pagos", "ubicacion", "contacto"]) {
      const title = page.locator("#" + id + " .section-heading").first();
      await expect(title).toBeVisible();
      await expect(title).toHaveCSS("opacity", "1");
    }
    await expect(page.getByRole("contentinfo").locator(".footer-identity")).toHaveCSS("opacity", "1");
    await expect(page.locator("#contacto a").first()).toHaveAttribute("href", /^https:\/\/wa\.me\//);
  });
});
