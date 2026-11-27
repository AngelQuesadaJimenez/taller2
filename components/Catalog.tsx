"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { usePreferences } from "@/components/Preferences";
import { PartsBreakdown } from "@/components/PartsBreakdown";
import { AppIcon } from "@/components/ui/AppIcon";
import { AutomotivePhoto } from "@/components/ui/AutomotivePhoto";
import { GlassButton } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassSection } from "@/components/ui/GlassSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { catalog, type CatalogProduct } from "@/data/catalog";
import "./catalog.css";

const filters = ["all", "alternador", "arrancador"] as const;

export function Catalog({ onSelect }: { onSelect: (product: CatalogProduct, trigger: HTMLButtonElement) => void }) {
  const { t } = usePreferences();
  const [filter, setFilter] = useState<typeof filters[number]>("all");
  const products = filter === "all" ? catalog : catalog.filter(({ category }) => category === filter);

  return (
    <GlassSection id="repuestos" variant="band" aria-labelledby="repuestos-titulo">
      <div className="wrap">
        <SectionHeading id="repuestos-titulo" {...t.home.products} />
        <div className="catalog-toolbar">
          <div className="catalog-filters" role="group" aria-label={t.catalog.filters}>
            {filters.map((id) => (
              <GlassButton key={id} variant="glass" aria-controls="catalogo-resultados" aria-pressed={filter === id}
                onClick={() => setFilter(id)}>
                {id === "all" ? t.catalog.all : t.parts[id].plural}
              </GlassButton>
            ))}
          </div>
          <GlassButton href="#despiece" variant="outline">{t.breakdown.title}</GlassButton>
        </div>
        <div className="catalog-grid" id="catalogo-resultados" data-reveal="group">
          {products.map((product) => {
            const title = t.catalog.titles[product.id];
            const { asset, angle } = product.images[0];
            const summary = product.details.filter(({ label }) => label !== "models").map(({ value }) => value).join(" · ");
            return (
              <GlassCard key={product.id} title={title} description={summary} className="catalog-card"
                image={
                  <div className="catalog-photo">
                    <AutomotivePhoto photo={{ ...asset, alt: title + " · " + t.catalog.angle[angle] }}
                      sizes="(max-width: 580px) 92vw, (max-width: 899px) 46vw, (max-width: 1280px) 23vw, 290px" />
                  </div>
                }
                action={
                  <GlassButton className="catalog-quote" variant="primary" aria-haspopup="dialog"
                    aria-label={t.catalog.availability + " · " + title}
                    onClick={(event) => onSelect(product, event.currentTarget)}>
                    {t.catalog.availability} <AppIcon icon={ArrowUpRight} size="small" />
                  </GlassButton>
                }
              />
            );
          })}
          {products.length === 0 && <p role="status">{t.catalog.empty}</p>}
        </div>
        <PartsBreakdown />
      </div>
    </GlassSection>
  );
}
