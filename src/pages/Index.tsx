import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { TeamSection } from "@/components/sections/TeamSection";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <HeroBanner />
        <CategoriesSection />
        <FeaturedProducts />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
<script type="module" src="script.js"></script>
