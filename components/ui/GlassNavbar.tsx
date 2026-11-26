import type { ReactNode } from "react";
import { GlassPanel } from "./GlassPanel";

export function GlassNavbar({ children }: { children: ReactNode }) {
  return (
    <header className="site-header">
      <div className="wrap header-frame">
        <GlassPanel variant="floating" className="header-glass" aria-hidden="true" />
        {children}
      </div>
    </header>
  );
}
