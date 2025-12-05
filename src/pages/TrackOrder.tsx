import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Package, Search, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TrackingMap from "@/components/TrackingMap";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import OrderTrackingProgress from "@/components/order/OrderTrackingProgress";

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [trackingInput, setTrackingInput] = useState(searchParams.get("token") || searchParams.get("order") || "");
  const [order, setOrder] = useState<any>(null);
  const [tracking, setTracking] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { format } = useCurrency();

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to track your orders",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, authLoading, navigate, toast]);

  const handleTrackOrder = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!trackingInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order number or tracking token",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Try to find by order number first, then by tracking token
      let orderData = null;

      // Check if input looks like an order number
      if (trackingInput.startsWith('ORD-')) {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("order_number", trackingInput.trim())
          .eq("user_id", user.id)
          .maybeSingle();

        if (!error) orderData = data;
      }

      // If not found, try tracking token
      if (!orderData) {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("tracking_token", trackingInput.trim())
          .eq("user_id", user.id)
          .maybeSingle();

        if (!error) orderData = data;
      }

      if (!orderData) {
        toast({
          title: "Order not found",
          description: "No order found with this tracking information",
          variant: "destructive",
        });
        setOrder(null);
        setTracking([]);
        return;
      }

      setOrder(orderData);

      const { data: trackingData, error: trackingError } = await supabase
        .from("order_tracking")
        .select("*")
        .eq("order_id", orderData.id)
        .order("created_at", { ascending: false });

      if (trackingError) throw trackingError;

      setTracking(trackingData || []);
    } catch (error: any) {
      console.error("Error tracking order:", error);
      toast({
        title: "Error",
        description: "Failed to track order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((searchParams.get("token") || searchParams.get("order")) && user) {
      handleTrackOrder();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
            <p className="text-muted-foreground">
              Enter your order number or tracking token to see the latest status
            </p>
          </div>

          {/* Search Card */}
          <Card className="mb-8 shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={handleTrackOrder} className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter order number (e.g., ORD-1234...) or tracking token"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Track
                </Button>
              </form>
            </CardContent>
          </Card>

          {order ? (
            <div className="space-y-8">
              {/* Order Progress */}
              <Card className="shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <CardTitle>Order Status</CardTitle>
                  <CardDescription>Order #{order.order_number}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <OrderTrackingProgress 
                    currentStatus={order.order_status || order.status} 
                    trackingHistory={tracking}
                  />
                </CardContent>
              </Card>

              {/* Order Details */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                      <p className="font-semibold">{order.order_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                      <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                      <p className="font-semibold text-primary">{format(order.total_amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.payment_status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {order.payment_status || 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                    <p className="font-medium">{order.shipping_address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Map */}
              {tracking.some(t => t.latitude && t.longitude) && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Live Tracking</CardTitle>
                    <CardDescription>Real-time location of your package</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] rounded-lg overflow-hidden">
                      <TrackingMap trackingData={tracking} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Support Section */}
              <Card className="shadow-lg bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Need Help?</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        If you have any questions about your order, please contact our support team.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('https://wa.me/2347069036157', '_blank')}
                      >
                        Contact Support via WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            !loading && trackingInput && (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Order Found</h3>
                  <p className="text-muted-foreground">
                    We couldn't find an order with the provided tracking information.
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
