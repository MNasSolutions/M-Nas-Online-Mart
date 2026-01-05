import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { products as allProducts, Product } from "@/data/products";

// Featured products pulled from the global catalog to keep IDs consistent
const featuredIds = [1, 2, 11, 21];
const products: Product[] = allProducts.filter((p) => featuredIds.includes(p.id));

export function FeaturedProducts() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { format } = useCurrency();

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = (product: typeof products[0]) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <section className="py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Featured Products
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked products that our customers love the most
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-300 product-card-hover">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <div className={`absolute top-2 left-2 sm:top-3 sm:left-3 ${product.badgeColor} text-white text-[10px] sm:text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full`}>
                      {product.badge}
                    </div>
                  )}
                  
                  
                  {/* Action Buttons - Hidden on mobile, shown on hover for desktop */}
                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex gap-2">
                    <Button 
                      variant="cta" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleBuyNow(product)}
                    >
                      Buy Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-white/90 hover:bg-white"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-3">
                  <h3 className="font-semibold text-sm sm:text-lg group-hover:text-primary transition-colors line-clamp-1 sm:line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(product.rating) ? 'text-rating fill-current' : 'text-muted-foreground'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-sm text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="text-base sm:text-xl font-bold text-price">
                      {format(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[10px] sm:text-sm text-muted-foreground line-through">
                        {format(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Mobile-only Action Buttons */}
                  <div className="pt-2 sm:hidden flex gap-2">
                    <Button 
                      variant="cta" 
                      size="sm" 
                      className="flex-1 text-xs h-8"
                      onClick={() => handleBuyNow(product)}
                    >
                      Buy Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs h-8"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/products">
              View All Products
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
