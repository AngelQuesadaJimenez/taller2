import { Activity, Brush, CircleDot, CircuitBoard, Cog, Layers, Magnet, Settings, SlidersHorizontal, type LucideIcon } from "lucide-react";
import type { PhotoAsset } from "./photos";

export const serviceComponents = [{ id: "alternador" }, { id: "arrancador" }] as const;
export const serviceIntents = [{ id: "compra" }, { id: "reparacion" }] as const;
export const undecidedComponent = { id: "orientacion" } as const;

export type ServiceCategory = typeof serviceComponents[number]["id"];
export type ServiceComponent = ServiceCategory | typeof undecidedComponent.id;
export type ServiceIntent = typeof serviceIntents[number]["id"];
export type ServiceInquiry = { component: ServiceCategory; intent: ServiceIntent; product?: string };

export const sparePartGroups = [
  { id: "alternator", parts: [
    { id: "placas-diodos", icon: CircuitBoard },
    { id: "reguladores", icon: SlidersHorizontal },
    { id: "poleas", icon: CircleDot },
  ] },
  { id: "starter", parts: [
    { id: "planetarios", icon: Cog },
    { id: "bendix", icon: Settings },
    { id: "automaticos", icon: Magnet },
  ] },
  { id: "byDesign", parts: [
    { id: "roles", icon: Activity },
    { id: "carbones", icon: Brush },
    { id: "porta-carbones", icon: Layers },
  ] },
] as const;

export type SparePartId = typeof sparePartGroups[number]["parts"][number]["id"];
export type ConsultationContext = ServiceInquiry | { piece: SparePartId };
export type SparePart = { id: SparePartId; icon: LucideIcon; photo?: PhotoAsset };
