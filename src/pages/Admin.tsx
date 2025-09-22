import { useState } from "react";
import { 
  BarChart3, 
  ShoppingBag, 
  Users, 
  Package, 
  DollarSign,
  TrendingUp,
  Plus,
  MoreHorizontal,
  Eye,
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger 
} from "@/components/ui/sidebar";

// Mock data for dashboard
const stats = [
  { 
    title: "Total Revenue", 
    value: "$54,231", 
    change: "+12.5%", 
    trend: "up", 
    icon: DollarSign 
  },
  { 
    title: "Orders", 
    value: "1,429", 
    change: "+8.2%", 
    trend: "up", 
    icon: ShoppingBag 
  },
  { 
    title: "Customers", 
    value: "892", 
    change: "+4.1%", 
    trend: "up", 
    icon: Users 
  },
  { 
    title: "Products", 
    value: "2,145", 
    change: "+2.7%", 
    trend: "up", 
    icon: Package 
  },
];

const recentOrders = [
  { id: "#3210", customer: "John Doe", amount: "$245.00", status: "Completed", date: "2024-01-15" },
  { id: "#3209", customer: "Jane Smith", amount: "$189.99", status: "Processing", date: "2024-01-15" },
  { id: "#3208", customer: "Mike Johnson", amount: "$67.50", status: "Shipped", date: "2024-01-14" },
  { id: "#3207", customer: "Sarah Wilson", amount: "$324.99", status: "Completed", date: "2024-01-14" },
];

function AdminSidebar() {
  const menuItems = [
    { title: "Dashboard", icon: BarChart3, active: true },
    { title: "Products", icon: Package },
    { title: "Orders", icon: ShoppingBag },
    { title: "Customers", icon: Users },
    { title: "Analytics", icon: TrendingUp },
  ];

  return (
    <Sidebar className="w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
              ShopHub Admin
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={item.active ? "bg-primary text-primary-foreground" : ""}>
                    <a href="#" className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const Admin = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <AdminSidebar />
        
        <main className="flex-1">
          {/* Header */}
          <header className="border-b bg-background px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="cta">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-6 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={stat.title} className="animate-fade-in shadow-soft hover:shadow-medium transition-all duration-200" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-success">
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="space-y-1">
                          <div className="font-medium">{order.id}</div>
                          <div className="text-sm text-muted-foreground">{order.customer}</div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="font-medium">{order.amount}</div>
                          <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                            order.status === 'Completed' ? 'bg-success/10 text-success' :
                            order.status === 'Processing' ? 'bg-warning/10 text-warning' :
                            'bg-primary/10 text-primary'
                          }`}>
                            {order.status}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Best selling items this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Wireless Headphones", sales: 234, revenue: "$18,720" },
                      { name: "Smart Watch", sales: 189, revenue: "$15,120" },
                      { name: "Laptop Stand", sales: 156, revenue: "$9,360" },
                      { name: "USB-C Cable", sales: 298, revenue: "$5,960" },
                    ].map((product, index) => (
                      <div key={product.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="space-y-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.sales} sales</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-price">{product.revenue}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used admin tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Plus className="h-6 w-6" />
                    <span>Add Product</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Eye className="h-6 w-6" />
                    <span>View Orders</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Edit className="h-6 w-6" />
                    <span>Manage Inventory</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;