import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  robots: { index: false, follow: true },
};

export default function Terminos() {
  return (
    <LegalPage title="Términos y Condiciones" updated="Julio 2026">
      <p>
        Estos términos regulan el uso de este sitio web y la contratación de los servicios de{" "}
        {site.legalName}.
      </p>
      <h2>1. Servicios</h2>
      <p>
        Ofrecemos venta y reparación de alternadores y arrancadores para vehículo liviano,
        pesado y maquinaria. Las cotizaciones son referenciales y pueden variar según el
        diagnóstico presencial de la pieza.
      </p>
      <h2>2. Cotizaciones y pagos</h2>
      <p>
        Los precios se confirman antes de iniciar cualquier trabajo. Los medios de pago
        aceptados se informan al momento de la contratación. {/* TODO(owner): detallar */}
      </p>
      <h2>3. Garantía</h2>
      <p>
        Respaldamos nuestros trabajos y las piezas vendidas. Las condiciones y el plazo de
        garantía se indican al momento de la compra o reparación. {/* TODO(owner): definir plazo */}
      </p>
      <h2>4. Cancelaciones</h2>
      <p>
        Las cancelaciones deben comunicarse con la mayor anticipación posible. Trabajos ya
        iniciados o piezas solicitadas a pedido pueden estar sujetos a cargos.
      </p>
      <h2>5. Limitación de responsabilidad</h2>
      <p>
        La información de este sitio es de carácter informativo. No garantizamos disponibilidad
        permanente de todos los repuestos; consúltanos por existencias.
      </p>
    </LegalPage>
  );
}
