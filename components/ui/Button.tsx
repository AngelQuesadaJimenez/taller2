import type { ComponentPropsWithRef } from "react";

export type GlassButtonVariant = "primary" | "whatsapp" | "secondary" | "ghost" | "glass" | "outline" | "quiet";
export type ButtonSize = "small" | "medium" | "large" | "icon";

type Props = (
  | (ComponentPropsWithRef<"a"> & { href: string; loading?: never })
  | (ComponentPropsWithRef<"button"> & { href?: never; loading?: boolean })
) & { variant?: GlassButtonVariant; size?: ButtonSize };

export function GlassButton({ variant = "primary", size = "medium", className = "", ...props }: Props) {
  const style = variant === "quiet" ? "ghost" : variant;
  const classes = ["button", "button--" + style, "button--size-" + size, className].join(" ");
  if (props.href !== undefined) return <a {...props} className={classes} />;

  const { loading, disabled, ...buttonProps } = props;
  return (
    <button type="button" {...buttonProps} className={classes}
      disabled={disabled || loading} aria-busy={loading || buttonProps["aria-busy"]} />
  );
}

export { GlassButton as Button };
