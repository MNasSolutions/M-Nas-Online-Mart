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

// Mock cart data
const cartItems = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80"
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80"
  }
];

export default function Checkout() {
  const [loading, setLoading] = useState(false);
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

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;
      
      toast({
        title: "Order placed successfully!",
        description: `Your order #${orderNumber} has been confirmed.`,
      });

      // Redirect to order confirmation
      navigate(`/order-confirmation?orderNumber=${orderNumber}`);
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Please check your payment details and try again.",
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
                      <Label htmlFor="country">Country *</Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                        <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
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

                <Separator className="my-6" />

                {/* Card Payment Option */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Or Pay with Card</h3>
                  <div>
                    <Label htmlFor="cardName">Name on Card *</Label>
                    <Input
                      id="cardName"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange("cardName", e.target.value)}
                      className={errors.cardName ? "border-destructive" : ""}
                    />
                    {errors.cardName && <p className="text-sm text-destructive mt-1">{errors.cardName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                      maxLength={19}
                      className={errors.cardNumber ? "border-destructive" : ""}
                    />
                    {errors.cardNumber && <p className="text-sm text-destructive mt-1">{errors.cardNumber}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                          }
                          handleInputChange("expiryDate", value);
                        }}
                        maxLength={5}
                        className={errors.expiryDate ? "border-destructive" : ""}
                      />
                      {errors.expiryDate && <p className="text-sm text-destructive mt-1">{errors.expiryDate}</p>}
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ''))}
                        maxLength={4}
                        className={errors.cvv ? "border-destructive" : ""}
                      />
                      {errors.cvv && <p className="text-sm text-destructive mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>

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
                  {loading ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
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
                {cartItems.map((item) => (
                  <div key={item.id} className="flex space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="mb-4" />

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
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