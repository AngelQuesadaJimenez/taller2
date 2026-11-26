import Image from "next/image";
import type { PaymentBrandImages } from "@/data/business.config";

export function PaymentBrandLogo({ images }: { images: PaymentBrandImages }) {
  return (
    <span className="payment-brand-logo">
      {(["light", "dark"] as const).map((theme) => {
        const { src, width, height } = images[theme];
        return <Image key={theme} src={src} width={width} height={height} alt="" unoptimized data-logo-theme={theme} />;
      })}
    </span>
  );
}
