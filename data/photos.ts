export function photo(id: string, width: number, height: number, variants: readonly number[], { avif = false } = {}) {
  const base = "/photos/" + id;
  const srcSet = (format: "webp" | "avif") => variants.map((variant) => base + "-" + variant + "." + format + " " + variant + "w").join(", ");
  return {
    src: base + "-" + width + ".webp",
    srcSet: srcSet("webp"),
    avifSrcSet: avif ? srcSet("avif") : undefined,
    width,
    height,
  };
}

export type PhotoAsset = ReturnType<typeof photo>;

const catalogPhoto = (id: string, width = 480) =>
  photo(id, width, width, width === 320 ? [240, 320] : [240, 360, 480], { avif: true });

export const catalogPhotos = {
  toyotaOblique: catalogPhoto("toyota-frente"),
  toyotaSide: catalogPhoto("toyota-lateral"),
  miniFront: catalogPhoto("mini-frente"),
  miniSide: catalogPhoto("mini-lateral"),
  catOblique: catalogPhoto("cat-mit-angular"),
  catFront: catalogPhoto("cat-mit-frente"),
  catSide: catalogPhoto("cat-mit-lateral"),
  fordSide: catalogPhoto("ford-mazda-lateral", 320),
  fordFront: catalogPhoto("ford-mazda-frente", 320),
};

export const photos = {
  starterPerspective: catalogPhotos.catOblique,
  alternatorProduct: photo("taller-alternador-catalogo", 400, 400, [320, 400]),
  alternatorDetail: photo("taller-alternador-detalle", 480, 400, [320, 480]),
  starterDetail: photo("taller-arrancador-detalle", 480, 400, [320, 480]),
  catStarter: photo("taller-arrancador-cat-mit", 640, 640, [360, 640]),
};

export const repairs = [
  {
    id: "land-cruiser", component: "arrancador", featured: true,
    before: photo("land-cruiser-antes", 854, 590, [320, 640, 854]),
    after: photo("land-cruiser-despues", 854, 590, [320, 640, 854]),
  },
  {
    id: "lexus", component: "arrancador", featured: false,
    before: photo("lexus-antes", 854, 650, [320, 640, 854]),
    after: photo("lexus-despues", 854, 650, [320, 640, 854]),
  },
  {
    id: "audi-q5", component: "alternador", featured: true,
    before: photo("audi-q5-antes", 832, 728, [360, 640, 832]),
    after: photo("audi-q5-despues", 832, 728, [360, 640, 832]),
  },
  {
    id: "audi-q7", component: "alternador", featured: false,
    before: photo("audi-q7-antes", 800, 540, [360, 640, 800]),
    after: photo("audi-q7-despues", 800, 540, [360, 640, 800]),
  },
] as const;

export const sharePhoto = {
  src: "/photos/taller-alternador-detalle.jpg",
  width: photos.alternatorDetail.width,
  height: photos.alternatorDetail.height,
};
