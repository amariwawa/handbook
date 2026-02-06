import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SubjectsSection } from "@/components/SubjectsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import ChatbotWidget from "../components/ChatbotWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SubjectsSection />
      <FeaturesSection />
      <PricingSection />
      <ThemeToggle />
      <ChatbotWidget />
      <Footer />
    </div>
  );
};

export default Index;
