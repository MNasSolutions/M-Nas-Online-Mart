import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, UserCheck, Store, Mail, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function UsersManagementTab() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);

  useEffect(() => {
    loadUsersData();
  }, []);

  const loadUsersData = async () => {
    try {
      setLoading(true);

      // Load profiles
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      setProfiles(profilesData || []);

      // Load user roles
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("*");

      setUserRoles(rolesData || []);

      // Load seller profiles
      const { data: sellersData } = await supabase
        .from("seller_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      setSellers(sellersData || []);

      // Combine data
      const combinedUsers = profilesData?.map((profile) => {
        const roles = rolesData?.filter((r) => r.user_id === profile.id).map((r) => r.role) || [];
        const sellerProfile = sellersData?.find((s) => s.user_id === profile.id);
        
        return {
          ...profile,
          roles,
          isSeller: !!sellerProfile,
          sellerProfile,
        };
      });

      setUsers(combinedUsers || []);
    } catch (error) {
      console.error("Error loading users data:", error);
      toast({
        title: "Error",
        description: "Failed to load users data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sellers</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellers.length}</div>
            <p className="text-xs text-muted-foreground">Active sellers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buyers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length - sellers.length}</div>
            <p className="text-xs text-muted-foreground">Regular customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="sellers">Sellers Only</TabsTrigger>
          <TabsTrigger value="buyers">Buyers Only</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.full_name || "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {user.email || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {user.phone || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {user.roles.length === 0 ? (
                              <Badge variant="secondary">user</Badge>
                            ) : (
                              user.roles.map((role: string) => (
                                <Badge
                                  key={role}
                                  variant={
                                    role === "admin" || role === "super_admin"
                                      ? "default"
                                      : role === "seller"
                                      ? "secondary"
                                      : "outline"
                                  }
                                >
                                  {role}
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isSeller ? "default" : "secondary"}>
                            {user.isSeller ? "Seller" : "Buyer"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sellers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seller Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Brand Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Commission Rate</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>Followers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        No sellers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    sellers.map((seller) => {
                      const profile = profiles.find((p) => p.id === seller.user_id);
                      return (
                        <TableRow key={seller.id}>
                          <TableCell className="font-medium">{seller.business_name}</TableCell>
                          <TableCell>{seller.brand_name}</TableCell>
                          <TableCell>{profile?.full_name || "N/A"}</TableCell>
                          <TableCell>{seller.commission_rate}%</TableCell>
                          <TableCell>₦{Number(seller.total_sales || 0).toLocaleString()}</TableCell>
                          <TableCell>{seller.follower_count || 0}</TableCell>
                          <TableCell>
                            <Badge variant={seller.is_active ? "default" : "destructive"}>
                              {seller.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(seller.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buyers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Buyer Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.filter((u) => !u.isSeller).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No buyers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users
                      .filter((u) => !u.isSeller)
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.full_name || "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {user.email || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {user.phone || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
