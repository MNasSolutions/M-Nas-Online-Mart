import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Package, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalCommission: 0,
    totalEarnings: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadSellerData();
  }, [user, navigate]);

  const loadSellerData = async () => {
    try {
      // Check if user is a seller
      const { data: profile, error: profileError } = await supabase
        .from("seller_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile) {
        toast({
          title: "Access Denied",
          description: "You are not registered as a seller",
          variant: "destructive",
        });
        navigate("/seller-registration");
        return;
      }

      setSellerProfile(profile);

      // Load statistics
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("seller_id", profile.id);

      if (orders) {
        const totalSales = orders.reduce((sum, order) => sum + Number(order.seller_amount || 0), 0);
        const totalCommission = orders.reduce((sum, order) => sum + Number(order.commission_amount || 0), 0);
        const pendingOrders = orders.filter(o => o.status === "pending").length;

        setStats({
          totalSales: profile.total_sales || 0,
          totalCommission: profile.total_commission || 0,
          totalEarnings: totalSales,
          pendingOrders,
        });
      }
    } catch (error: any) {
      console.error("Error loading seller data:", error);
      toast({
        title: "Error",
        description: "Failed to load seller dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {sellerProfile?.brand_name}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time sales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">After 15% commission</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission Paid</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalCommission.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">15% platform fee</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Product management coming soon...</p>
                <Button className="mt-4">Add New Product</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Order management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Earnings & Commissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded">
                    <div>
                      <p className="font-semibold">Commission Rate</p>
                      <p className="text-sm text-muted-foreground">Platform fee on each sale</p>
                    </div>
                    <p className="text-2xl font-bold">{sellerProfile?.commission_rate}%</p>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded">
                    <div>
                      <p className="font-semibold">Bank Account</p>
                      <p className="text-sm text-muted-foreground">
                        {sellerProfile?.bank_name} - {sellerProfile?.account_number}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Seller Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Business Name</p>
                    <p className="font-semibold">{sellerProfile?.business_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Brand Name</p>
                    <p className="font-semibold">{sellerProfile?.brand_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold">
                      {sellerProfile?.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
