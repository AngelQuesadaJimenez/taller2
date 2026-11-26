import { catalogPhotos, type PhotoAsset } from "./photos";
import type { ServiceCategory } from "./services.config";

type CatalogAngle = "front" | "side" | "oblique";
type Specification = "models" | "voltage" | "amperage" | "signal" | "pinion" | "rotation";

export type CatalogProduct = {
  id: "toyota-lexus" | "mini" | "cat-mit" | "ford-mazda";
  category: ServiceCategory;
  reference: string;
  details: readonly { label: Specification; value: string }[];
  images: readonly [
    { angle: CatalogAngle; asset: PhotoAsset },
    ...{ angle: CatalogAngle; asset: PhotoAsset }[],
  ];
};

const angle = (asset: PhotoAsset, view: CatalogAngle) => ({ angle: view, asset });

// Identifiers and electrical ratings transcribed from the matching product cards in the owner's archive.
export const catalog: readonly CatalogProduct[] = [
  {
    id: "toyota-lexus", category: "alternador", reference: "Toyota Corolla / RAV4 · Lexus ES · 12 V · 115 A · LIN",
    details: [
      { label: "models", value: "Toyota Corolla · RAV4 · Lexus ES" },
      { label: "voltage", value: "12 V" },
      { label: "amperage", value: "115 A" },
      { label: "signal", value: "LIN" },
    ],
    images: [angle(catalogPhotos.toyotaOblique, "oblique"), angle(catalogPhotos.toyotaSide, "side")],
  },
  {
    id: "mini", category: "alternador", reference: "MINI R50–R61 · 12 V · 150 A",
    details: [
      { label: "models", value: "MINI R50–R61" },
      { label: "voltage", value: "12 V" },
      { label: "amperage", value: "150 A" },
    ],
    images: [angle(catalogPhotos.miniFront, "front"), angle(catalogPhotos.miniSide, "side")],
  },
  {
    id: "cat-mit", category: "arrancador", reference: "CAT/MIT · 24 V · 10D",
    details: [{ label: "voltage", value: "24 V" }, { label: "pinion", value: "10D" }],
    images: [angle(catalogPhotos.catOblique, "oblique"), angle(catalogPhotos.catFront, "front"), angle(catalogPhotos.catSide, "side")],
  },
  {
    id: "ford-mazda", category: "arrancador", reference: "Ford / Mazda · 12 V · 22D · CCW",
    details: [
      { label: "voltage", value: "12 V" },
      { label: "pinion", value: "22D" },
      { label: "rotation", value: "CCW" },
    ],
    images: [angle(catalogPhotos.fordSide, "side"), angle(catalogPhotos.fordFront, "front")],
  },
];
