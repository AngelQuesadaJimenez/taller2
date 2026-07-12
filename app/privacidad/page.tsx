import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  robots: { index: false, follow: true },
};

export default function Privacidad() {
  return (
    <LegalPage title="Aviso de Privacidad" updated="Julio 2026">
      <p>
        En {site.legalName} respetamos y protegemos tu información personal. Este aviso explica
        qué datos recolectamos y cómo los usamos.
      </p>
      <h2>1. Datos que recolectamos</h2>
      <p>
        A través del formulario de contacto podemos recolectar: nombre, teléfono, correo
        electrónico y el mensaje que nos envías. No solicitamos datos sensibles ni información
        financiera.
      </p>
      <h2>2. Uso de los datos</h2>
      <p>
        Usamos tus datos únicamente para responder tu consulta, elaborar cotizaciones y darte
        seguimiento comercial. No vendemos ni compartimos tu información con terceros ajenos a
        la prestación del servicio.
      </p>
      <h2>3. Conservación</h2>
      <p>
        Conservamos tus datos el tiempo necesario para atender tu solicitud y cumplir
        obligaciones legales o contables.
      </p>
      <h2>4. Tus derechos</h2>
      <p>
        Puedes solicitar acceso, rectificación o eliminación de tus datos escribiéndonos a{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>, conforme a la Ley N.° 8968 de Costa
        Rica.
      </p>
      <h2>5. Contacto</h2>
      <p>
        Responsable del tratamiento: {site.legalName}, {site.address.district}, {site.address.city},
        {" "}
        {site.address.country}.
      </p>
    </LegalPage>
  );
}
