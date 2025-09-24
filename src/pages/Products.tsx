import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { products, getProductsByCategory, searchProducts, Product } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

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
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = (product: Product) => {
    toast({
      title: "Buy Now",
      description: `Redirecting to checkout for ${product.name}...`,
    });
  };

  const handleWishlist = (product: Product) => {
    toast({
      title: "Added to Wishlist",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-muted-foreground text-lg">
            Showing {filteredProducts.length} products
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => handleCategoryChange(category.id)}
              className="flex items-center gap-2"
            >
              {category.name}
              <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                {category.count}
              </span>
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id}
              className="group animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
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
                  
                  {/* Wishlist Button */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="bg-white/90 hover:bg-white"
                      onClick={() => handleWishlist(product)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
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
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  
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

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
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