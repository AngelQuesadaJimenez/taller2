import type { Page } from "@playwright/test";
import { expect, test } from "./map-fixture";
import AxeBuilder from "@axe-core/playwright";
import { languages, locales, localeKey, themeKey } from "../i18n/config";
import { messages } from "../i18n/messages";

function preferenceButton(page: Page, name: "language" | "theme") {
  return page.getByRole("banner").locator(`button[data-preference="${name}"]`);
}

for (const locale of locales) {
  for (const theme of ["dark", "light"] as const) {
    test(`${locale.toUpperCase()} · ${theme}: secciones, formulario, mapa y contraste`, async ({ page }) => {
      const t = messages[locale];
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (entry) => {
        if (entry.type() === "error" && !entry.location().url.startsWith("https://")) errors.push(entry.text());
      });
      await page.emulateMedia({ colorScheme: theme === "dark" ? "light" : "dark", reducedMotion: "reduce" });
      await page.addInitScript(({ key, theme }) => localStorage.setItem(key, theme), { key: themeKey, theme });
      await page.goto("/" + locale + "/#ubicacion");
      await expect(page.locator("html")).toHaveAttribute("lang", languages[locale].tag);
      await expect(page.locator("html")).toHaveCSS("color-scheme", theme);
      await expect(page.locator("body")).toHaveCSS("background-color", theme === "light" ? "rgb(238, 243, 248)" : "rgb(11, 16, 23)");
      await expect(page.locator(".hero-actions .button--primary")).toHaveCSS("background-color", theme === "light" ? "rgb(217, 119, 6)" : "rgb(245, 158, 11)");
      for (const name of ["language", "theme"] as const) {
        await expect(preferenceButton(page, name)).toHaveCount(1);
        await expect(preferenceButton(page, name)).toBeInViewport({ ratio: 1 });
      }
      await expect(page.locator(".site-header .brand-isotype")).toHaveCSS("background-color", theme === "light" ? "rgb(180, 83, 9)" : "rgb(245, 158, 11)");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(t.home.hero.emphasis + " " + t.home.hero.suffix);
      for (const section of ["services", "products", "process", "location", "contact"] as const) {
        await expect(page.getByRole("heading", { name: t.home[section].title, exact: true })).toBeVisible();
      }
      await expect(page.getByRole("heading", { name: t.home.repairs })).toBeVisible();
      await expect(page.getByRole("button", { name: t.map.rotate })).toBeVisible({ timeout: 15000 });
      await expect(page.getByRole("button", { name: t.views.oblique })).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByRole("link", { name: t.directions.waze, exact: true })).toBeVisible();
      await expect(page.getByLabel(t.form.name, { exact: true })).toBeVisible();
      const footer = page.getByRole("contentinfo");
      await expect(footer.getByRole("link", { name: t.common.privacy }))
        .toHaveAttribute("href", "/" + locale + "/privacidad/");
      await expect(footer.getByText(t.footer.description, { exact: true })).toBeVisible();
      await expect(footer.getByRole("navigation", { name: t.footer.links })).toBeVisible();
      const url = await page.locator("#inicio").getByRole("link", { name: t.common.consult }).getAttribute("href");
      expect(new URL(url!).searchParams.get("text")).toContain(t.whatsapp.greeting);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
      const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(audit.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }))).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}

test("las preferencias conservan el mapa, el formulario y el ancla al cambiar y recargar", async ({ page }) => {
  const es = messages.es;
  const en = messages.en;
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.addInitScript(() => {
    window.open = (url) => {
      document.documentElement.dataset.waUrl = String(url);
      return null;
    };
  });
  await page.goto("/es/#ubicacion");
  await expect(page.getByRole("button", { name: es.map.rotate })).toBeVisible({ timeout: 15000 });
  await page.getByRole("button", { name: es.views.aerial }).click();
  const canvas = page.locator(".maplibregl-canvas");
  await canvas.evaluate((node) => node.setAttribute("data-test-persist", "yes"));
  await page.getByLabel(es.form.name, { exact: true }).fill("Ana Pérez");
  await page.getByLabel(es.form.intent, { exact: true }).selectOption("reparacion");
  await page.getByLabel(es.form.part, { exact: true }).selectOption("arrancador");
  const language = preferenceButton(page, "language");
  const languageOptions = page.locator(".language-options");
  await expect(language).toHaveText("ES");
  await expect(language).toHaveAccessibleName(es.common.language + " · ES");
  await expect(language.locator(".language-flag")).toHaveCSS("background-image", /\/flags\/cr\.svg/);
  await expect(languageOptions).toBeHidden();
  await language.press("Enter");
  await expect(language).toHaveAttribute("aria-expanded", "true");
  const spanish = languageOptions.getByRole("button", { name: "Español" });
  const english = languageOptions.getByRole("button", { name: "English" });
  await expect(spanish).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Tab");
  await expect(spanish).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(languageOptions).toBeHidden();
  await expect(language).toBeFocused();
  await language.press("Enter");
  await english.press("Enter");
  await expect(language).toBeFocused();
  await expect(languageOptions).toBeHidden();
  await expect(language).toHaveText("EN");
  await expect(language).toHaveAccessibleName(en.common.language + " · EN");
  await expect(language.locator(".language-flag")).toHaveCSS("background-image", /\/flags\/us\.svg/);
  await expect(page).toHaveURL(/\/en\/#ubicacion$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
  await expect(page).toHaveTitle(/^Alternators and starters/);
  await expect(canvas).toHaveAttribute("data-test-persist", "yes");
  await expect(canvas).toHaveAttribute("aria-label", en.map.region);
  await expect(page.getByRole("button", { name: en.views.aerial })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel(en.form.name, { exact: true })).toHaveValue("Ana Pérez");
  await expect(page.getByLabel(en.form.intent, { exact: true })).toHaveValue("reparacion");
  await expect(page.getByLabel(en.form.part, { exact: true })).toHaveValue("arrancador");

  const theme = preferenceButton(page, "theme");
  await expect(theme).toHaveAccessibleName(en.common.switchLight);
  await theme.click();
  await expect(theme).toHaveAccessibleName(en.common.switchDark);
  await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
  await expect(canvas).toHaveAttribute("data-test-persist", "yes");

  await page.getByLabel(en.form.year, { exact: true }).fill("12");
  await page.getByRole("button", { name: en.form.submit }).click();
  await expect(page.locator("#contacto").getByRole("alert")).toHaveText(en.form.invalidYear);
  await page.getByLabel(en.form.year, { exact: true }).clear();
  await page.getByRole("button", { name: en.form.submit }).click();
  const wa = new URL((await page.locator("html").getAttribute("data-wa-url"))!);
  expect(wa.href).toMatch(/^https:\/\/wa\.me\/50689391999\?/);
  expect(wa.searchParams.get("text")).toContain("repairing a starter");
  expect(wa.searchParams.get("text")).not.toMatch(/Vehicle details|Additional details|undefined|null/);

  await page.reload();
  await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
  await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
  expect(await page.evaluate((key) => localStorage.getItem(key), localeKey)).toBe("en");
  expect(await page.evaluate((key) => localStorage.getItem(key), themeKey)).toBe("light");
  await theme.focus();
  await page.keyboard.press("Space");
  await expect(theme).toBeFocused();
  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
  await language.click();
  await languageOptions.getByRole("button", { name: "Español" }).click();
  await expect(page).toHaveURL(/\/es\/#ubicacion$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es-CR");
  await expect(language).toHaveText("ES");
});

test("el botón de tema alterna desde la preferencia del sistema guardada", async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, "system"), themeKey);
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/es/privacidad/");
  const theme = preferenceButton(page, "theme");
  await expect(theme).toHaveAccessibleName(messages.es.common.switchLight);
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
  await expect(theme).toHaveAccessibleName(messages.es.common.switchDark);
  await theme.click();
  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
  expect(await page.evaluate((key) => localStorage.getItem(key), themeKey)).toBe("dark");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
  await theme.click();
  await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
});

test("las páginas estáticas y legales tienen idioma y metadatos propios", async ({ page, request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const locale of locales) {
    const path = "/" + locale + "/";
    const html = await (await request.get(path)).text();
    expect(html).toContain(`<html lang="${languages[locale].tag}"`);
    expect(html).toMatch(new RegExp('rel="canonical" href="[^"]+' + path + '"'));
    for (const other of locales) expect(html).toContain('hrefLang="' + languages[other].tag + '"');
    expect(sitemap).toContain(path + "</loc>");
  }
  await page.goto("/en/privacidad/");
  await expect(page.getByRole("heading", { name: "Privacy" })).toBeVisible();
  const bubble = page.locator("a.whatsapp-bubble");
  await expect(bubble).toBeInViewport({ ratio: 1 });
  await expect(bubble).toHaveAccessibleName(/whatsapp/i);
  await expect(bubble).toHaveAttribute("href", /^https:\/\/wa\.me\/50689391999(?:\?|$)/);
  const language = preferenceButton(page, "language");
  await expect(language).toHaveText("EN");
  await page.setViewportSize({ width: 320, height: 720 });
  await language.click();
  const languageOptions = page.locator(".language-options");
  await expect(languageOptions).toBeInViewport({ ratio: 1 });
  await languageOptions.getByRole("button", { name: "Español" }).click();
  await expect(page).toHaveURL(/\/es\/privacidad\/$/);
  await expect(page.getByRole("heading", { name: "Privacidad" })).toBeVisible();
  await expect(language).toBeInViewport({ ratio: 1 });
  await expect(language).toHaveText("ES");
  await expect(language.locator(".language-flag")).toHaveCSS("background-image", /\/flags\/cr\.svg/);
  await expect(preferenceButton(page, "theme")).toBeInViewport({ ratio: 1 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});
