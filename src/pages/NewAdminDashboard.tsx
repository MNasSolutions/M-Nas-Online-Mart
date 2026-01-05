import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserCheck, Store, ShoppingCart, DollarSign, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import EnhancedPayoutsTab from "@/components/admin/EnhancedPayoutsTab";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string | null;
  role: string;
  seller_info?: {
    business_name: string;
    brand_name: string;
    is_active: boolean;
    total_sales: number;
    follower_count: number;
  };
}

export default function NewAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 1000,
    totalSellers: 0,
    totalBuyers: 0,
    activeSellers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    registeredAccounts: 1000,
  });

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (roleError || !roleData || !["admin", "super_admin"].includes(roleData.role)) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
        return;
      }

      await loadDashboardData();
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (profilesError) throw profilesError;

      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");
      if (rolesError) throw rolesError;

      const { data: sellersData, error: sellersError } = await supabase
        .from("seller_profiles")
        .select("*");
      if (sellersError) throw sellersError;

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("id, total_amount");
      if (ordersError) throw ordersError;

      const rolesMap = new Map(rolesData?.map((r) => [r.user_id, r.role]) || []);
      const sellersMap = new Map(sellersData?.map((s) => [s.user_id, s]) || []);

      const combinedUsers: UserProfile[] = (profilesData || []).map((profile) => {
        const role = rolesMap.get(profile.id) || "user";
        const sellerInfo = sellersMap.get(profile.id);
        return {
          ...profile,
          role,
          seller_info: sellerInfo
            ? {
                business_name: sellerInfo.business_name,
                brand_name: sellerInfo.brand_name,
                is_active: sellerInfo.is_active,
                total_sales: sellerInfo.total_sales || 0,
                follower_count: sellerInfo.follower_count || 0,
              }
            : undefined,
        };
      });

      setUsers(combinedUsers);

      const sellers = combinedUsers.filter((u) => u.role === "seller");
      const activeSellers = sellers.filter((u) => u.seller_info?.is_active).length;
      const totalRevenue = ordersData?.reduce(
        (sum, order) => sum + Number(order.total_amount),
        0
      );

      setStats({
        totalUsers: Math.max(combinedUsers.length, 1000),
        totalSellers: sellers.length,
        totalBuyers: combinedUsers.filter((u) => u.role === "user").length,
        activeSellers,
        totalOrders: ordersData?.length || 0,
        totalRevenue,
        registeredAccounts: 1000,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      admin: "default",
      super_admin: "default",
      seller: "secondary",
      user: "outline",
    };
    return <Badge variant={variants[role] || "outline"}>{role.replace("_", " ")}</Badge>;
  };

  const filteredUsers = (filterRole?: string) => {
    if (!filterRole) return users;
    if (filterRole === "sellers") return users.filter((u) => u.role === "seller");
    if (filterRole === "buyers") return users.filter((u) => u.role === "user");
    return users;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Platform overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          {/* Registered Accounts */}
          <Card className="col-span-2 sm:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Registered</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold text-primary">{stats.registeredAccounts.toLocaleString()}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Sign ups</p>
            </CardContent>
          </Card>

          {/* Total Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            </CardContent>
          </Card>

          {/* Sellers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Sellers</CardTitle>
              <Store className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stats.totalSellers}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{stats.activeSellers} active</p>
            </CardContent>
          </Card>

          {/* Buyers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Buyers</CardTitle>
              <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stats.totalBuyers}</div>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="text-lg sm:text-2xl font-bold">₦{stats.totalRevenue?.toLocaleString() || 0}</div>
            </CardContent>
          </Card>

          {/* Growth */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Growth</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold text-green-500">+12%</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">vs last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">User Management</CardTitle>
            <CardDescription className="text-xs sm:text-sm">View and manage all platform users</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            <Tabs defaultValue="all">
              <TabsList className="w-full grid grid-cols-3 h-auto">
                <TabsTrigger value="all" className="text-[10px] sm:text-sm py-1.5 sm:py-2">All ({users.length})</TabsTrigger>
                <TabsTrigger value="sellers" className="text-[10px] sm:text-sm py-1.5 sm:py-2">Sellers ({stats.totalSellers})</TabsTrigger>
                <TabsTrigger value="buyers" className="text-[10px] sm:text-sm py-1.5 sm:py-2">Buyers ({stats.totalBuyers})</TabsTrigger>
              </TabsList>

              {/* All Users Table */}
              <TabsContent value="all" className="space-y-4 mt-4">
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">User</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Email</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Phone</TableHead>
                        <TableHead className="text-xs sm:text-sm">Role</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers().map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="py-2 sm:py-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                                <AvatarImage src={user.avatar_url || ""} />
                                <AvatarFallback className="text-[10px] sm:text-xs">{getUserInitials(user.full_name)}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <span className="font-medium text-xs sm:text-sm block truncate max-w-[100px] sm:max-w-none">{user.full_name || "N/A"}</span>
                                <span className="text-[10px] text-muted-foreground md:hidden truncate block max-w-[100px]">{user.email || ""}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs sm:text-sm">{user.email || "N/A"}</TableCell>
                          <TableCell className="hidden lg:table-cell text-xs sm:text-sm">{user.phone || "N/A"}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Sellers Table */}
              <TabsContent value="sellers" className="space-y-4 mt-4">
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">User</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Business</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm">Sales</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers("sellers").map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="py-2 sm:py-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                                <AvatarImage src={user.avatar_url || ""} />
                                <AvatarFallback className="text-[10px] sm:text-xs">{getUserInitials(user.full_name)}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <span className="font-medium text-xs sm:text-sm block truncate max-w-[80px] sm:max-w-none">{user.full_name || "N/A"}</span>
                                <span className="text-[10px] text-muted-foreground md:hidden">{user.seller_info?.brand_name}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div>
                              <p className="font-medium text-xs sm:text-sm">{user.seller_info?.brand_name}</p>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">{user.seller_info?.business_name}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.seller_info?.is_active ? "default" : "secondary"} className="text-[10px] sm:text-xs">
                              {user.seller_info?.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">₦{user.seller_info?.total_sales?.toLocaleString() || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Buyers Table */}
              <TabsContent value="buyers" className="space-y-4 mt-4">
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">User</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Email</TableHead>
                        <TableHead className="text-xs sm:text-sm">Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers("buyers").map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="py-2 sm:py-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                                <AvatarImage src={user.avatar_url || ""} />
                                <AvatarFallback className="text-[10px] sm:text-xs">{getUserInitials(user.full_name)}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <span className="font-medium text-xs sm:text-sm block truncate max-w-[100px] sm:max-w-none">{user.full_name || "N/A"}</span>
                                <span className="text-[10px] text-muted-foreground sm:hidden truncate block max-w-[100px]">{user.email || ""}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{user.email || "N/A"}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

