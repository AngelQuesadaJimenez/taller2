"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePreferences } from "@/components/Preferences";
import { AppIcon } from "@/components/ui/AppIcon";
import { AutomotivePhoto } from "@/components/ui/AutomotivePhoto";
import { GlassButton } from "@/components/ui/Button";
import { heroPhotos } from "@/data/photos";

const interval = 6500;
const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToMotion(notify: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}

const prefersReducedMotion = () => window.matchMedia(motionQuery).matches;
const deferRotationUntilHydrated = () => true;

export function HeroGallery() {
  const { t } = usePreferences();
  const copy = t.home.hero.gallery;
  const [index, setIndex] = useState(0);
  const [rotation, setRotation] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeToMotion, prefersReducedMotion, deferRotationUntilHydrated);
  const rotating = rotation ?? !reducedMotion;
  const autoAdvance = rotating && !hovered;

  useEffect(() => {
    if (!autoAdvance) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % heroPhotos.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [autoAdvance]);

  function changePhoto(step: number) {
    setRotation(false);
    setIndex((current) => (current + step + heroPhotos.length) % heroPhotos.length);
  }

  const { asset, product, angle } = heroPhotos[index];
  const title = t.catalog.titles[product];
  const view = copy.angles[angle];
  const rotationLabel = rotating ? copy.pause : copy.play;

  return (
    <figure className="hero-visual" aria-label={copy.label}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") setHovered(false); }}
      onFocusCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget) && !event.target.hasAttribute("data-rotation-control")) {
          setRotation(false);
        }
      }}>
      <AutomotivePhoto photo={{ ...asset, alt: title + " · " + view }}
        sizes="(max-width: 767px) 94vw, (max-width: 1279px) 46vw, 575px" priority={index === 0} />
      <figcaption className="hero-gallery-bar">
        <span className="hero-gallery-caption" aria-live={autoAdvance ? "off" : "polite"} aria-atomic="true">
          <strong>{title}</strong>
          <span>{view} · {index + 1}/{heroPhotos.length}</span>
        </span>
        <span className="hero-gallery-controls">
          <GlassButton variant="glass" aria-label={rotationLabel} title={rotationLabel} data-rotation-control
            onClick={() => setRotation(!rotating)}><AppIcon icon={rotating ? Pause : Play} /></GlassButton>
          <GlassButton variant="glass" aria-label={copy.previous} title={copy.previous} onClick={() => changePhoto(-1)}>
            <AppIcon icon={ChevronLeft} />
          </GlassButton>
          <GlassButton variant="glass" aria-label={copy.next} title={copy.next} onClick={() => changePhoto(1)}>
            <AppIcon icon={ChevronRight} />
          </GlassButton>
        </span>
      </figcaption>
    </figure>
  );
}
