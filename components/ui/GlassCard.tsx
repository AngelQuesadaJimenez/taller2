import type { ReactNode } from "react";
import { GlassPanel, type GlassVariant } from "./GlassPanel";

export function GlassCard({ id, title, description, icon, image, action, eyebrow, heading: Heading = "h3", variant = "interactive", className = "" }: {
  id?: string;
  title: string;
  description: string;
  icon?: ReactNode;
  image?: ReactNode;
  action?: ReactNode;
  eyebrow?: string;
  heading?: "h3" | "h4";
  variant?: GlassVariant;
  className?: string;
}) {
  return (
    <GlassPanel as="article" id={id} variant={variant} className={"glass-card " + className}>
      {image && (
        <div className="glass-card-media">
          {image}
          {icon && <span className="glass-card-emblem" aria-hidden="true">{icon}</span>}
        </div>
      )}
      <div className="glass-card-copy">
        {eyebrow && <span className="glass-card-eyebrow">{eyebrow}</span>}
        <div className="glass-card-title">
          {!image && icon}
          <Heading>{title}</Heading>
        </div>
        <p>{description}</p>
        {action}
      </div>
    </GlassPanel>
  );
}
