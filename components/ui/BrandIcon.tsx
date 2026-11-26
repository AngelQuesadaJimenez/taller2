import Image from "next/image";

const assets = {
  whatsapp: { file: "whatsapp.webp", width: 95, height: 96 },
  whatsappFilled: { file: "whatsapp-filled.png", width: 300, height: 300 },
  waze: { file: "waze.svg", width: 123, height: 123 },
  googleMaps: { file: "google-maps.svg", width: 192, height: 192 },
  facebook: { file: "facebook.png", width: 300, height: 301 },
  instagram: { file: "instagram.png", width: 300, height: 300 },
  openStreetMap: { file: "openstreetmap.webp", width: 96, height: 96 },
} as const;

export function BrandIcon({ brand }: { brand: keyof typeof assets }) {
  const { file, width, height } = assets[brand];
  return (
    <span className={"brand-icon brand-icon--" + brand} aria-hidden="true">
      <Image src={"/brands/" + file} width={width} height={height} alt="" unoptimized />
    </span>
  );
}
