import { useEffect, useState } from "react";
import { CheckCircle, Download, Printer, ArrowLeft, Package, Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const { format } = useCurrency();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const processPaystackCallback = async () => {
      const reference = searchParams.get("reference");
      const trxref = searchParams.get("trxref");
      const existingOrderNumber = searchParams.get("orderNumber");
      
      // If we have an existing order number, just display it
      if (existingOrderNumber) {
        setOrderNumber(existingOrderNumber);
        await loadOrderDetails(existingOrderNumber);
        setLoading(false);
        return;
      }

      // Handle Paystack callback
      if (reference || trxref) {
        setProcessingPayment(true);
        const paymentRef = reference || trxref;
        
        try {
          // Get stored order data from session
          const pendingOrderData = sessionStorage.getItem('pendingOrderData');
          if (!pendingOrderData) {
            toast({
              title: "Error",
              description: "Order data not found. Please try again.",
              variant: "destructive"
            });
            navigate('/checkout');
            return;
          }

          const orderData = JSON.parse(pendingOrderData);
          
          // Process the order with payment reference
          const { data: session } = await supabase.auth.getSession();
          const { data, error } = await supabase.functions.invoke('process-order', {
            body: {
              customer_name: `${orderData.firstName} ${orderData.lastName}`,
              customer_email: orderData.email,
              customer_phone: orderData.phone,
              shipping_address: `${orderData.address}, ${orderData.city}, ${orderData.state}, ${orderData.country} ${orderData.zipCode}`,
              payment_method: 'paystack',
              payment_reference: paymentRef,
              items: orderData.cart,
              shipping_fee: orderData.shipping_fee,
              tax_amount: orderData.tax_amount,
              discount_amount: 0,
              total_amount: orderData.total_amount,
            },
            headers: {
              Authorization: `Bearer ${session?.session?.access_token}`,
            },
          });

          if (error) {
            throw new Error(error.message);
          }

          // Clear cart and session storage
          clearCart();
          sessionStorage.removeItem('pendingOrderData');

          setOrderNumber(data.order_number);
          await loadOrderDetails(data.order_number);

          toast({
            title: "🎉 CONGRATULATIONS!",
            description: `Your order #${data.order_number} has been placed successfully!`,
          });

        } catch (error: any) {
          console.error('Payment processing error:', error);
          toast({
            title: "Payment Failed",
            description: error.message || "Payment verification failed. Please contact support.",
            variant: "destructive"
          });
          navigate('/checkout');
          return;
        } finally {
          setProcessingPayment(false);
        }
      }

      setLoading(false);
    };

    processPaystackCallback();
  }, [searchParams]);

  const loadOrderDetails = async (orderNum: string) => {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('order_number', orderNum)
        .single();

      if (!error && order) {
        setOrderDetails(order);
      }
    } catch (error) {
      console.error('Error loading order:', error);
    }
  };

  const handleDownloadReceipt = () => {
    toast({
      title: "Receipt Downloaded",
      description: "Your receipt has been downloaded successfully.",
    });
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (loading || processingPayment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {processingPayment ? "Processing Your Payment..." : "Loading Order..."}
          </h2>
          <p className="text-muted-foreground">Please wait while we confirm your order.</p>
        </div>
      </div>
    );
  }

  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6 animate-pulse">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">🎉 CONGRATULATIONS!</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your order has been successfully placed. You'll receive a confirmation email and WhatsApp message shortly.
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
                    <p><span className="font-medium">Order Date:</span> {new Date().toLocaleDateString()}</p>
                    <p><span className="font-medium">Payment Method:</span> {orderDetails?.payment_method === 'paystack' ? 'Paystack' : 'Bank Transfer'}</p>
                    <p><span className="font-medium">Payment Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        orderDetails?.payment_status === 'completed' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-warning/20 text-warning'
                      }`}>
                        {orderDetails?.payment_status || 'Pending'}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Delivery Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Estimated Delivery:</span> {estimatedDelivery}</p>
                    <p><span className="font-medium">Shipping Method:</span> Standard Shipping</p>
                    <p><span className="font-medium">Tracking:</span> Will be provided via email & WhatsApp</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Shipping Info */}
            {orderDetails && (
              <div className="bg-card rounded-lg p-6 shadow-soft">
                <h2 className="text-xl font-semibold mb-4">Customer & Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Contact Information</h3>
                    <div className="space-y-1 text-sm">
                      <p>{orderDetails.customer_name}</p>
                      <p>{orderDetails.customer_email}</p>
                      <p>{orderDetails.customer_phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <div className="space-y-1 text-sm">
                      <p>{orderDetails.shipping_address}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            {orderDetails?.order_items && (
              <div className="bg-card rounded-lg p-6 shadow-soft">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {orderDetails.order_items.map((item: any) => (
                    <div key={item.id} className="flex space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product_name}</h4>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium">{format(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                {orderDetails && (
                  <>
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{format(orderDetails.total_amount - orderDetails.shipping_fee - orderDetails.tax_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      {orderDetails.shipping_fee === 0 ? (
                        <span className="text-success">Free</span>
                      ) : (
                        <span>{format(orderDetails.shipping_fee)}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{format(orderDetails.tax_amount)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-price">{format(orderDetails.total_amount)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Order Progress */}
            <div className="bg-card rounded-lg p-6 shadow-soft">
              <h2 className="text-xl font-semibold mb-4">Order Progress</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-success rounded-full mt-1"></div>
                  <div>
                    <p className="font-medium text-sm text-success">Order Confirmed</p>
                    <p className="text-xs text-muted-foreground">Your order has been placed</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-muted-foreground rounded-full mt-1"></div>
                  <div>
                    <p className="font-medium text-sm">Processing</p>
                    <p className="text-xs text-muted-foreground">1-2 business days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-muted-foreground rounded-full mt-1"></div>
                  <div>
                    <p className="font-medium text-sm">Shipped</p>
                    <p className="text-xs text-muted-foreground">Tracking info via email</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-muted-foreground rounded-full mt-1"></div>
                  <div>
                    <p className="font-medium text-sm">Delivered</p>
                    <p className="text-xs text-muted-foreground">Expected: {estimatedDelivery}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-card rounded-lg p-6 shadow-soft">
              <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Have questions? Contact us via WhatsApp or email.
                </p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open('https://wa.me/2347069036157', '_blank')}
                  >
                    WhatsApp Support
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
