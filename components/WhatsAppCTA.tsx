"use client";

import { usePreferences } from "@/components/Preferences";
import type { ReactNode } from "react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { GlassButton, type ButtonSize, type GlassButtonVariant } from "@/components/ui/Button";
import { waLink } from "@/lib/whatsapp";

export function WhatsAppCTA({ children = "WhatsApp", variant = "whatsapp", size, className, ariaLabel }: {
  children?: ReactNode;
  variant?: GlassButtonVariant;
  size?: ButtonSize;
  className?: string;
  ariaLabel?: string;
}) {
  const { locale } = usePreferences();
  return (
    <GlassButton href={waLink(undefined, locale)} target="_blank" rel="noopener noreferrer" variant={variant}
      size={size} className={className} aria-label={ariaLabel}>
      <BrandIcon brand={variant === "whatsapp" || variant === "primary" ? "whatsappFilled" : "whatsapp"} />
      {children}
    </GlassButton>
  );
}
