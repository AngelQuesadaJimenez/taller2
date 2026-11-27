import { expect, test } from "@playwright/test";
import { sparePartGroups, type SparePart } from "../data/services.config";
import { locales } from "../i18n/config";
import { messages } from "../i18n/messages";

for (const locale of locales) {
  test(`despiece y formas de pago en ${locale}`, async ({ page, isMobile }) => {
    test.setTimeout(60000);
    const t = messages[locale];
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: locale === "es" ? "light" : "dark" });
    if (isMobile) await page.setViewportSize({ width: 320, height: 740 });
    await page.addInitScript(() => {
      window.open = (url) => {
        document.documentElement.dataset.partInquiry = String(url);
        return null;
      };
    });
    const readUrl = async () => new URL((await page.locator("html").getAttribute("data-part-inquiry"))!);
    await page.goto("/" + locale + "/#repuestos");
    await expect(page.locator('#contacto button[type="submit"]')).toBeEnabled();
    await page.getByRole("link", { name: t.breakdown.title, exact: true }).click();
    await expect(page).toHaveURL(/#despiece$/);
    const breakdown = page.getByRole("region", { name: t.breakdown.title, exact: true });
    await expect(breakdown.getByRole("button")).toHaveCount(9);
    await expect(breakdown.locator(".part-card-number")).toHaveText(["01", "02", "03", "04", "05", "06", "07", "08", "09"]);
    const configuredParts: SparePart[] = sparePartGroups.flatMap(({ parts }) => [...parts] as SparePart[]);
    for (const [index, [id, item]] of Object.entries(t.breakdown.items).entries()) {
      const trigger = breakdown.getByRole("button", { name: t.catalog.availability + " · " + item.name, exact: true });
      const card = breakdown.getByRole("article").filter({
        has: page.getByRole("heading", { name: item.name, exact: true }),
      });
      const part = configuredParts.find((entry) => entry.id === id);
      if (!part) throw new Error("Missing catalog entry for " + id);
      const visual = card.locator(".part-card-visual");
      if (part.photo) {
        await expect(visual.getByRole("img", { name: item.name })).toHaveAttribute("src", part.photo.src);
      } else {
        await expect(visual.locator("img")).toHaveCount(0);
        await expect(visual.locator("svg")).toBeVisible();
      }
      if (index === 0) {
        const body = card.getByText(item.description);
        await body.scrollIntoViewIfNeeded();
        const box = (await body.boundingBox())!;
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        if (isMobile) {
          await page.touchscreen.tap(x, y);
        } else {
          await page.emulateMedia({ reducedMotion: "no-preference" });
          await page.mouse.move(x, y);
          await expect(card).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -3)");
          await page.mouse.down();
          await expect(card).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 1)");
          await page.mouse.up();
          await page.emulateMedia({ reducedMotion: "reduce" });
        }
      } else {
        await trigger.press(index === 1 ? "Space" : "Enter");
      }
      const dialog = page.getByRole("dialog", { name: item.name, exact: true });
      await expect(dialog.getByText(t.breakdown.details)).toBeVisible();
      await expect(dialog.getByRole("button", { name: t.serviceDetail.close })).toBeFocused();
      const consult = dialog.getByRole("button", { name: t.common.consult, exact: true });
      await expect(consult).toBeInViewport();
      await consult.click();
      const url = await readUrl();
      expect(url.origin + url.pathname).toBe("https://wa.me/50689391999");
      expect(url.searchParams.get("text")).toContain(t.breakdown.inquiry.replace("{piece}", item.name));
      expect(url.searchParams.get("text")).not.toMatch(/undefined|null|\{piece\}/);
      expect(url.searchParams.get("text")).not.toContain(t.whatsapp.vehicle);
      const plate = dialog.getByRole("textbox", { name: t.form.plate, exact: true });
      await expect(plate).toBeHidden();
      if (index === 0) {
        const plateMode = dialog.getByRole("radio", { name: t.vehicleIdentification.plate });
        const detailsMode = dialog.getByRole("radio", { name: t.vehicleIdentification.details });
        await plateMode.press("Space");
        await expect(plateMode).toBeChecked();
        await expect(plate).toHaveAccessibleDescription(t.form.plateHelp);
        await plate.fill("  CL-18345  ");
        await plateMode.press("ArrowRight");
        await expect(detailsMode).toBeChecked();
        await expect(plate).toBeHidden();
        await dialog.getByLabel(t.form.make, { exact: true }).fill("  Toyota ");
        await dialog.getByLabel(t.form.model, { exact: true }).fill("Corolla");
        const year = dialog.getByLabel(t.form.year, { exact: true });
        await year.fill("20");
        await consult.click();
        await expect(year).toBeFocused();
        await expect(dialog.getByRole("alert")).toHaveText(t.form.invalidYear);
        expect((await readUrl()).href).toBe(url.href);

        await plateMode.click();
        await expect(plate).toHaveValue("  CL-18345  ");
        await dialog.getByText(t.serviceDetail.addDetails, { exact: true }).click();
        await dialog.getByLabel(t.serviceDetail.partNumber, { exact: true }).fill("RS-123");
        await dialog.getByLabel(t.form.description, { exact: true }).fill("Referencia de prueba");
        await consult.click();
        const withPlate = (await readUrl()).searchParams.get("text");
        expect(withPlate).toContain(t.whatsapp.plate + ": CL-18345");
        expect(withPlate).not.toContain(t.whatsapp.year + ":");
        expect(withPlate).not.toContain("Toyota");
        expect(withPlate).toContain(t.serviceMessage.partNumber + ": RS-123");
        expect(withPlate).toContain("Referencia de prueba");

        await detailsMode.click();
        await expect(year).toHaveValue("20");
        await year.fill("2016");
        await consult.click();
        const withDetails = (await readUrl()).searchParams.get("text");
        expect(withDetails).toContain(t.breakdown.inquiry.replace("{piece}", item.name));
        expect(withDetails).toContain(t.whatsapp.vehicle + "\n- " + t.whatsapp.make + ": Toyota\n- "
          + t.whatsapp.model + ": Corolla\n- " + t.whatsapp.year + ": 2016");
        expect(withDetails).not.toContain(t.whatsapp.plate + ":");
        expect(withDetails).toContain(t.serviceMessage.partNumber + ": RS-123");
      }
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
      await expect(card).toHaveCSS("transform", "none");
    }

    const payments = page.getByRole("region", { name: t.payments.title, exact: true });
    await expect(payments.getByRole("listitem")).toHaveCount(5);
    await expect(payments.getByRole("heading", { level: 3 })).toHaveText(Object.values(t.payments.methods).map(({ name }) => name));
    const bankTransfer = payments.getByRole("article").filter({
      has: page.getByRole("heading", { name: t.payments.methods.transferencia.name, exact: true }),
    });
    await expect(bankTransfer.locator("svg.lucide-landmark")).toBeVisible();
    await expect(payments.getByText(t.payments.methods.bac.description.replace("{months}", "3"))).toBeVisible();
    const markHeights = await payments.locator(".payment-mark").evaluateAll((marks) => marks.map((mark) => mark.getBoundingClientRect().height));
    expect(new Set(markHeights).size).toBe(1);
    const logos = payments.locator(".payment-brand-logo img:visible");
    await expect(logos).toHaveCount(2);
    const bac = payments.getByRole("article").filter({
      has: page.getByRole("heading", { name: t.payments.methods.bac.name, exact: true }),
    });
    const bacLogo = bac.locator(".payment-brand-logo img:visible");
    await bacLogo.scrollIntoViewIfNeeded();
    await expect(bacLogo).toHaveAttribute("src", locale === "es" ? "/brands/bac-rojo.svg" : "/brands/bac.svg");
    await expect(bacLogo).toHaveCSS("object-fit", "contain");
    await expect.poll(() => bacLogo.evaluate(async (img: HTMLImageElement) => {
      await img.decode();
      return [img.naturalWidth, img.naturalHeight];
    })).toEqual([157, 42]);

    const sinpe = payments.getByRole("article").filter({
      has: page.getByRole("heading", { name: t.payments.methods.sinpe.name, exact: true }),
    });
    const logo = sinpe.locator(".payment-brand-logo img:visible");
    await logo.scrollIntoViewIfNeeded();
    await expect(logo).toHaveAttribute("src", locale === "es" ? "/brands/sinpe-movil.png" : "/brands/sinpe-movil-invertido.png");
    await expect(logo).toHaveCSS("object-fit", "contain");
    expect(await logo.evaluate(async (img: HTMLImageElement) => {
      await img.decode();
      const preview = document.createElement("canvas");
      const ctx = preview.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      return ctx.getImageData(0, 0, 1, 1).data[3];
    })).toBe(0);
    await payments.getByRole("list").evaluate((list) => {
      window.scrollBy(0, list.getBoundingClientRect().top - window.innerHeight + 60);
    });
    await expect(page.locator(".whatsapp-bubble")).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  });
}
