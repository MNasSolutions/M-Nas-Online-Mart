import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ban, Check, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useCurrency } from "@/contexts/CurrencyContext";

export function SellerManagementTab() {
  const { toast } = useToast();
  const { format } = useCurrency();
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    try {
      const { data, error } = await supabase
        .from("seller_profiles")
        .select(`
          *,
          seller_subscriptions(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSellers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSellerStatus = async (sellerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("seller_profiles")
        .update({ is_active: !currentStatus })
        .eq("id", sellerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Seller ${!currentStatus ? "activated" : "suspended"}`,
      });

      loadSellers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seller Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Brand Name</TableHead>
              <TableHead>Total Sales</TableHead>
              <TableHead>Commission Paid</TableHead>
              <TableHead>Followers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No sellers yet
                </TableCell>
              </TableRow>
            ) : (
              sellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell className="font-medium">{seller.business_name}</TableCell>
                  <TableCell>{seller.brand_name}</TableCell>
                  <TableCell>{format(seller.total_sales || 0)}</TableCell>
                  <TableCell>{format(seller.total_commission || 0)}</TableCell>
                  <TableCell>{seller.follower_count || 0}</TableCell>
                  <TableCell>
                    <Badge variant={seller.is_active ? "default" : "destructive"}>
                      {seller.is_active ? "Active" : "Suspended"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={seller.is_active}
                        onCheckedChange={() => toggleSellerStatus(seller.id, seller.is_active)}
                      />
                      <span className="text-xs text-muted-foreground">
                        {seller.is_active ? "Active" : "Suspended"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
