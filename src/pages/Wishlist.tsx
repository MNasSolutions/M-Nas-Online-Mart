import { useState } from "react";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Mock wishlist data
const wishlistItems = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
    rating: 4.8,
    reviews: 256,
    inStock: true
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
    rating: 4.6,
    reviews: 189,
    inStock: false
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    price: 349.99,
    originalPrice: 449.99,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80",
    rating: 4.7,
    reviews: 94,
    inStock: true
  }
];

export default function Wishlist() {
  const [items, setItems] = useState(wishlistItems);
  const { toast } = useToast();

  const removeFromWishlist = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  const addToCart = (item: any) => {
    toast({
      title: "Added to Cart!",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const clearWishlist = () => {
    setItems([]);
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist.",
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Heart className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Save items you love for later by adding them to your wishlist
            </p>
            <Button asChild size="lg">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">{items.length} items saved</p>
          </div>
          <div className="mt-4 sm:mt-0 space-x-2">
            <Button variant="outline" onClick={clearWishlist}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const discountPercentage = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
            
            return (
              <div key={item.id} className="bg-card rounded-2xl shadow-soft overflow-hidden border group hover:shadow-elegant transition-all duration-300">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-sm font-medium">
                      -{discountPercentage}%
                    </div>
                  )}
                  {!item.inStock && (
                    <div className="absolute top-4 right-4 bg-muted text-muted-foreground px-2 py-1 rounded-md text-sm">
                      Out of Stock
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-background/80 hover:bg-background"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                  </Button>
                </div>
                
                <div className="p-6">
                  <Link 
                    to={`/product/${item.id}`}
                    className="block hover:text-primary transition-colors"
                  >
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(item.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({item.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl font-bold text-price">
                      ${item.price}
                    </span>
                    {item.originalPrice > item.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${item.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => addToCart(item)}
                      disabled={!item.inStock}
                      className="flex-1"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {item.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Info Section */}
        <div className="mt-12 bg-card rounded-2xl shadow-soft p-6 border">
          <h2 className="text-xl font-semibold mb-6 text-center">Payment Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Moniepoint Details */}
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-primary">Moniepoint Microfinance Bank</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Name:</span>
                  <span className="font-medium">Muhammad Ahmad Saad</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Number:</span>
                  <span className="font-medium">7069036157</span>
                </div>
              </div>
            </div>

            {/* Opay Details */}
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-primary">Opay</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Name:</span>
                  <span className="font-medium">Abubakar Ahmad Saad</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Number:</span>
                  <span className="font-medium">7069036157</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-center">
              Transfer to any of these accounts for order payments and confirm via WhatsApp
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
