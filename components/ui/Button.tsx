import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

export type GlassButtonVariant = "primary" | "whatsapp" | "secondary" | "ghost" | "glass" | "outline" | "quiet";

type Props = (
  | (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: never })
) & { variant?: GlassButtonVariant };

export function GlassButton({ variant = "primary", className = "", ...props }: Props) {
  const style = variant === "quiet" ? "ghost" : variant;
  const classes = ["button", "button--" + style, className].join(" ");
  if (props.href !== undefined) return <a {...props} className={classes} />;
  return <button type="button" {...props} className={classes} />;
}

export { GlassButton as Button };
