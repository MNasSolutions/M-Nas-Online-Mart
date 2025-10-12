import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { products } from "@/data/products";

export function HeroBanner() {
  // Get featured products for banner (first 5 products)
  const bannerProducts = products.slice(0, 5);

  return (
    <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-8">
      <div className="container mx-auto px-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {bannerProducts.map((product) => (
              <CarouselItem key={product.id}>
                <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                    <div className="container mx-auto px-8">
                      <div className="max-w-lg text-white">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                          {product.name}
                        </h2>
                        <p className="text-lg mb-6">{product.description}</p>
                        <Button
                          variant="secondary"
                          size="lg"
                          asChild
                        >
                          <a href={`/product/${product.id}`}>Shop Now</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    </section>
  );
}
