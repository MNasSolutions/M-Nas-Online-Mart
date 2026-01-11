import { useState } from "react";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  exportToCSV, 
  userExportColumns, 
  orderExportColumns, 
  salesExportColumns,
  sellerExportColumns 
} from "@/utils/exportData";

export function ExportButtons() {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExportUsers = async () => {
    setExporting('users');
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      const rolesMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);

      const usersWithRoles = profiles?.map(p => ({
        ...p,
        role: rolesMap.get(p.id) || 'user'
      })) || [];

      exportToCSV(usersWithRoles, userExportColumns, `users-export-${Date.now()}`);
      toast.success(`Exported ${usersWithRoles.length} users`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export users');
    } finally {
      setExporting(null);
    }
  };

  const handleExportOrders = async () => {
    setExporting('orders');
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      exportToCSV(orders || [], orderExportColumns, `orders-export-${Date.now()}`);
      toast.success(`Exported ${orders?.length || 0} orders`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export orders');
    } finally {
      setExporting(null);
    }
  };

  const handleExportSales = async () => {
    setExporting('sales');
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;

      exportToCSV(orders || [], salesExportColumns, `sales-report-${Date.now()}`);
      toast.success(`Exported ${orders?.length || 0} sales records`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export sales');
    } finally {
      setExporting(null);
    }
  };

  const handleExportSellers = async () => {
    setExporting('sellers');
    try {
      const { data: sellers, error: sellersError } = await supabase
        .from('seller_profiles')
        .select(`
          *,
          seller_applications!seller_profiles_application_id_fkey (
            owner_full_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (sellersError) throw sellersError;

      const exportData = sellers?.map(s => ({
        business_name: s.business_name,
        brand_name: s.brand_name,
        owner_name: s.seller_applications?.owner_full_name || 'N/A',
        email: s.seller_applications?.email || 'N/A',
        phone: s.seller_applications?.phone || 'N/A',
        total_sales: s.total_sales,
        commission_rate: s.commission_rate,
        is_active: s.is_active,
        created_at: s.created_at,
      })) || [];

      exportToCSV(exportData, sellerExportColumns, `sellers-export-${Date.now()}`);
      toast.success(`Exported ${exportData.length} sellers`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export sellers');
    } finally {
      setExporting(null);
    }
  };

  const handleExportAll = async () => {
    setExporting('all');
    try {
      await handleExportUsers();
      await handleExportOrders();
      await handleExportSales();
      await handleExportSellers();
      toast.success('All reports exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export all reports');
    } finally {
      setExporting(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={!!exporting}>
          {exporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export Reports
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export as CSV</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportUsers} disabled={!!exporting}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Users Report
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportOrders} disabled={!!exporting}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Orders Report
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportSales} disabled={!!exporting}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Sales Report
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportSellers} disabled={!!exporting}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Sellers Report
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportAll} disabled={!!exporting}>
          <Download className="h-4 w-4 mr-2" />
          Export All
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
