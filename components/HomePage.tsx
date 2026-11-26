import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CommercialServices } from "@/components/Services";
import { ServiceExperience } from "@/components/ServiceExperience";
import { Process } from "@/components/Process";
import { PaymentMethods } from "@/components/PaymentMethods";
import { Repairs } from "@/components/Repairs";
import { BusinessLocationSection } from "@/components/location/BusinessLocationSection";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";

export function HomePage() {
  return (
    <>
      <ServiceExperience>
        <Header />
        <main id="contenido" tabIndex={-1}>
          <Hero />
          <CommercialServices />
          <Process />
          <Repairs />
          <PaymentMethods />
          <BusinessLocationSection />
          <Contact />
        </main>
      </ServiceExperience>
      <Footer copyrightYear={new Date().getFullYear()} />
      <ScrollReveal />
    </>
  );
}
