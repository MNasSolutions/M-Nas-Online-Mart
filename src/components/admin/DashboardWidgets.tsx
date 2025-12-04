import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Store, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Package, 
  AlertTriangle,
  Activity
} from "lucide-react";

interface StatsData {
  totalUsers: number;
  totalSellers: number;
  activeSellers: number;
  totalBuyers: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
  payoutRequests: number;
}

interface DashboardWidgetsProps {
  stats: StatsData;
}

export default function DashboardWidgets({ stats }: DashboardWidgetsProps) {
  const widgets = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "hsl(200, 100%, 50%)",
      bgColor: "hsl(200, 100%, 50%, 0.1)",
    },
    {
      title: "Active Sellers",
      value: `${stats.activeSellers}/${stats.totalSellers}`,
      icon: Store,
      color: "hsl(142, 76%, 36%)",
      bgColor: "hsl(142, 76%, 36%, 0.1)",
    },
    {
      title: "Today's Orders",
      value: stats.pendingOrders,
      icon: ShoppingCart,
      color: "hsl(25, 95%, 53%)",
      bgColor: "hsl(25, 95%, 53%, 0.1)",
    },
    {
      title: "Today's Sales",
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "hsl(142, 76%, 36%)",
      bgColor: "hsl(142, 76%, 36%, 0.1)",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: TrendingUp,
      color: "hsl(185, 84%, 45%)",
      bgColor: "hsl(185, 84%, 45%, 0.1)",
    },
    {
      title: "Active Products",
      value: stats.totalProducts,
      icon: Package,
      color: "hsl(270, 70%, 55%)",
      bgColor: "hsl(270, 70%, 55%, 0.1)",
    },
    {
      title: "Low Stock Alert",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      color: "hsl(38, 92%, 50%)",
      bgColor: "hsl(38, 92%, 50%, 0.1)",
    },
    {
      title: "Payout Requests",
      value: stats.payoutRequests,
      icon: Activity,
      color: "hsl(0, 84%, 60%)",
      bgColor: "hsl(0, 84%, 60%, 0.1)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {widgets.map((widget, index) => (
        <Card 
          key={index} 
          className="bg-[hsl(224,14%,7%)] border-[hsl(224,14%,15%)] hover:border-[hsl(224,14%,20%)] transition-all duration-300 hover:shadow-[0_0_20px_hsl(0,0%,0%,0.3)]"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(220,9%,65%)]">
              {widget.title}
            </CardTitle>
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: widget.bgColor }}
            >
              <widget.icon 
                className="h-4 w-4" 
                style={{ color: widget.color }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className="text-2xl font-bold"
              style={{ color: widget.color }}
            >
              {widget.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
