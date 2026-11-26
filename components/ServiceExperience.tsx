"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { ServiceDialog } from "@/components/ServiceDialog";
import type { CatalogProduct } from "@/data/catalog";
import type { Service } from "@/data/site-content";

type OpenService = (service: Service, returnFocus: HTMLElement, product?: CatalogProduct) => void;

const ServiceExperienceContext = createContext<OpenService | null>(null);

export function ServiceExperience({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<{ service: Service; returnFocus: HTMLElement; product?: CatalogProduct } | null>(null);

  return (
    <ServiceExperienceContext.Provider value={(service, returnFocus, product) => setSelected({ service, returnFocus, product })}>
      {children}
      {selected && <ServiceDialog service={selected.service} product={selected.product} onDismiss={() => {
        selected.returnFocus.focus({ preventScroll: true });
        setSelected(null);
      }} />}
    </ServiceExperienceContext.Provider>
  );
}

export function useServiceExperience() {
  const open = useContext(ServiceExperienceContext);
  if (!open) throw new Error("ServiceExperience is required.");
  return open;
}
