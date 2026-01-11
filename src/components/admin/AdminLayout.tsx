import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "./AdminSidebar";
import { AdminNotificationsCenter } from "./AdminNotificationsCenter";
import { toast } from "sonner";
import { Loader2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (authLoading) return;
      
      if (!user) {
        navigate('/admin/login');
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

        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin access:', error);
        navigate('/');
      } finally {
        setCheckingRole(false);
      }
    };

    checkAdminAccess();
  }, [user, authLoading, navigate]);

  if (authLoading || checkingRole) {
    return (
      <div className="min-h-screen bg-[hsl(224,14%,4%)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[hsl(200,100%,50%)] animate-spin mx-auto" />
          <p className="mt-4 text-[hsl(220,9%,65%)]">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[hsl(224,14%,4%)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[hsl(224,14%,7%)] border-b border-[hsl(224,14%,15%)] flex items-center justify-between px-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-[hsl(224,14%,7%)] border-[hsl(224,14%,15%)]">
            <AdminSidebar />
          </SheetContent>
        </Sheet>
        
        <span className="font-bold text-white">M Nas Admin</span>
        
        <AdminNotificationsCenter />
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
