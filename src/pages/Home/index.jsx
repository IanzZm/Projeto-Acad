import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { HeroSection } from "../../components/HeroSection";
import { ServicesSection } from "../../components/ServicesSection";

export function Home() {
  return (
    <>
      <Header />
      <HeroSection/>
      <ServicesSection/>
      <Footer/>
    </>
  );
}