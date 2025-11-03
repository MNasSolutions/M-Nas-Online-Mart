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
import { 
  Loader2, Package, DollarSign, ShoppingBag, Users, 
  CheckCircle, XCircle, Eye 
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { format } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalCommission: 0,
    pendingOrders: 0,
    totalSellers: 0,
    pendingApplications: 0,
    totalCustomers: 0,
  });
  const [applications, setApplications] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    checkAdminAndLoadData();
  }, [user, navigate]);

  const checkAdminAndLoadData = async () => {
    try {
      // Check if user is admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user?.id);

      const hasAdminRole = roles?.some(r => 
        r.role === "admin" || r.role === "super_admin"
      );

      if (!hasAdminRole) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await loadDashboardData();
    } catch (error: any) {
      console.error("Error checking admin status:", error);
      toast({
        title: "Error",
        description: "Failed to verify admin status",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load statistics
      const { data: ordersData } = await supabase.from("orders").select("*");
      const { data: sellers } = await supabase.from("seller_profiles").select("*");
      const { data: pendingApps } = await supabase
        .from("seller_applications")
        .select("*")
        .eq("status", "pending");

      setOrders(ordersData || []);

      if (ordersData) {
        const totalSales = ordersData.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
        const totalCommission = ordersData.reduce((sum, o) => sum + Number(o.commission_amount || 0), 0);
        const pending = ordersData.filter(o => o.status === "pending").length;
        const uniqueCustomers = new Set(ordersData.map(o => o.user_id)).size;

        setStats({
          totalSales,
          totalCommission,
          pendingOrders: pending,
          totalSellers: sellers?.length || 0,
          pendingApplications: pendingApps?.length || 0,
          totalCustomers: uniqueCustomers,
        });
      }

      // Load all seller applications
      const { data: allApplications } = await supabase
        .from("seller_applications")
        .select("*")
        .order("created_at", { ascending: false });

      setApplications(allApplications || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const handleApproveApplication = async (application: any) => {
    setActionLoading(true);
    try {
      // Create seller profile
      const { error: profileError } = await supabase
        .from("seller_profiles")
        .insert({
          user_id: application.user_id,
          business_name: application.business_name,
          brand_name: application.brand_name,
          bank_name: application.bank_name,
          account_number: application.account_number,
          application_id: application.id,
          commission_rate: 15.0,
          is_active: true,
        });

      if (profileError) throw profileError;

      // Update application status
      const { error: updateError } = await supabase
        .from("seller_applications")
        .update({ status: "approved" })
        .eq("id", application.id);

      if (updateError) throw updateError;

      // Create notification for seller
      await supabase.from("notifications").insert({
        user_id: application.user_id,
        type: "seller_approved",
        title: "Seller Application Approved!",
        message: "Congratulations! Your seller application has been approved. You can now start selling on M Nas Solutions Online Mart.",
      });

      toast({
        title: "Application Approved",
        description: "Seller profile has been created successfully",
      });

      setSelectedApplication(null);
      await loadDashboardData();
    } catch (error: any) {
      console.error("Error approving application:", error);
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve application",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectApplication = async (application: any) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      // Update application status
      const { error } = await supabase
        .from("seller_applications")
        .update({ 
          status: "rejected",
          rejection_reason: rejectionReason,
        })
        .eq("id", application.id);

      if (error) throw error;

      // Create notification for seller
      await supabase.from("notifications").insert({
        user_id: application.user_id,
        type: "seller_rejected",
        title: "Seller Application Update",
        message: `Your seller application has been reviewed. Reason: ${rejectionReason}`,
      });

      toast({
        title: "Application Rejected",
        description: "Seller has been notified",
      });

      setSelectedApplication(null);
      setRejectionReason("");
      await loadDashboardData();
    } catch (error: any) {
      console.error("Error rejecting application:", error);
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject application",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated successfully"
      });

      await loadDashboardData();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">M Nas Solutions Online Mart</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{format(stats.totalSales)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{format(stats.totalCommission)}</div>
              <p className="text-xs text-muted-foreground">15% earned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">To process</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sellers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSellers}</div>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApplications}</div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="applications">
              Seller Applications {stats.pendingApplications > 0 && `(${stats.pendingApplications})`}
            </TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="sellers">Sellers</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Seller Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Brand Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          No applications yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.business_name}</TableCell>
                          <TableCell>{app.brand_name}</TableCell>
                          <TableCell>{app.owner_full_name}</TableCell>
                          <TableCell className="capitalize">{app.product_category}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                app.status === "approved"
                                  ? "default"
                                  : app.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {app.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(app.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedApplication(app)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          No orders yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.order_number}</TableCell>
                          <TableCell>{order.customer_name}</TableCell>
                          <TableCell>{format(Number(order.total_amount))}</TableCell>
                          <TableCell>
                            <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={order.payment_status === "paid" ? "default" : "secondary"}>
                              {order.payment_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="text-sm border rounded px-2 py-1 bg-background"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
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
                <CardTitle>Seller Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Seller management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Product management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Seller Application Details</DialogTitle>
            <DialogDescription>
              Review and approve or reject seller application
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Business Name</p>
                    <p className="font-semibold">{selectedApplication.business_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Brand Name</p>
                    <p className="font-semibold">{selectedApplication.brand_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Owner Name</p>
                    <p className="font-semibold">{selectedApplication.owner_full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Product Category</p>
                    <p className="font-semibold capitalize">{selectedApplication.product_category}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Website</p>
                    <p className="font-semibold">{selectedApplication.business_website || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-semibold">{selectedApplication.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">State</p>
                    <p className="font-semibold">{selectedApplication.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-semibold">{selectedApplication.city}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Business Address</p>
                  <p className="font-semibold">{selectedApplication.business_address}</p>
                </div>
              </div>

              {/* Banking Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Banking Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Bank Name</p>
                    <p className="font-semibold">{selectedApplication.bank_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Number</p>
                    <p className="font-semibold">{selectedApplication.account_number}</p>
                  </div>
                </div>
              </div>

              {/* Commission Agreement */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Commission Agreement</h3>
                <p className="text-sm">
                  Agreed to 15% commission: {" "}
                  <Badge variant={selectedApplication.agreed_to_commission ? "default" : "destructive"}>
                    {selectedApplication.agreed_to_commission ? "Yes" : "No"}
                  </Badge>
                </p>
              </div>

              {/* Documents */}
              {(selectedApplication.business_logo_url || selectedApplication.id_card_url) && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Documents</h3>
                  <div className="flex gap-4">
                    {selectedApplication.business_logo_url && (
                      <Button variant="outline" asChild>
                        <a href={selectedApplication.business_logo_url} target="_blank" rel="noopener noreferrer">
                          View Business Logo/ID
                        </a>
                      </Button>
                    )}
                    {selectedApplication.id_card_url && (
                      <Button variant="outline" asChild>
                        <a href={selectedApplication.id_card_url} target="_blank" rel="noopener noreferrer">
                          View Additional Document
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedApplication.status === "pending" && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex gap-4">
                    <Button
                      className="flex-1"
                      onClick={() => handleApproveApplication(selectedApplication)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Approve Application
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleRejectApplication(selectedApplication)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Reject Application
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rejectionReason">Rejection Reason (required if rejecting)</Label>
                    <Textarea
                      id="rejectionReason"
                      placeholder="Provide a reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {selectedApplication.status === "rejected" && selectedApplication.rejection_reason && (
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="text-lg font-semibold">Rejection Reason</h3>
                  <p className="text-sm">{selectedApplication.rejection_reason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
