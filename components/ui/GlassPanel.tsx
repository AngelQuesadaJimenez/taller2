import type { HTMLAttributes } from "react";

export type GlassVariant = "default" | "elevated" | "subtle" | "interactive" | "floating";

type Props = HTMLAttributes<HTMLElement> & {
  as?: "div" | "article" | "aside" | "nav";
  variant?: GlassVariant;
};

export function GlassPanel({ as: Element = "div", variant = "default", className = "", ...props }: Props) {
  return <Element {...props} className={["glass-panel", "glass-panel--" + variant, className].join(" ")} />;
}
