"use client";

import { usePreferences } from "@/components/Preferences";
import { Pause, Play, RotateCcw, X } from "lucide-react";
import { AppIcon } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";

export function RouteControls({ playing, started, onPlay, onPause, onRestart, onExit }: {
  playing: boolean; started: boolean; onPlay: () => void; onPause: () => void;
  onRestart: () => void; onExit: () => void;
}) {
  const { t } = usePreferences();
  const copy = t.map;
  return (
    <div className="map-route-controls" role="group" aria-label={copy.route}>
      <Button variant="secondary" onClick={playing ? onPause : onPlay}>
        {playing ? <AppIcon icon={Pause} /> : <AppIcon icon={Play} />}
        {playing ? copy.pause : copy.play}
      </Button>
      {started && (
        <>
          <Button variant="quiet" onClick={onRestart}><AppIcon icon={RotateCcw} /> {copy.restart}</Button>
          <Button variant="quiet" onClick={onExit}><AppIcon icon={X} /> {copy.exit}</Button>
        </>
      )}
    </div>
  );
}
