import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { HeroSection } from "../../components/HeroSection";
import { ServicesSection } from "../../components/ServicesSection";
import { ContactSection } from "../../components/ContactSection";

export function Home() {
  return (
    <>
      <Header />

      <main>
        <HeroSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
