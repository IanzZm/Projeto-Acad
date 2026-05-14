import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { HeroSection } from "../../components/HeroSection";
import { ServicesSection } from "../../components/ServicesSection";
import { AboutSection } from "../../components/AboutSection";
import { ContactSection } from "../../components/ContactSection";


export function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <ContactSection/>
      </main>
      <Footer />
    </>
  );
}
