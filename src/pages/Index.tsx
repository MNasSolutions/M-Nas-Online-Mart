import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { TeamSection } from "@/components/sections/TeamSection";
import { Footer } from "@/components/layout/Footer";
import { FlashSales } from "@/components/sections/FlashSales";
import { RecentlyViewed } from "@/components/sections/RecentlyViewed";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FlashSales />
        <HeroBanner />
        <CategoriesSection />
        <FeaturedProducts />
        <RecentlyViewed />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
