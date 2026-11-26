"use client";

import { usePreferences } from "@/components/Preferences";
import type { ReactNode } from "react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { GlassButton, type GlassButtonVariant } from "@/components/ui/Button";
import { waLink } from "@/lib/whatsapp";

export function WhatsAppCTA({ children = "WhatsApp", variant = "whatsapp", className, ariaLabel }: {
  children?: ReactNode;
  variant?: GlassButtonVariant;
  className?: string;
  ariaLabel?: string;
}) {
  const { locale } = usePreferences();
  return (
    <GlassButton href={waLink(undefined, locale)} target="_blank" rel="noopener noreferrer" variant={variant}
      className={className} aria-label={ariaLabel}>
      <BrandIcon brand={variant === "whatsapp" || variant === "primary" ? "whatsappFilled" : "whatsapp"} />
      {children}
    </GlassButton>
  );
}
