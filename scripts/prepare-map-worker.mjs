import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const distribution = dirname(fileURLToPath(import.meta.resolve("maplibre-gl")));
const destination = fileURLToPath(new URL("../public/maplibre/", import.meta.url));

await mkdir(destination, { recursive: true });
await Promise.all([
  copyFile(join(distribution, "maplibre-gl-worker.mjs"), join(destination, "maplibre-gl-worker.js")),
  copyFile(join(distribution, "../LICENSE.txt"), join(destination, "LICENSE.txt")),
]);
