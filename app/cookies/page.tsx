import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Política de Cookies",
  robots: { index: false, follow: true },
};

export default function Cookies() {
  return (
    <LegalPage title="Política de Cookies" updated="Julio 2026">
      <p>
        Este sitio utiliza un mínimo de cookies técnicas necesarias para su funcionamiento. Si
        se habilita analítica (por ejemplo, Google Analytics), se usarán cookies para medir el
        tráfico de forma anónima.
      </p>
      <h2>1. Cookies técnicas</h2>
      <p>Imprescindibles para la navegación y la seguridad del sitio. No requieren consentimiento.</p>
      <h2>2. Cookies analíticas (opcionales)</h2>
      <p>
        Nos ayudan a entender cómo se usa el sitio para mejorarlo. Solo se activan si el sitio
        integra una herramienta de analítica. {/* TODO(owner): confirmar si se usa GA */}
      </p>
      <h2>3. Cómo gestionarlas</h2>
      <p>
        Puedes bloquear o eliminar las cookies desde la configuración de tu navegador en
        cualquier momento.
      </p>
    </LegalPage>
  );
}
