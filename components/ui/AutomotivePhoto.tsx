"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePreferences } from "@/components/Preferences";
import type { PhotoAsset } from "@/data/photos";
import { AppIcon } from "./AppIcon";
import { Skeleton } from "./Skeleton";

const imageTimeout = 15000;

export function AutomotivePhoto({ photo, sizes, priority = false }: {
  photo: PhotoAsset & { alt: string };
  sizes: string;
  priority?: boolean;
}) {
  const { t } = usePreferences();
  const frame = useRef<HTMLDivElement>(null);
  const [outcome, setOutcome] = useState<{ src: string; status: "loaded" | "failed" } | null>(null);
  const status = outcome?.src === photo.src ? outcome.status : "pending";

  useEffect(() => {
    const element = frame.current;
    if (!element || status !== "pending") return;
    let timer: number | undefined;
    const expire = () => {
      timer = window.setTimeout(() => setOutcome({ src: photo.src, status: "failed" }), imageTimeout);
    };

    let observer: IntersectionObserver | undefined;
    if (priority || !("IntersectionObserver" in window)) {
      expire();
    } else {
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        observer?.disconnect();
        expire();
      }, { rootMargin: "160px" });
      observer.observe(element);
    }
    return () => {
      observer?.disconnect();
      window.clearTimeout(timer);
    };
  }, [photo.src, priority, status]);

  return (
    <div ref={frame} className="photo-frame" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
      {status === "failed" ? (
        <div className="photo-fallback" role="img" aria-label={photo.alt + " · " + t.media.unavailable}>
          <AppIcon icon={ImageOff} size="large" /><span>{t.media.unavailable}</span>
        </div>
      ) : (
        <picture className="automotive-photo">
          {photo.avifSrcSet && <source type="image/avif" srcSet={photo.avifSrcSet} sizes={sizes} />}
          <source type="image/webp" srcSet={photo.srcSet} sizes={sizes} />
          <Image key={photo.src} unoptimized src={photo.src} alt={photo.alt} width={photo.width} height={photo.height}
            loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined}
            onLoad={() => setOutcome({ src: photo.src, status: "loaded" })}
            onError={() => setOutcome({ src: photo.src, status: "failed" })} />
        </picture>
      )}
      {status === "pending" && !priority && <Skeleton className="photo-skeleton" />}
    </div>
  );
}
