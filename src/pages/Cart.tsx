import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemoveItem(id);
      return;
    }
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: number) => {
    const item = cart.find(item => item.id === id);
    removeFromCart(id);
    
    toast({
      title: "Item Removed",
      description: `${item?.name} removed from cart`,
    });
  };

  const subtotal = cartTotal;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checkout",
        variant: "destructive"
      });
      return;
    }
    navigate("/checkout");
  };

  if (cart.length === 0) {
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
              {cart.map((item) => (
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
                      <p className="text-xl font-bold text-price">${item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:space-y-4">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
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
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
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