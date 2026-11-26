import type { ReactNode } from "react";
import { GlassPanel } from "./GlassPanel";

export function GlassInfoBadge({ icon, title, detail, className = "" }: {
  icon: ReactNode; title: string; detail?: string; className?: string;
}) {
  return (
    <GlassPanel variant="subtle" className={"glass-info-badge " + className}>
      {icon}
      <div><strong>{title}</strong>{detail && <span>{detail}</span>}</div>
    </GlassPanel>
  );
}
