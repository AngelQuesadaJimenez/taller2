import { execFile } from "node:child_process";
import { createServer, type RequestListener } from "node:http";
import type { AddressInfo } from "node:net";
import { promisify } from "node:util";
import { expect, test } from "@playwright/test";

const exec = promisify(execFile);
const candidate = "a".repeat(40);

async function withServer(handler: RequestListener, run: (url: string) => Promise<void>) {
  const server = createServer(handler);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    await run("http://127.0.0.1:" + (server.address() as AddressInfo).port);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

function smoke(url: string, sha: string, ...args: string[]) {
  return exec(process.execPath, ["scripts/smoke.mjs", ...args], {
    env: { ...process.env, SITE_SMOKE_URL: url, GITHUB_SHA: sha },
    timeout: 15000,
  });
}

test("preflight solo habilita publicar un 404 o un SHA anterior válido", async () => {
  for (const [status, body, state] of [
    [200, candidate + "\n", "current"], [404, "Not found", "missing"], [200, "b".repeat(40), "outdated"],
  ] as const) {
    await withServer((req, res) => {
      expect(req.url).toBe("/release.txt?revision=" + candidate);
      res.writeHead(status).end(body);
    }, async (url) => {
      const result = await smoke(url, candidate, "--revision-only");
      expect(result.stdout.trim()).toBe(state);
    });
  }
});

test("preflight aborta ante HTTP ambiguo, red interrumpida, redirección, HTML o SHA ausente", async () => {
  for (const status of [401, 403, 500, 302, 200, 0]) {
    await withServer((_req, res) => {
      if (!status) { res.destroy(); return; }
      res.writeHead(status, status === 302 ? { location: "/login" } : {}).end("<html>Cuenta</html>");
    }, async (url) => {
      await expect(smoke(url, candidate, "--revision-only")).rejects.toMatchObject({ code: 1, stdout: "" });
    });
  }
  await withServer((_req, res) => res.writeHead(404).end(), async (url) => {
    await expect(smoke(url, "", "--revision-only")).rejects.toMatchObject({ code: 1, stdout: "" });
  });
});

test("el smoke posterior revisa las dos portadas y detecta un idioma servido en la ruta incorrecta", async () => {
  const visited = new Set<string>();
  let incorrectLanguage = false;
  await withServer((req, res) => {
    const path = req.url;
    if (path === "/es/" || path === "/en/") {
      visited.add(path);
      const lang = (path === "/es/" || incorrectLanguage) ? "es-CR" : "en-US";
      res.writeHead(200, { "content-type": "text/html" }).end(
        `<html lang="${lang}"><link href="/app.css"><script src="/app.js"></script><a href="https://wa.me/50689391999?text=Hola">WhatsApp</a><main id="inicio"><section id="servicios"></section><section id="contacto"></section></main></html>`,
      );
    } else if (path === "/app.css" || path === "/app.js") {
      res.writeHead(200, { "content-type": path.endsWith(".css") ? "text/css" : "text/javascript" }).end();
    } else {
      res.writeHead(404).end();
    }
  }, async (url) => {
    await smoke(url, "");
    expect(visited).toEqual(new Set(["/es/", "/en/"]));
    incorrectLanguage = true;
    await expect(smoke(url, "")).rejects.toMatchObject({ code: 1 });
  });
});
