import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserCheck, Store, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import {AdminLayout} from "@/components/admin/AdminLayout";
import DashboardWidgets from "@/components/admin/DashboardWidgets";
import OrdersManagementTab from "@/components/admin/OrdersManagementTab";
import PayoutsManagementTab from "@/components/admin/PayoutsManagementTab";

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
    totalUsers: 0,
    totalSellers: 0,
    totalBuyers: 0,
    activeSellers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError || !roleData || !['admin', 'super_admin'].includes(roleData.role)) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
        return;
      }

      await loadDashboardData();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Load all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Load all seller profiles
      const { data: sellersData, error: sellersError } = await supabase
        .from('seller_profiles')
        .select('*');

      if (sellersError) throw sellersError;

      // Load orders stats
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_amount');

      if (ordersError) throw ordersError;

      // Combine data
      const rolesMap = new Map(rolesData?.map(r => [r.user_id, r.role]) || []);
      const sellersMap = new Map(sellersData?.map(s => [s.user_id, s]) || []);

      const combinedUsers: UserProfile[] = (profilesData || []).map(profile => {
        const role = rolesMap.get(profile.id) || 'user';
        const sellerInfo = sellersMap.get(profile.id);

        return {
          ...profile,
          role,
          seller_info: sellerInfo ? {
            business_name: sellerInfo.business_name,
            brand_name: sellerInfo.brand_name,
            is_active: sellerInfo.is_active,
            total_sales: sellerInfo.total_sales || 0,
            follower_count: sellerInfo.follower_count || 0,
          } : undefined,
        };
      });

      setUsers(combinedUsers);

      // Calculate stats
      const sellers = combinedUsers.filter(u => u.role === 'seller');
      const activeSellers = sellers.filter(u => u.seller_info?.is_active).length;
      const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      setStats({
        totalUsers: combinedUsers.length,
        totalSellers: sellers.length,
        totalBuyers: combinedUsers.filter(u => u.role === 'user').length,
        activeSellers,
        totalOrders: ordersData?.length || 0,
        totalRevenue,
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      admin: "default",
      super_admin: "default",
      seller: "secondary",
      user: "outline",
    };
    return <Badge variant={variants[role] || "outline"}>{role.replace('_', ' ')}</Badge>;
  };

  const filteredUsers = (filterRole?: string) => {
    if (!filterRole) return users;
    if (filterRole === 'sellers') return users.filter(u => u.role === 'seller');
    if (filterRole === 'buyers') return users.filter(u => u.role === 'user');
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
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-[hsl(220,9%,65%)]">Platform overview and management</p>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sellers</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSellers}</div>
            <p className="text-xs text-muted-foreground">{stats.activeSellers} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buyers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBuyers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage all platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
              <TabsTrigger value="sellers">Sellers ({stats.totalSellers})</TabsTrigger>
              <TabsTrigger value="buyers">Buyers ({stats.totalBuyers})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Seller Info</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers().map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url || ''} />
                            <AvatarFallback>{getUserInitials(user.full_name)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.full_name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>{user.phone || 'N/A'}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {user.seller_info ? (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{user.seller_info.brand_name}</p>
                            <p className="text-xs text-muted-foreground">{user.seller_info.business_name}</p>
                            <div className="flex gap-2">
                              <Badge variant={user.seller_info.is_active ? "default" : "secondary"} className="text-xs">
                                {user.seller_info.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              <span className="text-xs">₦{user.seller_info.total_sales?.toLocaleString() || 0}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="sellers" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Followers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers('sellers').map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url || ''} />
                            <AvatarFallback>{getUserInitials(user.full_name)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.full_name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.seller_info?.brand_name}</p>
                          <p className="text-xs text-muted-foreground">{user.seller_info?.business_name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.seller_info?.is_active ? "default" : "secondary"}>
                          {user.seller_info?.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>₦{user.seller_info?.total_sales?.toLocaleString() || 0}</TableCell>
                      <TableCell>{user.seller_info?.follower_count || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="buyers" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers('buyers').map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url || ''} />
                            <AvatarFallback>{getUserInitials(user.full_name)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.full_name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>{user.phone || 'N/A'}</TableCell>
                      <TableCell>
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
