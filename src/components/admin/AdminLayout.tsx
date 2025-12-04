import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "./AdminSidebar";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
      <AdminSidebar />
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
