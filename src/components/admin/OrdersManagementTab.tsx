import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, Truck, CheckCircle, XCircle, Package, Clock } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  shipping_address: string;
}

export default function OrdersManagementTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled") => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success(`Order status updated to ${newStatus}`);
      loadOrders();
    } catch (error: any) {
      toast.error('Failed to update order status', { description: error.message });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: React.ReactNode }> = {
      pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: <Clock className="w-3 h-3" /> },
      confirmed: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: <CheckCircle className="w-3 h-3" /> },
      processing: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: <Package className="w-3 h-3" /> },
      shipped: { color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30", icon: <Truck className="w-3 h-3" /> },
      delivered: { color: "bg-green-500/20 text-green-400 border-green-500/30", icon: <CheckCircle className="w-3 h-3" /> },
      cancelled: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: <XCircle className="w-3 h-3" /> },
    };
    const variant = variants[status] || variants.pending;
    return (
      <Badge className={`${variant.color} border flex items-center gap-1`}>
        {variant.icon}
        {status}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-400",
      completed: "bg-green-500/20 text-green-400",
      failed: "bg-red-500/20 text-red-400",
      processing: "bg-blue-500/20 text-blue-400",
    };
    return <Badge className={colors[status] || colors.pending}>{status}</Badge>;
  };

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.order_status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(200,100%,50%)]"></div>
      </div>
    );
  }

  return (
    <Card className="bg-[hsl(224,14%,7%)] border-[hsl(224,14%,15%)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Orders Management</CardTitle>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-[hsl(224,14%,10%)] border-[hsl(224,14%,20%)] text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-[hsl(224,14%,10%)] border-[hsl(224,14%,20%)]">
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-[hsl(224,14%,15%)] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(224,14%,15%)] hover:bg-[hsl(224,14%,10%)]">
                <TableHead className="text-[hsl(220,9%,65%)]">Order #</TableHead>
                <TableHead className="text-[hsl(220,9%,65%)]">Customer</TableHead>
                <TableHead className="text-[hsl(220,9%,65%)]">Amount</TableHead>
                <TableHead className="text-[hsl(220,9%,65%)]">Payment</TableHead>
                <TableHead className="text-[hsl(220,9%,65%)]">Status</TableHead>
                <TableHead className="text-[hsl(220,9%,65%)]">Date</TableHead>
                <TableHead className="text-[hsl(220,9%,65%)]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-[hsl(224,14%,15%)] hover:bg-[hsl(224,14%,10%)]">
                  <TableCell className="text-white font-medium">{order.order_number}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-white font-medium">{order.customer_name}</p>
                      <p className="text-[hsl(220,9%,55%)] text-sm">{order.customer_email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-[hsl(142,76%,45%)] font-semibold">
                    ₦{order.total_amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getPaymentBadge(order.payment_status)}
                      <p className="text-xs text-[hsl(220,9%,55%)]">{order.payment_method}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.order_status || 'pending')}</TableCell>
                  <TableCell className="text-[hsl(220,9%,65%)]">
                    {format(new Date(order.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Select
                        value={order.order_status || 'pending'}
                        onValueChange={(value) => updateOrderStatus(order.id, value as "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled")}
                      >
                        <SelectTrigger className="w-32 h-8 bg-[hsl(224,14%,12%)] border-[hsl(224,14%,20%)] text-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[hsl(224,14%,10%)] border-[hsl(224,14%,20%)]">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[hsl(200,100%,50%)]">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-[hsl(220,9%,55%)]">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
