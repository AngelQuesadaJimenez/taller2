import assert from "node:assert/strict";
import { setTimeout } from "node:timers/promises";

const base = new URL(process.env.SITE_SMOKE_URL ?? "http://127.0.0.1:4317");
const revision = process.env.GITHUB_SHA;
const revisionOnly = process.argv.includes("--revision-only");
const configure = (pathname) => new URL(pathname, base);

async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(10000), cache: "no-store" });
  assert.ok(response.ok, `${url.pathname} respondió con HTTP ${response.status}`);
  return response;
}

async function checkRevision() {
  if (!revision) return;
  const marker = configure("/release.txt");
  marker.searchParams.set("revision", revision);
  assert.equal((await (await get(marker)).text()).trim(), revision, "La revisión publicada todavía no coincide.");
}

async function smoke() {
  await checkRevision();
  if (revisionOnly) return;

  const page = await get(configure("/es/"));
  const html = await page.text();
  for (const id of ["inicio", "servicios", "contacto"]) {
    assert.ok(html.includes(`id="${id}"`), `Falta la sección ${id}.`);
  }
  assert.ok(html.includes("https://wa.me/50689391999?"), "Falta el enlace de contacto del taller.");

  const styles = html.match(/href="([^"]+\.css)"/)?.[1];
  const bundle = html.match(/src="([^"]+\.js)"/)?.[1];
  assert.ok(styles && bundle, "Faltan los recursos de la compilación.");
  for (const [asset, mime] of [[styles, "text/css"], [bundle, "javascript"]]) {
    const url = configure(asset);
    assert.equal(url.origin, base.origin);
    const response = await get(url);
    assert.ok(response.headers.get("content-type")?.includes(mime), `El contenido de ${url.pathname} no es ${mime}.`);
  }
}

const attempts = revision && !revisionOnly ? 12 : 1;
for (let attempt = 1; attempt <= attempts; attempt++) {
  try {
    await smoke();
    console.log(revisionOnly ? "Revisión publicada." : "Página, secciones, contacto y recursos verificados.");
    break;
  } catch (error) {
    if (attempt === attempts) throw error;
    await setTimeout(5000);
  }
}
