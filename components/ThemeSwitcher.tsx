"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { AppIcon } from "./ui/AppIcon";
import { usePreferences } from "./Preferences";

const darkQuery = "(prefers-color-scheme: dark)";
const systemIsDark = () => window.matchMedia(darkQuery).matches;
const serverIsDark = () => true;

function subscribeToSystem(notify: () => void) {
  const media = window.matchMedia(darkQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}

export function ThemeSwitcher() {
  const { theme, setTheme, t } = usePreferences();
  const systemDark = useSyncExternalStore(subscribeToSystem, systemIsDark, serverIsDark);
  const dark = theme === "system" ? systemDark : theme === "dark";
  const label = dark ? t.common.switchLight : t.common.switchDark;

  return (
    <button type="button" className="preference-choice" data-preference="theme" aria-label={label} title={label}
      onClick={() => setTheme(getComputedStyle(document.documentElement).colorScheme === "dark" ? "light" : "dark")}>
      <AppIcon icon={dark ? Sun : Moon} />
    </button>
  );
}
