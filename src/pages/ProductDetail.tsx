import { useState } from "react";
import { Star, Heart, ShoppingCart, Minus, Plus, Shield, Truck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Mock product data
const product = {
  id: 1,
  name: "Rechargeable Light",
  price: 299.99,
  originalPrice: 399.99,
  rating: 4.8,
  reviews: 156,
  stock: 15,
  images: [
    "IMG-20241130-WA0025.jpg,
    "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&q=80",
    "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&q=80"
  ],
  description: "Experience crystal-clear audio with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and premium comfort padding.",
  features: [
    "Active Noise Cancellation",
    "30-hour battery life",
    "Premium comfort padding",
    "Quick charge - 5 min = 2 hours",
    "Bluetooth 5.0 connectivity",
    "Built-in microphone"
  ],
  specifications: {
    "Driver Size": "40mm",
    "Frequency Response": "20Hz - 20kHz",
    "Impedance": "32 ohms",
    "Weight": "250g",
    "Connectivity": "Bluetooth 5.0, 3.5mm jack",
    "Battery": "30 hours wireless, 40 hours wired"
  }
};

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart!",
      description: `${quantity} ${product.name} added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    // Add to cart first, then redirect to checkout
    handleAddToCart();
    navigate("/checkout");
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: isWishlisted 
        ? "Item removed from your wishlist" 
        : "Item added to your wishlist",
    });
  };

  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square w-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-primary shadow-medium' 
                      : 'border-transparent hover:border-muted-foreground'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-rating fill-current' : 'text-muted-foreground'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-price">${product.price}</span>
              <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
              <Badge variant="secondary" className="text-sm font-semibold">
                {discountPercentage}% OFF
              </Badge>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-success font-medium">
                {product.stock} items in stock
              </span>
            </div>

            <Separator />

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  onClick={handleBuyNow}
                  className="flex-1"
                >
                  Buy Now
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleWishlist}
                  className={isWishlisted ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <Shield className="h-8 w-8 text-primary" />
                <span className="text-xs font-medium">2 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <Truck className="h-8 w-8 text-primary" />
                <span className="text-xs font-medium">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <RefreshCw className="h-8 w-8 text-primary" />
                <span className="text-xs font-medium">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description & Specifications */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Specifications</h2>
            <div className="space-y-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-muted">
                  <span className="font-medium">{key}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
