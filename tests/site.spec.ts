import { expect, test } from "./map-fixture";
import AxeBuilder from "@axe-core/playwright";
import { business, businessLocation } from "../data/business.config";
import { navigation } from "../data/site-content";
import { lngLat, propertyFocusMask } from "../data/map.config";
import { googleDirectionsUrl } from "../lib/directions";
import { messages } from "../i18n/messages";

const tilePattern = "https://tile.openstreetmap.org/**";

test("portada responsive, imágenes, navegación y carga diferida", async ({ page }, testInfo) => {
  const errors: string[] = [];
  let tiles = 0;
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text() + " " + message.location().url); });
  page.on("request", (request) => { if (/tile.openstreetmap.org|geos1.snitcr.go.cr|tiles.openfreemap.org/.test(request.url())) tiles += 1; });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Venta y reparación de alternadores y arrancadores");
  await expect(page).toHaveTitle(new RegExp(business.tradeName + "$"));
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", business.tradeName);
  await expect(page.locator(".service-card")).toHaveCount(2);
  const services = page.locator("#servicios");
  await expect(services.locator('a[href^="https://wa.me/"]')).toHaveCount(0);
  await expect(services.locator('a[href="#reparaciones"]')).toHaveCount(0);
  await expect(page.locator("#repuestos a[href^=\"https://wa.me/\"]")).toHaveCount(0);
  await expect(page.locator("#reparaciones figure:visible")).toHaveCount(4);
  await expect(page.locator("#reparaciones figure a[href$='.webp']")).toHaveCount(8);
  await expect(page.getByText("Logotipo y fotografías del taller.", { exact: true })).toHaveCount(1);
  const brand = page.getByRole("banner").locator(".brand-logo");
  await expect(page.getByRole("banner").getByRole("link", { name: business.tradeName + ", Inicio" })).toBeVisible();
  await expect(brand.locator(".brand-name")).toHaveText("Alternadores y Arrancadores Río Segundo");
  await expect(brand.locator(".brand-isotype")).toHaveCSS("mask-image", /rs-silueta-dorado\.png/);
  await expect(brand.locator(".brand-isotype")).toHaveAttribute("aria-hidden", "true");
  await expect(page.getByRole("contentinfo").locator(".brand-name")).toHaveText(business.tradeName);
  await expect(page.locator("main")).not.toContainText(/Calle Coricaf[eé]/i);
  const hero = page.locator("#inicio");
  await expect(hero.locator(".hero-intro")).toHaveText("Consultá por el repuesto o la reparación que necesitás.");
  const image = hero.locator("picture img");
  await expect(image).toHaveAttribute("src", /\/photos\/toyota-frente-480\.webp$/);
  await expect(image).toHaveAttribute("fetchpriority", "high");
  await expect(image).toHaveJSProperty("complete", true);
  expect(await image.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBeGreaterThan(0);
  await expect(hero.getByRole("link", { name: "Consultar por WhatsApp" })).toHaveAttribute("href", /^https:\/\/wa\.me\/50689391999/);
  await expect(hero.getByRole("link", { name: "Explorar servicios" })).toHaveAttribute("href", "#servicios");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  expect(tiles).toBe(0);
  const header = page.getByRole("banner");
  await expect(header.locator('a[href^="https://wa.me/"]')).toHaveCount(1);
  const bubble = page.locator("a.whatsapp-bubble");
  await expect(bubble).toBeInViewport({ ratio: 1 });
  await expect(bubble).toHaveAccessibleName(/whatsapp/i);
  await expect(bubble).toHaveAttribute("href", /^https:\/\/wa\.me\/50689391999(?:\?|$)/);
  await expect(bubble).toHaveCSS("position", "fixed");
  await expect(bubble).toHaveCSS("background-color", "rgb(34, 197, 94)");
  await expect(header.locator(".header-whatsapp img")).toHaveAttribute("src", "/brands/whatsapp.webp");
  const footer = page.getByRole("contentinfo");
  const footerNav = footer.getByRole("navigation", { name: messages.es.footer.links });
  await expect(footerNav.getByRole("link")).toHaveCount(navigation.length + 1);
  await expect(footerNav.getByRole("link", { name: messages.es.footer.repairs, exact: true })).toHaveAttribute("href", "#reparaciones");
  for (const { id } of navigation) {
    await expect(footerNav.getByRole("link", { name: messages.es.nav.labels[id], exact: true })).toHaveAttribute("href", "#" + id);
  }
  const footerWhatsApp = footer.getByRole("link", { name: "WhatsApp 8939-1999" });
  await expect(footerWhatsApp).toHaveAttribute("href", /^https:\/\/wa\.me\/50689391999/);
  await expect(footerWhatsApp.getByText(business.whatsapp.display, { exact: true })).toHaveCSS("white-space", "nowrap");
  await expect(footer.getByRole("link", { name: /2440-2131/ })).toHaveAttribute("href", "tel:+50624402131");
  await expect(footer.getByRole("link", { name: "Llamadas al taller 8939-1999", exact: true })).toHaveAttribute("href", "tel:+50689391999");
  await expect(footer.getByRole("link", { name: "Cómo llegar" })).toHaveAttribute("href", "#ubicacion");
  await expect(footer.getByText(messages.es.hours.weekdays.display, { exact: true })).toBeVisible();
  const facebook = footer.getByRole("link", { name: "Facebook del taller" });
  await expect(facebook).toHaveAttribute("href", "https://www.facebook.com/TalleryRepuestoselectricosRio2/");
  await expect(facebook.locator("img")).toHaveAttribute("src", "/brands/facebook.png");
  const instagram = footer.getByRole("link", { name: "Instagram del taller" });
  await expect(instagram).toHaveAttribute("href", "https://www.instagram.com/alternadoresyarrancadores_rio2/");
  await expect(instagram.locator("img")).toHaveAttribute("src", "/brands/instagram.png");
  if (testInfo.project.name === "móvil") await page.setViewportSize({ width: 320, height: 720 });
  const primaryNav = header.getByRole("navigation", { name: messages.es.nav.main });
  await expect(header.getByRole("button", { name: /abrir menú|cerrar menú/i })).toHaveCount(0);
  for (const { id } of navigation) {
    const link = primaryNav.getByRole("link", { name: messages.es.nav.labels[id], exact: true });
    await expect(link).toHaveAttribute("href", "#" + id);
    await expect(link).toBeInViewport({ ratio: 1 });
  }
  await expect(primaryNav.getByRole("link", { name: "Inicio" })).toHaveAttribute("aria-current", "location");
  await expect(header.locator('button[data-preference="language"]')).toBeInViewport({ ratio: 1 });
  await expect(header.locator('button[data-preference="theme"]')).toBeInViewport({ ratio: 1 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  const partsLink = primaryNav.getByRole("link", { name: "Repuestos" });
  await partsLink.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#repuestos$/);
  await expect(partsLink).toHaveAttribute("aria-current", "location");
  expect(errors).toEqual([]);
});

test("el submenú Glass se puede usar con teclado y lleva a la ficha elegida", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Principal" });
  const disclosure = nav.getByRole("button", { name: "Opciones de servicios" });
  await disclosure.focus();
  await page.keyboard.press("Enter");
  await expect(disclosure).toHaveAttribute("aria-expanded", "true");
  const dropdown = page.locator("#servicios-menu");
  await expect(dropdown).toHaveCSS("backdrop-filter", /blur/);
  await expect(dropdown).toBeInViewport({ ratio: 1 });
  if (testInfo.project.name !== "móvil") {
    const panel = (await dropdown.boundingBox())!;
    const header = (await page.locator(".header-glass").boundingBox())!;
    expect(panel.y).toBeGreaterThanOrEqual(header.y + header.height);
  }
  await page.keyboard.press("Tab");
  await expect(dropdown.getByRole("button", { name: "Alternadores" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(disclosure).toBeFocused();
  await expect(disclosure).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  await dropdown.getByRole("button", { name: "Arrancadores" }).click();
  const dialog = page.getByRole("dialog", { name: "Arrancadores" });
  await expect(dialog.getByRole("tab", { name: messages.es.serviceDetail.purchase })).toBeVisible();
  await expect(dialog.getByRole("tab", { name: messages.es.serviceDetail.repair })).toBeVisible();
  await expect(dropdown).toBeHidden();
  await expect(page.locator("a.whatsapp-bubble")).toBeHidden();
  await expect(page).not.toHaveURL(/#starters$/);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(disclosure).toBeFocused();
  await expect(page.locator("a.whatsapp-bubble")).toBeVisible();
  await expect(page.locator("html")).not.toHaveCSS("overflow-y", "hidden");
});

test("el carrusel muestra distintos ángulos y permite iniciar o pausar la rotación", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/es/");
  const copy = messages.es.home.hero.gallery;
  const gallery = page.getByRole("figure", { name: copy.label });
  const photo = gallery.getByRole("img");
  const play = gallery.getByRole("button", { name: copy.play, exact: true });
  const next = gallery.getByRole("button", { name: copy.next, exact: true });
  const previous = gallery.getByRole("button", { name: copy.previous, exact: true });

  await expect(photo).toHaveAccessibleName("Alternador Toyota / Lexus · Vista en ángulo");
  await expect(play).toBeVisible();
  await page.clock.fastForward(7000);
  await expect(photo).toHaveAccessibleName("Alternador Toyota / Lexus · Vista en ángulo");

  await next.click();
  await expect(photo).toHaveAccessibleName("Alternador Toyota / Lexus · Vista lateral");
  await previous.press("Enter");
  await expect(photo).toHaveAccessibleName("Alternador Toyota / Lexus · Vista en ángulo");
  await previous.press("Enter");
  await expect(photo).toHaveAccessibleName("Arrancador CAT/MIT · Vista lateral");
  await next.click();

  await play.click();
  await page.mouse.move(0, 0);
  const pause = gallery.getByRole("button", { name: copy.pause, exact: true });
  await expect(pause).toBeVisible();
  await page.clock.fastForward(7000);
  await expect(photo).toHaveAccessibleName("Alternador Toyota / Lexus · Vista lateral");
  await pause.click();
  await page.mouse.move(0, 0);
  await page.clock.fastForward(7000);
  await expect(photo).toHaveAccessibleName("Alternador Toyota / Lexus · Vista lateral");
});

test("la leyenda del mapa abre y cierra con el teclado", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es/#ubicacion");
  const disclosure = page.locator(".map-legend-disclosure");
  const toggle = disclosure.locator("summary");
  const legend = disclosure.getByRole("list", { name: messages.es.map.legend, includeHidden: true });
  await expect(toggle).toBeVisible();
  await toggle.scrollIntoViewIfNeeded();
  await expect(disclosure).toHaveJSProperty("open", false);
  await expect(legend).toBeHidden();

  await toggle.press("Enter");
  await expect(toggle).toBeFocused();
  await expect(disclosure).toHaveJSProperty("open", true);
  await expect(legend.getByText(messages.es.map.shopPin)).toBeVisible();
  await expect(legend.getByText(messages.es.map.property)).toBeVisible();
  await expect(legend.getByText(messages.es.map.access, { exact: true })).toBeVisible();

  await toggle.press("Space");
  await expect(disclosure).toHaveJSProperty("open", false);
  await expect(legend).toBeHidden();
});

test("la ortofoto carga y los controles cambian cámara y base sin recrear el mapa", async ({ page }) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  const imagery: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text() + " " + message.location().url); });
  page.on("response", (response) => {
    if (response.url().includes("/Ortofoto1k/wms") && response.ok() && response.headers()["content-type"]?.startsWith("image/")) {
      imagery.push(response.url());
    }
  });
  await page.goto("/#ubicacion");
  await expect.poll(async () => {
    const header = await page.getByRole("banner").boundingBox();
    const heading = await page.locator("#ubicacion h2").boundingBox();
    return !!(header && heading && heading.y >= header.y + header.height);
  }).toBeTruthy();
  const infoPanel = page.locator(".location-info");
  const mapShell = page.locator(".map-shell");
  await expect(mapShell.getByRole("button", { name: messages.es.views.oblique })).toBeVisible();
  await expect(infoPanel.locator("details[open]")).toHaveCount(0);
  await infoPanel.getByText(messages.es.map.contactHours, { exact: true }).click();
  await expect(infoPanel.locator('a[href="tel:+50689391999"]')).toBeVisible();
  await infoPanel.getByText(messages.es.map.contactHours, { exact: true }).click();

  const canvas = page.locator(".maplibregl-canvas");
  const turn = page.getByRole("button", { name: "Girar mapa" });
  await expect(turn).toBeVisible({ timeout: 15000 });
  await expect.poll(() => imagery.length).toBeGreaterThan(0);
  await expect(page.getByRole("link", { name: /IGN \/ Registro Nacional/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /OpenMapTiles/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /OpenStreetMap/ })).toBeVisible();
  const mapElement = await canvas.elementHandle();
  const renderBefore = await canvas.screenshot({ scale: "css" });
  await page.getByRole("button", { name: "Vista superior" }).click();
  await expect(page.getByRole("button", { name: "Vista superior" })).toHaveAttribute("aria-pressed", "true");
  await expect.poll(async () => !(await canvas.screenshot({ scale: "css" })).equals(renderBefore)).toBeTruthy();
  const beforeRotation = await canvas.screenshot({ scale: "css" });
  await turn.click();
  await expect.poll(async () => !(await canvas.screenshot({ scale: "css" })).equals(beforeRotation)).toBeTruthy();
  await page.getByRole("button", { name: "Vista 3D" }).click();
  await expect(page.getByRole("button", { name: "Vista 3D" })).toHaveAttribute("aria-pressed", "true");

  const beforeZoom = await canvas.screenshot({ scale: "css" });
  await page.getByRole("button", { name: "Acercar", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect.poll(async () => !(await canvas.screenshot({ scale: "css" })).equals(beforeZoom)).toBeTruthy();
  await page.getByRole("button", { name: "Alejar", exact: true }).click();
  await page.getByRole("button", { name: "Restablecer vista" }).click();
  await page.getByRole("button", { name: "Vista general" }).click();

  const marker = page.getByRole("button", { name: "Multicentro Río Segundo" });
  await expect(marker).toBeVisible();
  await marker.click();
  await expect(page.getByText("Multicentro Río Segundo · Referencia")).toBeVisible();
  await page.getByRole("button", { name: "Ocultar referencias" }).click();
  await expect(marker).toHaveCount(0);
  await page.getByRole("button", { name: "Mostrar referencias" }).click();
  await expect(marker).toBeVisible();

  await page.getByRole("button", { name: "Calles", exact: true }).click();
  await expect(page.getByRole("button", { name: "Calles", exact: true })).toHaveAttribute("aria-pressed", "true");
  expect(await canvas.evaluate((element, previous) => element === previous, mapElement)).toBe(true);
  const expand = page.getByRole("button", { name: "Ver mapa más grande" });
  await expand.click();
  await expect(page.getByRole("button", { name: "Reducir mapa" })).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: "Reducir mapa" }).click();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement)).toBeNull();
  await expect(expand).toBeVisible();
  await expect(page.getByRole("link", { name: "Abrir en Waze", exact: true }).locator("img")).toHaveAttribute("src", "/brands/waze.svg");
  await expect(page.getByRole("link", { name: "Abrir en Google Maps", exact: true }).locator("img")).toHaveAttribute("src", "/brands/google-maps.svg");
  await page.getByRole("button", { name: "Mostrar acceso" }).click();
  await expect(page.locator(".map-toolbar").getByRole("status")).toHaveText(messages.es.map.accessInstructions);
  const shop = page.getByRole("button", { name: business.name, exact: true });
  await shop.click();
  const information = page.getByRole("group", { name: "Información del taller" });
  await expect(information).toContainText(business.name);
  await expect(information.getByRole("link", { name: "Abrir esta ubicación en Waze" })).toHaveAttribute("href", businessLocation.wazeUrl);
  await information.getByRole("button", { name: "Cerrar información" }).click();
  await expect(shop).toBeFocused();
  await expect(page.getByRole("button", { name: "Mostrar entrada" })).toHaveCount(0);

  const viewport = page.viewportSize()!;
  if (viewport.width <= 767) {
    for (const width of [viewport.width, 600]) {
      await page.setViewportSize({ ...viewport, width });
      await expect.poll(() => page.evaluate(() => {
        if (document.fullscreenElement || !matchMedia("(max-width: 767px)").matches) return false;
        const map = document.querySelector(".map-canvas--3d")?.getBoundingClientRect();
        const caption = document.querySelector(".map-viewport .map-caption")?.getBoundingClientRect();
        const controls = document.querySelector(".map-viewport .map-controls")?.getBoundingClientRect();
        return !!(map && caption && controls && caption.bottom <= map.top + 1 && controls.top >= map.bottom - 1);
      })).toBeTruthy();
    }
  }
  expect(errors).toEqual([]);
});

async function disableWebGL(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (args[0] === "webgl2" || args[0] === "webgl") return null;
      return original.apply(this, args);
    } as typeof original;
  });
}

test("Leaflet y Waze siguen disponibles sin WebGL", async ({ page }) => {
  await disableWebGL(page);
  await page.goto("/#ubicacion");
  await expect(page.getByText(messages.es.map.webgl, { exact: true })).toBeVisible({ timeout: 12000 });
  await expect(page.locator(".leaflet-tile-loaded").first()).toBeVisible({ timeout: 12000 });
  await expect(page.locator("path.map-property-outline")).toBeVisible();
  await expect(page.locator("path.map-access-line")).toBeVisible();
  await page.getByRole("button", { name: "Mostrar acceso" }).click();
  await expect(page.locator(".map-toolbar").getByRole("status")).toHaveText(messages.es.map.accessInstructions);
  await expect(page.getByRole("link", { name: "Abrir en Waze" })).toHaveAttribute("href", businessLocation.wazeUrl);
});

test("el mapa de calles se recupera si las teselas llegan después del aviso", async ({ page }) => {
  await disableWebGL(page);
  let release = () => {};
  const waitForTiles = new Promise<void>((resolve) => { release = resolve; });
  await page.route(tilePattern, async (route) => {
    await waitForTiles;
    await route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#e5e8dd"/></svg>',
    });
  });
  try {
    await page.goto("/es/#ubicacion");
    const unavailable = page.getByText(messages.es.map.unavailable, { exact: true });
    await expect(unavailable).toBeVisible({ timeout: 15000 });
    release();
    await expect(page.locator(".leaflet-tile-loaded").first()).toBeVisible();
    await expect(unavailable).toBeHidden();
  } finally {
    release();
  }
});

test("la ortofoto avisa si fallan teselas nuevas de un mapa ya cargado", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es/#ubicacion");
  await expect(page.getByRole("button", { name: messages.es.views.oblique })).toBeEnabled({ timeout: 15000 });
  await page.route("https://geos1.snitcr.go.cr/**", (route) => route.fulfill({
    status: 503,
    headers: { "access-control-allow-origin": "*" },
    body: "Unavailable",
  }));
  const zoomOut = page.getByRole("button", { name: messages.es.map.zoomOut, exact: true });
  await Promise.all([
    page.waitForResponse((response) => response.url().includes("/Ortofoto1k/wms") && response.status() === 503),
    (async () => {
      for (let step = 0; step < 4; step += 1) await zoomOut.click();
    })(),
  ]);
  await expect(page.getByText(messages.es.map.partialTileFailure)).toBeVisible();
  await expect(page.getByRole("link", { name: messages.es.directions.waze, exact: true })).toBeVisible();
});

test("la caída del proveedor plano deja la dirección y permite reintentar", async ({ page }) => {
  await disableWebGL(page);
  await page.route(tilePattern, (route) => route.abort());
  await page.goto("/#ubicacion");
  await expect(page.getByText("El mapa no está disponible")).toBeVisible({ timeout: 12000 });
  await expect(page.getByRole("link", { name: "Ver calles en OpenStreetMap" })).toHaveAttribute("href", /openstreetmap.org.*map=17/);
  await expect(page.getByRole("link", { name: "Abrir en Waze" })).toHaveAttribute("href", businessLocation.wazeUrl);
  await page.unroute(tilePattern);
  await page.getByRole("button", { name: "Reintentar mapa" }).click();
  await expect(page.locator(".leaflet-tile-loaded").first()).toBeVisible({ timeout: 12000 });
});

test("si falla la imagen aérea se ofrece la cartografía de calles", async ({ page }) => {
  await page.route("https://geos1.snitcr.go.cr/**", (route) => route.abort());
  await page.goto("/#ubicacion");
  await expect(page.getByRole("link", { name: "Abrir en Waze" })).toBeVisible();
  const notice = page.getByText(/imagen aérea no está disponible|mapa 3D no pudo cargar/);
  await expect(notice).toBeVisible({ timeout: 18000 });
  await expect(page.getByRole("link", { name: /OpenStreetMap/ }).first()).toBeVisible();
});

test("la geolocalización solo se solicita tras activar el botón y respeta el permiso", async ({ page, context }) => {
  await context.setGeolocation({ latitude: 10, longitude: -84 });
  await context.grantPermissions(["geolocation"]);
  await page.addInitScript(() => {
    const original = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);
    navigator.geolocation.getCurrentPosition = (...args) => {
      const root = document.documentElement;
      root.dataset.geoRequests = String(Number(root.dataset.geoRequests ?? "0") + 1);
      return original(...args);
    };
  });
  await page.goto("/#ubicacion");
  await expect(page.locator("html")).not.toHaveAttribute("data-geo-requests");
  await page.getByRole("button", { name: "Cómo llegar desde mi ubicación" }).click();
  await expect(page.getByRole("link", { name: "Ver ruta en Google Maps" })).toHaveAttribute("href", googleDirectionsUrl([10, -84])!);
  await expect(page.locator("html")).toHaveAttribute("data-geo-requests", "1");
});

test("sin permiso se puede elegir origen manualmente", async ({ page }) => {
  await page.addInitScript(() => {
    navigator.geolocation.getCurrentPosition = (_success, error) => {
      error?.({ code: 1, message: "Permiso rechazado", PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 });
    };
  });
  await page.goto("/#ubicacion");
  await page.getByRole("button", { name: "Cómo llegar desde mi ubicación" }).click();
  await expect(page.getByText(/Podés elegir el punto de partida manualmente/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Abrir en Waze" })).toBeVisible();
});

test.describe("contacto sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("mantiene disponible el chat directo y deshabilita el envío nativo", async ({ page }) => {
    await page.goto("/es/#contacto");
    const contact = page.locator("#contacto");
    await expect(contact.getByText(messages.es.form.directContact, { exact: true })).toBeVisible();
    await expect(contact.getByRole("button", { name: messages.es.form.submit })).toBeDisabled();
    await expect(contact.getByRole("link", { name: "WhatsApp 8939-1999" })).toHaveAttribute("href", /^https:\/\/wa\.me\/50689391999/);
  });
});

test("el formulario arma mensajes de compra y reparación y omite campos vacíos", async ({ page }) => {
  await page.addInitScript(() => {
    window.open = (url) => {
      document.documentElement.dataset.waUrl = String(url);
      return null;
    };
  });
  await page.goto("/#contacto");
  const contact = page.locator("#contacto");
  await expect(contact.getByText(messages.es.form.requiredFields)).toBeVisible();
  await contact.locator(".contact-form").evaluate((form) => {
    window.scrollBy(0, form.getBoundingClientRect().top - window.innerHeight + 60);
  });
  await expect(page.locator(".whatsapp-bubble")).toBeHidden();
  await expect(page.locator(".header-whatsapp")).toBeVisible();
  const viewport = page.viewportSize()!;
  if (viewport.width < 768) {
    await page.setViewportSize({ ...viewport, width: 480 });
    await expect(contact.locator(".fields")).toHaveCSS("grid-template-columns", /^\d+(\.\d+)?px$/);
  }
  const contactMethods = contact.locator(".contact-phones");
  await expect(contactMethods.getByRole("link")).toHaveCount(3);
  const mainChat = contactMethods.getByRole("link", { name: "WhatsApp 8939-1999", exact: true });
  const secondaryChat = contactMethods.getByRole("link", { name: "WhatsApp 8392-7096", exact: true });
  await expect(mainChat).toHaveAttribute("href", /^https:\/\/wa\.me\/50689391999\?/);
  await expect(secondaryChat).toHaveAttribute("href", /^https:\/\/wa\.me\/50683927096\?/);
  await expect(contactMethods.locator('.contact-method-icon img[src="/brands/whatsapp.webp"]')).toHaveCount(2);
  await expect(contactMethods.locator(".contact-method-icon svg")).toHaveCount(1);
  const alignment = await contact.locator(".contact-phones > .contact-method").evaluateAll((cards) => cards.map((card) => {
    const icon = card.querySelector(".contact-method-icon")!.getBoundingClientRect();
    const text = card.querySelector(".contact-method-main")!.getBoundingClientRect();
    const frame = card.getBoundingClientRect();
    return { width: frame.width, height: frame.height, iconOnLeft: icon.right <= text.left };
  }));
  expect(alignment).toHaveLength(3);
  expect(alignment).toEqual(Array(3).fill({ ...alignment[0], iconOnLeft: true }));
  await expect(contactMethods.getByRole("link", { name: "Teléfono fijo 2440-2131", exact: true })).toHaveAttribute("href", "tel:+50624402131");
  const name = page.getByLabel("Nombre", { exact: true });
  const intent = page.getByLabel("Compra o reparación");
  const component = page.getByLabel("Componente");
  const submit = page.getByRole("button", { name: "Continuar a WhatsApp" });
  await name.fill("   ");
  await intent.selectOption({ label: "Reparación" });
  await component.selectOption({ label: "Arrancador" });
  await submit.click();
  await expect(page.locator("html")).not.toHaveAttribute("data-wa-url");
  await name.fill("Ana Pérez");
  await page.getByLabel("Marca del vehículo").fill("Toyota");
  await page.getByLabel("Modelo", { exact: true }).fill("Corolla");
  await page.getByLabel("Año", { exact: true }).fill("2016");
  await page.getByLabel("Detalles adicionales").fill("El motor no gira.");
  await submit.click();
  const repair = new URL((await page.locator("html").getAttribute("data-wa-url"))!);
  expect(repair.origin + repair.pathname).toBe("https://wa.me/50689391999");
  const repairMessage = repair.searchParams.get("text");
  expect(repairMessage).toContain("Mi nombre es Ana Pérez.");
  expect(repairMessage).toContain("Quisiera consultar por la reparación de un arrancador.");
  expect(repairMessage).toContain("Datos del vehículo:\n- Marca: Toyota\n- Modelo: Corolla\n- Año: 2016");
  expect(repairMessage).toContain("Detalles:\nEl motor no gira.");

  await intent.selectOption({ label: "Compra" });
  await component.selectOption({ label: "Alternador" });
  await page.getByLabel("Marca del vehículo").clear();
  await page.getByLabel("Modelo", { exact: true }).clear();
  await page.getByLabel("Año", { exact: true }).clear();
  await page.getByLabel("Detalles adicionales").clear();
  await submit.click();
  const purchase = new URL((await page.locator("html").getAttribute("data-wa-url"))!);
  expect(purchase.searchParams.get("text")).toContain("la compra de un alternador");
  expect(purchase.searchParams.get("text")).not.toMatch(/Datos del vehículo|Detalles:|undefined|null/);

  const plate = contact.getByLabel(messages.es.form.plate, { exact: true });
  await expect(plate).toHaveAccessibleDescription(messages.es.form.plateHelp);
  await plate.fill("  ABC123  ");
  await submit.click();
  const plateMessage = new URL((await page.locator("html").getAttribute("data-wa-url"))!).searchParams.get("text");
  expect(plateMessage).toContain("la compra de un alternador");
  expect(plateMessage).toContain("Datos del vehículo:\n- Placa: ABC123");
  expect(plateMessage).not.toMatch(/Marca:|Modelo:|Año:|undefined|null/);
});

test("la máscara GeoJSON usa los vértices del predio como anillo interior", () => {
  const mask = propertyFocusMask(businessLocation.propertyOutline);
  expect(mask?.coordinates).toHaveLength(2);
  const [exterior, interior] = mask!.coordinates;
  const original = businessLocation.propertyOutline.map(lngLat);
  expect(interior).toHaveLength(original.length);
  for (const vertex of original) expect(interior).toContainEqual(vertex);
  expect(propertyFocusMask([...businessLocation.propertyOutline].reverse())?.coordinates[1]).toEqual(interior);
  expect(exterior.at(-1)).toEqual(exterior[0]);
  expect(interior.at(-1)).toEqual(interior[0]);
  expect(propertyFocusMask([])).toBeNull();
});

test("Google Maps requiere destino y prioriza la entrada verificada", () => {
  const noDestination = { ...businessLocation, coordinates: null, entranceCoordinates: null, googleMapsPlaceId: null };
  expect(googleDirectionsUrl(undefined, noDestination)).toBeNull();
  expect(new URL(googleDirectionsUrl()!).searchParams.get("destination")).toBe(businessLocation.coordinates!.join(","));
  const location = { ...businessLocation, coordinates: [10, -84] as const, googleMapsPlaceId: "fixture" };
  const shop = new URL(googleDirectionsUrl(undefined, location)!);
  expect(shop.searchParams.get("destination_place_id")).toBe("fixture");
  const entrance = new URL(googleDirectionsUrl([9, -83], { ...location, entranceCoordinates: [10.1, -84.1] })!);
  expect(entrance.searchParams.get("destination")).toBe("10.1,-84.1");
  expect(entrance.searchParams.get("origin")).toBe("9,-83");
  expect(entrance.searchParams.has("destination_place_id")).toBe(false);
});

test("verificación automatizada WCAG en la página con el mapa visible", async ({ page }) => {
  await page.goto("/#ubicacion");
  await expect(page.getByRole("button", { name: "Girar mapa" })).toBeVisible({ timeout: 15000 });
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(audit.violations).toEqual([]);
});
