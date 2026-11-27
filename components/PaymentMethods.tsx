"use client";

import { Banknote, CreditCard, Landmark } from "lucide-react";
import { usePreferences } from "@/components/Preferences";
import { AppIcon } from "@/components/ui/AppIcon";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassSection } from "@/components/ui/GlassSection";
import { PaymentBrandLogo } from "@/components/ui/PaymentBrandLogo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { business } from "@/data/business.config";
import "./payments.css";

const paymentIcons = { banknote: Banknote, creditCard: CreditCard, landmark: Landmark };

export function PaymentMethods() {
  const { t } = usePreferences();
  const copy = t.payments;

  return (
    <GlassSection id="pagos" className="wrap payments" aria-labelledby="pagos-titulo">
      <SectionHeading id="pagos-titulo" title={copy.title} description={copy.description} />
      <ul className="payment-grid" role="list">
        {business.payments.methods.map((method) => {
          const { name, description } = copy.methods[method.id];
          return (
            <li key={method.id} data-reveal="item">
              <GlassCard className="payment-card" variant="subtle" title={name}
                description={"months" in method ? description.replace("{months}", String(method.months)) : description}
                icon={
                  <div className="payment-mark" aria-hidden="true">
                    {"icon" in method
                      ? <AppIcon icon={paymentIcons[method.icon]} size="large" />
                      : <PaymentBrandLogo images={method.brand} />}
                  </div>
                } />
            </li>
          );
        })}
      </ul>
    </GlassSection>
  );
}
