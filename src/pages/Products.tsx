import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { products, getProductsByCategory, searchProducts, Product } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useNavigate } from "react-router-dom";


const categories = [
  { id: 'all', name: 'All Products', count: products.length },
  { id: 'electronics', name: 'Electronics', count: products.filter(p => p.category === 'electronics').length },
  { id: 'fashion', name: 'Fashion', count: products.filter(p => p.category === 'fashion').length },
  { id: 'home', name: 'Home & Living', count: products.filter(p => p.category === 'home').length },
  { id: 'sports', name: 'Sports & Fitness', count: products.filter(p => p.category === 'sports').length },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const navigate = useNavigate();

  useEffect(() => {
    let filtered = products;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = getProductsByCategory(selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = searchProducts(searchQuery);
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(product => product.category === selectedCategory);
      }
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (category === 'all') {
        newParams.delete('category');
      } else {
        newParams.set('category', category);
      }
      return newParams;
    });
  };

  const handleAddToCart = (product: Product) => {
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

  const handleBuyNow = (product: Product) => {
    navigate(`/product/${product.id}`);
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-4 sm:py-8">
        {/* Page Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            Showing {filteredProducts.length} products
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => handleCategoryChange(category.id)}
              size="sm"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">{category.name}</span>
              <span className="sm:hidden">{category.name.split(' ')[0]}</span>
              <span className="bg-muted text-muted-foreground px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs">
                {category.count}
              </span>
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id}
              className="group animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
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
                  
                  
                  {/* Action Buttons - Hidden on mobile */}
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
                  
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2 hidden sm:block">
                    {product.description}
                  </p>
                  
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

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-2">No products found</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setSearchParams({});
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
