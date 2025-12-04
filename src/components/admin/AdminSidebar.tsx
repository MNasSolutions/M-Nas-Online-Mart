import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Store,
  Package,
  Plus,
  FolderTree,
  Tags,
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  CreditCard,
  Receipt,
  Wallet,
  Hourglass,
  CircleCheck,
  CircleDollarSign,
  Settings,
  Globe,
  Smartphone,
  Bell,
  MessageSquare,
  LogOut,
  ChevronDown,
  ChevronRight,
  Shield,
} from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

interface NavGroupProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function NavItem({ to, icon, label, badge }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-[hsl(200,100%,50%)] text-white shadow-[0_0_15px_hsl(200,100%,50%,0.4)]"
            : "text-[hsl(220,9%,65%)] hover:text-white hover:bg-[hsl(224,14%,12%)]"
        )
      }
    >
      {icon}
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[hsl(25,95%,53%)] text-white">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

function NavGroup({ icon, label, children, defaultOpen = false }: NavGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[hsl(220,9%,65%)] hover:text-white hover:bg-[hsl(224,14%,12%)] transition-all duration-200"
      >
        {icon}
        <span className="flex-1 text-left">{label}</span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {isOpen && (
        <div className="ml-4 pl-4 border-l border-[hsl(224,14%,15%)] space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[hsl(224,14%,7%)] border-r border-[hsl(224,14%,15%)] flex flex-col z-50">
      {/* Logo */}
      <div className="p-4 border-b border-[hsl(224,14%,15%)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(200,100%,50%)] to-[hsl(185,84%,45%)] flex items-center justify-center shadow-[0_0_20px_hsl(200,100%,50%,0.4)]">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white">M Nas Mart</h1>
            <p className="text-xs text-[hsl(200,100%,50%)]">Super Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          <NavItem to="/admin" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />

          <NavGroup icon={<Users className="w-5 h-5" />} label="Users" defaultOpen>
            <NavItem to="/admin/users/buyers" icon={<UserCheck className="w-4 h-4" />} label="Buyers" />
            <NavItem to="/admin/users/sellers" icon={<Store className="w-4 h-4" />} label="Sellers" />
            <NavItem to="/admin/users/admins" icon={<Shield className="w-4 h-4" />} label="Admins" />
          </NavGroup>

          <NavGroup icon={<Package className="w-5 h-5" />} label="Products">
            <NavItem to="/admin/products" icon={<Package className="w-4 h-4" />} label="All Products" />
            <NavItem to="/admin/products/add" icon={<Plus className="w-4 h-4" />} label="Add Product" />
            <NavItem to="/admin/products/categories" icon={<FolderTree className="w-4 h-4" />} label="Categories" />
            <NavItem to="/admin/products/brands" icon={<Tags className="w-4 h-4" />} label="Brands" />
          </NavGroup>

          <NavGroup icon={<ShoppingCart className="w-5 h-5" />} label="Orders">
            <NavItem to="/admin/orders" icon={<ShoppingCart className="w-4 h-4" />} label="All Orders" />
            <NavItem to="/admin/orders/processing" icon={<Clock className="w-4 h-4" />} label="Processing" badge={5} />
            <NavItem to="/admin/orders/shipping" icon={<Truck className="w-4 h-4" />} label="Shipping" />
            <NavItem to="/admin/orders/delivered" icon={<CheckCircle className="w-4 h-4" />} label="Delivered" />
            <NavItem to="/admin/orders/cancelled" icon={<XCircle className="w-4 h-4" />} label="Cancelled" />
          </NavGroup>

          <NavGroup icon={<CreditCard className="w-5 h-5" />} label="Payments">
            <NavItem to="/admin/payments/transactions" icon={<Receipt className="w-4 h-4" />} label="Transactions" />
            <NavItem to="/admin/payments/verify" icon={<CheckCircle className="w-4 h-4" />} label="Verify Payments" />
            <NavItem to="/admin/payments/payouts" icon={<Wallet className="w-4 h-4" />} label="Payout Requests" badge={3} />
          </NavGroup>

          <NavGroup icon={<CircleDollarSign className="w-5 h-5" />} label="Payouts">
            <NavItem to="/admin/payouts/pending" icon={<Hourglass className="w-4 h-4" />} label="Pending" badge={2} />
            <NavItem to="/admin/payouts/approved" icon={<CircleCheck className="w-4 h-4" />} label="Approved" />
            <NavItem to="/admin/payouts/completed" icon={<CheckCircle className="w-4 h-4" />} label="Completed" />
          </NavGroup>

          <NavGroup icon={<Settings className="w-5 h-5" />} label="Settings">
            <NavItem to="/admin/settings" icon={<Globe className="w-4 h-4" />} label="Website Settings" />
            <NavItem to="/admin/settings/gateway" icon={<CreditCard className="w-4 h-4" />} label="Gateway Settings" />
            <NavItem to="/admin/settings/otp" icon={<Smartphone className="w-4 h-4" />} label="OTP / SMS Settings" />
            <NavItem to="/admin/settings/mobile" icon={<Smartphone className="w-4 h-4" />} label="Mobile App" />
          </NavGroup>

          <NavItem to="/admin/notifications" icon={<Bell className="w-5 h-5" />} label="Notifications" badge={12} />
          <NavItem to="/admin/support" icon={<MessageSquare className="w-5 h-5" />} label="Chat Support" badge={4} />
        </nav>
      </ScrollArea>

      {/* Logout */}
      <div className="p-3 border-t border-[hsl(224,14%,15%)]">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-[hsl(0,84%,60%)] hover:text-[hsl(0,84%,70%)] hover:bg-[hsl(0,84%,60%,0.1)]"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
