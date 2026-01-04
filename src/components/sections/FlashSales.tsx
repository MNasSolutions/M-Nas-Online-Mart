import { useState, useEffect } from "react";
import { Timer, Flame, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";

interface FlashSale {
  id: string;
  product_id: string;
  original_price: number;
  sale_price: number;
  discount_percentage: number;
  end_time: string;
  quantity_limit: number | null;
  product?: {
    name: string;
    image_url: string;
    category: string;
  };
}

export function FlashSales() {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [timeLeft, setTimeLeft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { format } = useCurrency();

  useEffect(() => {
    loadFlashSales();
  }, []);

  useEffect(() => {
    // Update countdown every second
    const interval = setInterval(() => {
      const newTimeLeft: Record<string, string> = {};
      flashSales.forEach((sale) => {
        newTimeLeft[sale.id] = calculateTimeLeft(sale.end_time);
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [flashSales]);

  const loadFlashSales = async () => {
    try {
      const { data, error } = await supabase
        .from("flash_sales")
        .select("*")
        .eq("is_active", true)
        .gt("end_time", new Date().toISOString())
        .order("end_time", { ascending: true })
        .limit(6);

      if (error) throw error;

      // Load product details for each flash sale
      if (data && data.length > 0) {
        const productIds = data.map((s) => s.product_id);
        const { data: products } = await supabase
          .from("products")
          .select("id, name, image_url, category")
          .in("id", productIds);

        const salesWithProducts = data.map((sale) => ({
          ...sale,
          product: products?.find((p) => p.id === sale.product_id),
        }));

        setFlashSales(salesWithProducts);
      }
    } catch (error) {
      console.error("Error loading flash sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = (endTime: string): string => {
    const diff = new Date(endTime).getTime() - Date.now();
    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading || flashSales.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-r from-secondary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-full bg-secondary/20 text-secondary animate-pulse">
              <Flame className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Flash Sales</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Limited time offers - Don't miss out!
              </p>
            </div>
          </div>
          <Link to="/products?sale=true">
            <Button variant="outline" size="sm" className="group w-full sm:w-auto">
              View All Deals
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Flash Sale Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {flashSales.map((sale) => (
            <Link key={sale.id} to={`/product/${sale.product_id}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {sale.product?.image_url && (
                      <img
                        src={sale.product.image_url}
                        alt={sale.product?.name || "Product"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    {/* Discount Badge */}
                    <Badge className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-secondary text-secondary-foreground text-[10px] sm:text-xs">
                      -{sale.discount_percentage}%
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
                    {/* Timer */}
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-secondary font-mono bg-secondary/10 rounded px-1.5 py-0.5 sm:px-2 sm:py-1">
                      <Timer className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span>{timeLeft[sale.id] || "Loading..."}</span>
                    </div>

                    {/* Product Name */}
                    <p className="text-xs sm:text-sm font-medium line-clamp-1">
                      {sale.product?.name || "Product"}
                    </p>

                    {/* Prices */}
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <span className="text-sm sm:text-lg font-bold text-secondary">
                        {format(sale.sale_price)}
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                        {format(sale.original_price)}
                      </span>
                    </div>
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
