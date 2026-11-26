import { createLucideIcon } from "lucide-react";

export const AlternatorIcon = createLucideIcon("Alternator", [
  ["circle", { cx: "12", cy: "12", r: "7", key: "housing" }],
  ["circle", { cx: "12", cy: "12", r: "2.6", key: "pulley" }],
  ["path", { d: "M6.5 6.7 5 4.8 8 3l2.1 2.2M16.8 17l2 2-3 2.2-2.1-2.3", key: "mounts" }],
  ["path", { d: "M12 7.3v1.1m4.7 3.6h-1.1M12 16.7v-1.1M7.3 12h1.1", key: "vents" }],
]);

export const StarterIcon = createLucideIcon("Starter", [
  ["rect", { x: "4", y: "10", width: "13", height: "8", rx: "3", key: "motor" }],
  ["path", { d: "M8 10V7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v3M12 6V4h3m-7 9v2m9-3h4v5h-4m4-4h1m-1 3h1M4 13H2v3h2", key: "solenoid-and-drive" }],
]);
