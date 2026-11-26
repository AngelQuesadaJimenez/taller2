"use client";

import { useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { usePreferences } from "@/components/Preferences";
import { AppIcon } from "@/components/ui/AppIcon";
import { AutomotivePhoto } from "@/components/ui/AutomotivePhoto";
import { GlassButton } from "@/components/ui/Button";
import type { CatalogProduct } from "@/data/catalog";

export function ProductDetail({ product }: { product: CatalogProduct }) {
  const { t } = usePreferences();
  const { catalog } = t;
  const title = catalog.titles[product.id];
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const { asset, angle } = product.images[selected];

  return (
    <div className={"product-detail" + (zoomed ? " product-detail--zoomed" : "")}>
      <div className="product-gallery">
        <div className="product-gallery-photo">
          <AutomotivePhoto photo={{ ...asset, alt: title + " · " + catalog.angle[angle] }} sizes={zoomed ? "(max-width: 767px) 90vw, 480px" : "(max-width: 767px) 90vw, 340px"} />
          <GlassButton className="product-zoom" variant="glass" size="icon" aria-pressed={zoomed}
            aria-label={zoomed ? catalog.zoomOut : catalog.zoomIn} onClick={() => setZoomed(!zoomed)}>
            <AppIcon icon={zoomed ? ZoomOut : ZoomIn} />
          </GlassButton>
        </div>
        <div className="product-thumbnails" role="group" aria-label={catalog.gallery}>
          {product.images.map((image, index) => (
            <GlassButton key={image.angle} variant="glass" aria-label={catalog.angle[image.angle]} aria-pressed={index === selected}
              onClick={() => setSelected(index)}>
              <AutomotivePhoto photo={{ ...image.asset, alt: catalog.angle[image.angle] }} sizes="72px" />
            </GlassButton>
          ))}
        </div>
      </div>
      <div className="product-specifications">
        <h3>{catalog.details}</h3>
        <dl>
          {product.details.map(({ label, value }) => (
            <div key={label}><dt>{catalog.specs[label]}</dt><dd>{value}</dd></div>
          ))}
        </dl>
        <p>{catalog.fit}</p>
      </div>
    </div>
  );
}
