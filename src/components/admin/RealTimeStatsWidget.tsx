import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  Users, 
  Package,
  Wallet,
  RefreshCw
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface RealTimeStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  pendingPayouts: number;
  newCustomers: number;
  processingOrders: number;
  totalRevenue: number;
  totalOrders: number;
}

export function RealTimeStatsWidget() {
  const [stats, setStats] = useState<RealTimeStats>({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    pendingPayouts: 0,
    newCustomers: 0,
    processingOrders: 0,
    totalRevenue: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadStats();
    
    // Set up real-time subscription for orders
    const channel = supabase
      .channel('realtime-stats')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders' 
      }, () => {
        loadStats();
      })
      .subscribe();

    // Auto refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const loadStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get today's orders
      const { data: todayOrders, error: todayError } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', today.toISOString());

      // Get all orders stats
      const { data: allOrders } = await supabase
        .from('orders')
        .select('total_amount, order_status, payment_status');

      // Get pending seller applications (as proxy for pending payouts)
      const { data: pendingApps } = await supabase
        .from('seller_applications')
        .select('id')
        .eq('status', 'pending');

      // Get new customers today
      const { data: newUsers } = await supabase
        .from('profiles')
        .select('id')
        .gte('created_at', today.toISOString());

      // Calculate stats
      const todayOrdersCount = todayOrders?.length || 0;
      const todayRevenueSum = todayOrders?.reduce((sum, o) => sum + Number(o.total_amount || 0), 0) || 0;
      
      const pendingOrdersCount = allOrders?.filter(o => 
        o.order_status === 'pending' || o.payment_status === 'pending'
      ).length || 0;
      
      const processingOrdersCount = allOrders?.filter(o => 
        o.order_status === 'processing' || o.order_status === 'confirmed'
      ).length || 0;

      const totalRevenueSum = allOrders?.reduce((sum, o) => sum + Number(o.total_amount || 0), 0) || 0;

      setStats({
        todayOrders: todayOrdersCount,
        todayRevenue: todayRevenueSum,
        pendingOrders: pendingOrdersCount,
        pendingPayouts: pendingApps?.length || 0,
        newCustomers: newUsers?.length || 0,
        processingOrders: processingOrdersCount,
        totalRevenue: totalRevenueSum,
        totalOrders: allOrders?.length || 0,
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading real-time stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Today's Orders",
      value: stats.todayOrders,
      icon: ShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Today's Revenue",
      value: `₦${stats.todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Processing",
      value: stats.processingOrders,
      icon: Package,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "New Customers",
      value: stats.newCustomers,
      icon: Users,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      label: "Pending Applications",
      value: stats.pendingPayouts,
      icon: Wallet,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: TrendingUp,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      label: "Total Revenue",
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Real-Time Dashboard</h2>
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadStats}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">
                    {stat.label}
                  </p>
                  <p className="text-lg font-bold truncate">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
