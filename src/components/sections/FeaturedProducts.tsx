import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock product data
const products = [
  {
    id: 1,
    name: "Wireless Pro Headphones",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    badge: "Best Seller",
    badgeColor: "bg-primary"
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: null,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    badge: "New",
    badgeColor: "bg-success"
  },
  {
    id: 3,
    name: "Premium Leather Bag",
    price: 149.99,
    originalPrice: 219.99,
    rating: 4.7,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    badge: "Sale",
    badgeColor: "bg-secondary"
  },
  {
    id: 4,
    name: "Modern Table Lamp",
    price: 89.99,
    originalPrice: null,
    rating: 4.6,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    badge: null,
    badgeColor: ""
  }
];

export function FeaturedProducts() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Handpicked products that our customers love the most
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-300 product-card-hover">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <div className={`absolute top-3 left-3 ${product.badgeColor} text-white text-xs font-medium px-2 py-1 rounded-full`}>
                      {product.badge}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button size="icon" variant="ghost" className="bg-white/90 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Quick Add to Cart */}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button variant="cta" size="sm" className="w-full">
                      <ShoppingCart className="h-4 w-4" />
                      Quick Add
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-rating fill-current' : 'text-muted-foreground'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-price">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}