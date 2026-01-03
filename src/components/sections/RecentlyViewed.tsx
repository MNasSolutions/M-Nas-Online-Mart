import { useState, useEffect } from "react";
import { History, ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";

interface RecentProduct {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  viewedAt: number;
}

const STORAGE_KEY = "recently-viewed-products";
const MAX_ITEMS = 10;

export function useRecentlyViewed() {
  const addToRecentlyViewed = (product: Omit<RecentProduct, "viewedAt">) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let items: RecentProduct[] = stored ? JSON.parse(stored) : [];

      // Remove if already exists
      items = items.filter((item) => item.id !== product.id);

      // Add to beginning with timestamp
      items.unshift({
        ...product,
        viewedAt: Date.now(),
      });

      // Keep only MAX_ITEMS
      items = items.slice(0, MAX_ITEMS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving recently viewed:", error);
    }
  };

  const getRecentlyViewed = (): RecentProduct[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const clearRecentlyViewed = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return { addToRecentlyViewed, getRecentlyViewed, clearRecentlyViewed };
}

export function RecentlyViewed() {
  const [products, setProducts] = useState<RecentProduct[]>([]);
  const { getRecentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const { format } = useCurrency();

  useEffect(() => {
    setProducts(getRecentlyViewed());
  }, []);

  const handleClear = () => {
    clearRecentlyViewed();
    setProducts([]);
  };

  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Recently Viewed</h2>
              <p className="text-sm text-muted-foreground">
                Continue where you left off
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
            <Link to="/products">
              <Button variant="outline" size="sm" className="group">
                View All
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Products Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="flex-shrink-0"
            >
              <Card className="w-40 md:w-48 group hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="aspect-square overflow-hidden bg-muted rounded-t-lg">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <p className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </p>
                    <p className="text-sm font-bold text-primary mt-1">
                      {format(product.price)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
