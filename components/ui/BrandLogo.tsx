import type { CSSProperties } from "react";
import { business } from "@/data/business.config";

const mark = { src: "/brands/rs-silueta-dorado.png", width: 704, height: 92 };

export function BrandLogo({ variant = "horizontal", size = "medium", name = business.name }: {
  variant?: "horizontal" | "compact";
  size?: "small" | "medium" | "large";
  name?: string;
}) {
  const style = {
    "--brand-image": `url("${mark.src}")`,
    aspectRatio: `${mark.width} / ${mark.height}`,
  } as CSSProperties;

  return (
    <span className={`brand-logo brand-logo--${variant} brand-logo--${size}`}>
      <span className="brand-isotype" aria-hidden="true" style={style} />
      {variant === "horizontal" && <span className="brand-name" lang="es-CR">{name}</span>}
    </span>
  );
}
