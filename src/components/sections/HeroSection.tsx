import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                ✨ New Collection Available
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
                Discover Amazing
                <span className="gradient-hero bg-clip-text text-transparent block">
                  Products Today
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg text-balance">
                Shop the latest trends in electronics, fashion, and home essentials. 
                Get premium quality products with fast delivery and excellent customer service.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group" asChild>
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" className="group" onClick={() => window.open('https://m.youtube.com/channel/UCjsbfp-fyIDkGxyOx4hDVXQ', '_blank')}>
                <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-primary">4.9★</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up">
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <img 
                src={heroBanner} 
                alt="Premium products showcase"
                className="w-full h-[400px] md:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-card rounded-lg p-4 shadow-medium animate-scale-in">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                <div className="text-sm font-medium">Free Shipping</div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-card rounded-lg p-4 shadow-medium animate-scale-in">
              <div className="text-sm font-medium text-secondary">🔥 Flash Sale</div>
              <div className="text-xs text-muted-foreground">Up to 70% off</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}