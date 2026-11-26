import type { ComponentPropsWithoutRef } from "react";

export function GlassSection({ variant = "plain", className = "", ...props }: ComponentPropsWithoutRef<"section"> & {
  variant?: "plain" | "band" | "feature";
}) {
  return <section {...props} className={["section", "glass-section--" + variant, className].join(" ")} />;
}
