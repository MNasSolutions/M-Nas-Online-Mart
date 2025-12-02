import { useState } from "react";
import { CreditCard, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";


export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "paystack">("paystack");
  const [formData, setFormData] = useState({
    // Customer Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Shipping Address
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    
    // Payment
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { format } = useCurrency();

  const subtotal = cartTotal;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone',
      'address', 'city', 'state', 'country', 'zipCode',
      'cardNumber', 'expiryDate', 'cvv', 'cardName'
    ];

    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = "This field is required";
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // Card number validation (basic)
    if (formData.cardNumber && formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    // CVV validation
    if (formData.cvv && !/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV must be 3-4 digits";
    }

    // Expiry date validation
    if (formData.expiryDate && !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Format: MM/YY";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to complete your purchase",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Some fields are missing or invalid",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      let paymentReference: string | undefined;

      // For Paystack payment, initialize payment
      if (paymentMethod === "paystack") {
        const { data: session } = await supabase.auth.getSession();
        
        const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxx'}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            amount: Math.round(total * 100), // Convert to kobo
            callback_url: `${window.location.origin}/order-confirmation`,
          }),
        });

        const paystackData = await paystackResponse.json();
        
        if (paystackData.status && paystackData.data.authorization_url) {
          // Open Paystack payment page
          window.location.href = paystackData.data.authorization_url;
          return;
        }
      }

      // Prepare order data
      const orderData = {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.country} ${formData.zipCode}`,
        payment_method: paymentMethod,
        payment_reference: paymentReference,
        items: cart.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping_fee: shipping,
        tax_amount: tax,
        discount_amount: 0,
        total_amount: total,
      };

      // Call edge function to process order
      const { data: session } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('process-order', {
        body: orderData,
        headers: {
          Authorization: `Bearer ${session.session?.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "CONGRATULATIONS! 🎉",
        description: `Your order #${data.order_number} has been placed successfully!`,
      });

      clearCart();

      // Redirect to order confirmation
      navigate(`/order-confirmation?orderNumber=${data.order_number}&trackingToken=${data.tracking_token}`);
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Order failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/cart" className="flex items-center text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Information */}
              <div className="bg-card rounded-lg p-6 shadow-soft">
                <h2 className="text-xl font-semibold mb-6">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && <p className="text-sm text-destructive mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={errors.lastName ? "border-destructive" : ""}
                    />
                    {errors.lastName && <p className="text-sm text-destructive mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-card rounded-lg p-6 shadow-soft">
                <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className={errors.address ? "border-destructive" : ""}
                    />
                    {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className={errors.city ? "border-destructive" : ""}
                      />
                      {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className={errors.state ? "border-destructive" : ""}
                      />
                      {errors.state && <p className="text-sm text-destructive mt-1">{errors.state}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">State/Region *</Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                        <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select state/region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kano">Kano</SelectItem>
                          <SelectItem value="abuja">Abuja (FCT)</SelectItem>
                          <SelectItem value="kaduna">Kaduna</SelectItem>
                          <SelectItem value="lagos">Lagos</SelectItem>
                          <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
                          <SelectItem value="ibadan">Ibadan</SelectItem>
                          <SelectItem value="benin">Benin City</SelectItem>
                          <SelectItem value="jos">Jos</SelectItem>
                          <SelectItem value="enugu">Enugu</SelectItem>
                          <SelectItem value="calabar">Calabar</SelectItem>
                          <SelectItem value="owerri">Owerri</SelectItem>
                          <SelectItem value="sokoto">Sokoto</SelectItem>
                          <SelectItem value="maiduguri">Maiduguri</SelectItem>
                          <SelectItem value="bauchi">Bauchi</SelectItem>
                          <SelectItem value="gombe">Gombe</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.country && <p className="text-sm text-destructive mt-1">{errors.country}</p>}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        className={errors.zipCode ? "border-destructive" : ""}
                      />
                      {errors.zipCode && <p className="text-sm text-destructive mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-lg p-6 shadow-soft">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </h2>

                {/* Payment Method Selection */}
                <div className="mb-6 space-y-4">
                  <Label>Select Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paystack">Pay with Paystack (Card/Bank)</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === "bank_transfer" && (
                  <>
                    {/* Bank Transfer Options */}
                    <div className="mb-6 space-y-4">
                      <h3 className="text-lg font-medium">Bank Transfer Details</h3>
                  
                  {/* Moniepoint Details */}
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-primary">Moniepoint Microfinance Bank</h4>
                    <div className="space-y-1 text-sm">
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
                    <h4 className="font-semibold mb-2 text-primary">Opay</h4>
                    <div className="space-y-1 text-sm">
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

                      <Alert>
                        <AlertDescription>
                          After making payment, please confirm via WhatsApp and provide your transaction receipt.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </>
                )}

                {paymentMethod === "paystack" && (
                  <Alert>
                    <AlertDescription>
                      You will be redirected to Paystack secure payment page to complete your payment.
                    </AlertDescription>
                  </Alert>
                )}

                <Alert className="mt-4">
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    Your payment information is encrypted and secure. We never store your card details.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/cart")}
                  className="flex-1"
                >
                  Back to Cart
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Processing..." : `Place Order - ${format(total)}`}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow-soft sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">{format(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="mb-4" />

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{format(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : format(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{format(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-price">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  Secure payment processing
                </p>
                <p className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  30-day money-back guarantee
                </p>
                <p className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  Free shipping on orders over $100
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}