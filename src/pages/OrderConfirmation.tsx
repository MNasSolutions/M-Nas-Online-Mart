import { useEffect, useState } from "react";
import { CheckCircle, Download, Printer, ArrowLeft, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useNavigate, useSearchParams, Link, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock order data
const orderData = {
  orderNumber: "ORD-1672934567",
  orderDate: new Date().toLocaleDateString(),
  estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  customer: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567"
  },
  shippingAddress: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States"
  },
  items: [
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
  ],
  payment: {
    subtotal: 799.97,
    shipping: 0,
    tax: 63.99,
    total: 863.96,
    method: "•••• •••• •••• 1234"
  }
};

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderNumber, setOrderNumber] = useState("");
  const location = useLocation();

  // Calculate order totals from location state or use default
  const orderItems = (location.state as any)?.items ?? orderData.items;
  const subtotal = (location.state as any)?.subtotal ?? orderData.payment.subtotal;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    const orderNum = searchParams.get("orderNumber");
    if (orderNum) {
      setOrderNumber(orderNum);
    } else {
      setOrderNumber(orderData.orderNumber);
    }
  }, [searchParams]);

  const handleDownloadReceipt = () => {
    toast({
      title: "Receipt Downloaded",
      description: "Your receipt has been downloaded successfully.",
    });
    // In a real app, this would generate and download a PDF
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thank you for your purchase. Your order has been successfully placed and you'll receive a confirmation email shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <div className="bg-card rounded-lg p-6 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Order Details</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleDownloadReceipt}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePrintReceipt}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Order Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Order Number:</span> {orderNumber}</p>
                    <p><span className="font-medium">Order Date:</span> {orderData.orderDate}</p>
                    <p><span className="font-medium">Payment Method:</span> {orderData.payment.method}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Delivery Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Estimated Delivery:</span> {orderData.estimatedDelivery}</p>
                    <p><span className="font-medium">Shipping Method:</span> Standard Shipping</p>
                    <p><span className="font-medium">Tracking:</span> Will be provided via email</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Shipping Info */}
            <div className="bg-card rounded-lg p-6 shadow-soft">
              <h2 className="text-xl font-semibold mb-4">Customer & Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Contact Information</h3>
                  <div className="space-y-1 text-sm">
                    <p>{orderData.customer.name}</p>
                    <p>{orderData.customer.email}</p>
                    <p>{orderData.customer.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <div className="space-y-1 text-sm">
                    <p>{orderData.shippingAddress.street}</p>
                    <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}</p>
                    <p>{orderData.shippingAddress.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-card rounded-lg p-6 shadow-soft">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {orderItems.map((item: any) => (
                  <div key={item.id} className="flex space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" size="lg" onClick={() => navigate("/")} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate(`/track-order?order=${orderNumber}`)} className="flex-1">
                <Package className="h-4 w-4 mr-2" />
                Track Order
              </Button>
            </div>
          </div>

          {/* Order Summary & Next Steps */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-card rounded-lg p-6 shadow-soft">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-success">Free</span>
                  ) : (
                    <span>${shipping.toFixed(2)}</span>
                  )}
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
            </div>

            {/* Next Steps */}
            <div className="bg-card rounded-lg p-6 shadow-soft">
              <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Order Confirmation</p>
                    <p className="text-xs text-muted-foreground">You'll receive an email confirmation within 5 minutes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Processing</p>
                    <p className="text-xs text-muted-foreground">We'll prepare your order within 1-2 business days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Shipping</p>
                    <p className="text-xs text-muted-foreground">Tracking information will be sent via email</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Delivery</p>
                    <p className="text-xs text-muted-foreground">Expected delivery: {orderData.estimatedDelivery}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-card rounded-lg p-6 shadow-soft">
              <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Have questions about your order? Our customer support team is here to help.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Contact Support
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(`/track-order?order=${orderNumber}`)}>
                    <Truck className="h-4 w-4 mr-2" />
                    Track Package
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}