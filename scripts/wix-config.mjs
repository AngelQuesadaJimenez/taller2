import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

const { WIX_APP_ID, WIX_SITE_ID, WIX_API_KEY, SITE_SMOKE_URL } = process.env;
assert.match(WIX_APP_ID ?? "", /^[0-9a-f-]{36}$/i, "Configura WIX_APP_ID en el Environment wix-production.");
assert.match(WIX_SITE_ID ?? "", /^[0-9a-f-]{36}$/i, "Configura WIX_SITE_ID en el Environment wix-production.");
assert.ok(WIX_API_KEY?.trim(), "Configura WIX_API_KEY como secreto del Environment wix-production.");
const site = new URL(SITE_SMOKE_URL ?? "");
assert.equal(site.protocol, "https:");
assert.equal(site.pathname, "/");
assert.ok(!site.username && !site.password && !site.search && !site.hash);

await writeFile("wix.config.json", JSON.stringify({
  projectType: "Site",
  appId: WIX_APP_ID,
  siteId: WIX_SITE_ID,
  site: { outputDirectory: "./out" },
}));
