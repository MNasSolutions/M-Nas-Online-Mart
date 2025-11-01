import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Package, MapPin, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TrackingMap from "@/components/TrackingMap";
import { useAuth } from "@/contexts/AuthContext";

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [trackingToken, setTrackingToken] = useState(searchParams.get("token") || "");
  const [order, setOrder] = useState<any>(null);
  const [tracking, setTracking] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  // Redirect to login if not authenticated
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
      toast({
        title: "Authentication Required",
        description: "Please log in to track your orders",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!trackingToken.trim()) {
      toast({
        title: "Error",
        description: "Please enter a tracking token",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Use tracking_token instead of order_number for secure lookup
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("tracking_token", trackingToken.trim())
        .eq("user_id", user.id) // Verify user owns the order
        .maybeSingle();

      if (orderError) throw orderError;

      if (!orderData) {
        toast({
          title: "Order not found",
          description: "No order found with this tracking token or you don't have access to it",
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
        .order("created_at", { ascending: true });

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
    if (searchParams.get("token") && user) {
      handleTrackOrder();
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "in_transit":
        return <Package className="h-6 w-6 text-blue-500" />;
      case "pending":
        return <Clock className="h-6 w-6 text-yellow-500" />;
      default:
        return <MapPin className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Tracking Token</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrackOrder} className="flex gap-4">
                <Input
                  placeholder="Enter your tracking token from order confirmation email"
                  value={trackingToken}
                  onChange={(e) => setTrackingToken(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || authLoading}>
                  {loading ? "Tracking..." : "Track Order"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {order && (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order Number</p>
                      <p className="font-semibold">{order.order_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold capitalize">{order.status.replace("_", " ")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-semibold">${order.total_amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Status</p>
                      <p className="font-semibold capitalize">{order.payment_status}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Shipping Address</p>
                    <p className="font-semibold">{order.shipping_address}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Tracking Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <TrackingMap trackingData={tracking} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tracking History</CardTitle>
                </CardHeader>
                <CardContent>
                  {tracking.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No tracking information available yet
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {tracking.map((item, index) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            {getStatusIcon(item.status)}
                            {index < tracking.length - 1 && (
                              <div className="w-0.5 h-16 bg-border mt-2" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold capitalize">
                              {item.status.replace("_", " ")}
                            </p>
                            {item.location && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {item.location}
                              </p>
                            )}
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.description}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(item.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
