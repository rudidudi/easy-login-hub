import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import GenerationModes from "@/components/landing/GenerationModes";
import Features from "@/components/landing/Features";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <HowItWorks />
    <GenerationModes />
    <Features />
    <CtaSection />
    <Footer />
  </div>
);

export default Index;
