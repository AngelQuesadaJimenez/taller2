import assert from "node:assert/strict";
import { setTimeout } from "node:timers/promises";

const base = new URL(process.env.SITE_SMOKE_URL ?? "http://127.0.0.1:4317");
const revision = process.env.GITHUB_SHA;
const revisionOnly = process.argv.includes("--revision-only");
const gitSha = /^[0-9a-f]{40}$/;
const configure = (pathname) => new URL(pathname, base);

async function request(url) {
  return fetch(url, { signal: AbortSignal.timeout(10000), cache: "no-store", redirect: "error" });
}

async function get(url) {
  const response = await request(url);
  assert.ok(response.ok, `${url.pathname} respondió con HTTP ${response.status}`);
  return response;
}

async function revisionState() {
  assert.ok(gitSha.test(revision ?? ""), "Falta un SHA de Git válido para comprobar la revisión.");
  const marker = configure("/release.txt");
  marker.searchParams.set("revision", revision);
  const response = await request(marker);
  if (response.status === 404) return "missing";

  assert.equal(response.status, 200, `El marcador respondió con HTTP ${response.status}.`);
  const published = (await response.text()).trim();
  assert.ok(gitSha.test(published), "El marcador publicado no contiene un SHA de Git válido.");
  return published === revision ? "current" : "outdated";
}

async function smokePage(locale, lang) {
  const page = await get(configure(`/${locale}/`));
  const html = await page.text();
  assert.equal(html.match(/<html\b[^>]*\blang="([^"]+)"/i)?.[1], lang, `Idioma incorrecto en /${locale}/.`);
  for (const id of ["inicio", "servicios", "contacto"]) {
    assert.ok(html.includes(`id="${id}"`), `Falta la sección ${id} en /${locale}/.`);
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

if (revisionOnly) {
  console.log(await revisionState());
} else {
  const attempts = revision ? 12 : 1;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      if (revision) assert.equal(await revisionState(), "current", "La revisión publicada todavía no coincide.");
      await Promise.all([smokePage("es", "es-CR"), smokePage("en", "en-US")]);
      console.log("Portadas ES/EN, secciones, contacto y recursos verificados.");
      break;
    } catch (error) {
      if (attempt === attempts) throw error;
      await setTimeout(5000);
    }
  }
}
