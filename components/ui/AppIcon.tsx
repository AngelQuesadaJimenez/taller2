import type { LucideIcon } from "lucide-react";

export function AppIcon({ icon: Icon, size = "regular", className = "" }: {
  icon: LucideIcon;
  size?: "small" | "regular" | "large";
  className?: string;
}) {
  return <Icon className={["app-icon", "app-icon--" + size, className].join(" ")} strokeWidth={2} aria-hidden="true" />;
}
