import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { HeroSection } from "../../components/HeroSection";
import { ServicesSection } from "../../components/ServicesSection";
import { AboutSection } from "../../components/AboutSection";

export function Home() {
  return (
    <>
      <Header />
      <HeroSection/>
      <ServicesSection/>
      <AboutSection/>
      <Footer/>
    </>
  );
}