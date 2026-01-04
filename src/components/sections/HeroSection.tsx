import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 md:space-y-8 animate-fade-in text-center lg:text-left">
            <div className="space-y-3 md:space-y-4">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-primary">
                ✨ New Collection Available
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                Discover Amazing
                <span className="gradient-hero bg-clip-text text-transparent block">
                  Products Today
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 text-balance">
                Shop the latest trends in electronics, fashion, and home essentials. 
                Get premium quality products with fast delivery and excellent customer service.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="group w-full sm:w-auto" asChild>
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="group w-full sm:w-auto" 
                onClick={() => window.open('https://m.youtube.com/channel/UCjsbfp-fyIDkGxyOx4hDVXQ', '_blank')}
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-border/50">
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-bold text-primary">10K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-bold text-primary">50K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Products</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-bold text-primary">4.9★</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up order-first lg:order-last">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-strong">
              <img 
                src={heroBanner} 
                alt="Premium products showcase"
                className="w-full h-[280px] sm:h-[350px] md:h-[450px] lg:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Cards - Hidden on very small screens */}
            <div className="hidden sm:block absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-card rounded-lg p-2 sm:p-4 shadow-medium animate-scale-in">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-success rounded-full animate-pulse" />
                <div className="text-xs sm:text-sm font-medium">Free Shipping</div>
              </div>
            </div>
            
            <div className="hidden sm:block absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-card rounded-lg p-2 sm:p-4 shadow-medium animate-scale-in">
              <div className="text-xs sm:text-sm font-medium text-secondary">🔥 Flash Sale</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Up to 70% off</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}