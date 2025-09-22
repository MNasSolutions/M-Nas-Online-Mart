import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock cart data
const initialCartItems = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
    quantity: 2,
    stock: 15
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
    quantity: 1,
    stock: 8
  },
  {
    id: 3,
    name: "Premium Leather Bag",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80",
    quantity: 1,
    stock: 12
  }
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const navigate = useNavigate();
  const { toast } = useToast();

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    
    setCartItems(items =>
      items.map(item =>
        item.id === id 
          ? { ...item, quantity: Math.min(newQuantity, item.stock) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    const item = cartItems.find(item => item.id === id);
    setCartItems(items => items.filter(item => item.id !== id));
    
    toast({
      title: "Item Removed",
      description: `${item?.name} removed from cart`,
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checkout",
        variant: "destructive"
      });
      return;
    }
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto" />
            <div>
              <h1 className="text-3xl font-bold mb-2">Your cart is empty</h1>
              <p className="text-muted-foreground text-lg">
                Looks like you haven't added anything to your cart yet
              </p>
            </div>
            <Button size="lg" onClick={() => navigate("/")}>
              Continue Shopping
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
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-card rounded-lg p-6 shadow-soft">
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-xl font-bold text-price">${item.price}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.stock} items in stock
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:space-y-4">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-3 py-1 min-w-[2.5rem] text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow-soft sticky top-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-price">${total.toFixed(2)}</span>
                </div>

                {shipping > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
              </div>

              <Button 
                size="lg" 
                className="w-full mt-6"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>

              {/* Trust Indicators */}
              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                <p>✓ Secure checkout with SSL encryption</p>
                <p>✓ 30-day money-back guarantee</p>
                <p>✓ Free shipping on orders over $100</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}