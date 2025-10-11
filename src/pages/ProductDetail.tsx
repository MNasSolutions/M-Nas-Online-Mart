import { useState } from "react";
import { Star, Heart, ShoppingCart, Minus, Plus, Shield, Truck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { products as allProducts } from "@/data/products";
import { useCurrency } from "@/contexts/CurrencyContext";

// Using dynamic product data from catalog


export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { format } = useCurrency();

  // Resolve product by route param
  const { id } = useParams();
  const dataProduct = allProducts.find((p) => p.id === Number(id));

  if (!dataProduct) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button asChild>
            <a href="/products">Back to Products</a>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  // Normalize product shape to reuse the existing UI
  const product = {
    id: dataProduct.id,
    name: dataProduct.name,
    price: dataProduct.price,
    originalPrice: dataProduct.originalPrice ?? dataProduct.price,
    rating: dataProduct.rating,
    reviews: dataProduct.reviews,
    stock: 15,
    images: [dataProduct.image],
    description: dataProduct.description,
    features: [
      "Premium quality materials",
      "Fast shipping and delivery",
      "Secure packaging",
      "30-day returns policy",
      "Reliable customer support",
      "Multi-currency support"
    ],
    specifications: {
      "Category": dataProduct.category,
      "Model": dataProduct.name,
      "Warranty": "12 months",
      "Package": "Retail box",
      "Ships from": "Global Warehouse"
    }
  } as const;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    });
    toast({
      title: "Added to Cart!",
      description: `${quantity} ${product.name} added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    // Add to cart first, then redirect to checkout
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    });
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
              <span className="text-3xl font-bold text-price">{format(product.price)}</span>
              <span className="text-xl text-muted-foreground line-through">{format(product.originalPrice)}</span>
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
