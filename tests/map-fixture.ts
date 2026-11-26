import { test as base } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const cors = { "access-control-allow-origin": "*" };
// Empty MVT layer named like the production layer, version 2.
const labels = Buffer.from([0x1a, 0x17, 0x0a, 0x13, ...new TextEncoder().encode("transportation_name"), 0x78, 0x02]);

export const test = base.extend<{ mapTiles: void }>({
  mapTiles: [async ({ context }, run) => {
    const raster = await readFile(resolve("tests/fixtures/map-tile.png"));
    await context.route(/^https:\/\/(?:geos1\.snitcr\.go\.cr|tile\.openstreetmap\.org)\//, (route) => {
      return route.fulfill({ headers: cors, contentType: "image/png", body: raster });
    });
    await context.route("https://tiles.openfreemap.org/**", (route) => {
      if (route.request().url().endsWith(".pbf")) {
        return route.fulfill({ headers: cors, contentType: "application/x-protobuf", body: labels });
      }
      return route.fulfill({
        headers: cors,
        json: {
          tilejson: "2.2.0",
          tiles: ["https://tiles.openfreemap.org/test/{z}/{x}/{y}.pbf"],
          minzoom: 0,
          maxzoom: 18,
          vector_layers: [{ id: "transportation_name", fields: {} }],
        },
      });
    });
    await run();
  }, { auto: true }],
});

export { expect } from "@playwright/test";
