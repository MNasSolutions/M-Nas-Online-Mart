import { useState, useEffect } from "react";
import { Bell, Package, Store, MessageSquare, X, Check, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  type: 'order' | 'application' | 'message';
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  metadata?: any;
}

export function AdminNotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    loadNotifications();
    
    // Subscribe to real-time notifications
    const channel = supabase
      .channel('admin-notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'orders' 
      }, (payload) => {
        const order = payload.new as any;
        addNotification({
          id: `order-${order.id}`,
          type: 'order',
          title: 'New Order',
          message: `Order #${order.order_number} - ₦${Number(order.total_amount).toLocaleString()}`,
          created_at: order.created_at,
          is_read: false,
          metadata: { order_id: order.id, order_number: order.order_number }
        });
      })
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'seller_applications' 
      }, (payload) => {
        const app = payload.new as any;
        addNotification({
          id: `app-${app.id}`,
          type: 'application',
          title: 'New Seller Application',
          message: `${app.business_name} - ${app.owner_full_name}`,
          created_at: app.created_at,
          is_read: false,
          metadata: { application_id: app.id }
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Load recent orders
      const { data: orders } = await supabase
        .from('orders')
        .select('id, order_number, total_amount, customer_name, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      // Load pending seller applications
      const { data: applications } = await supabase
        .from('seller_applications')
        .select('id, business_name, owner_full_name, created_at, status')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

      // Load admin notifications from database
      const { data: dbNotifications } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      const allNotifications: Notification[] = [];

      // Add recent orders as notifications
      orders?.forEach(order => {
        allNotifications.push({
          id: `order-${order.id}`,
          type: 'order',
          title: 'Order Received',
          message: `#${order.order_number} from ${order.customer_name} - ₦${Number(order.total_amount).toLocaleString()}`,
          created_at: order.created_at || new Date().toISOString(),
          is_read: false,
          metadata: { order_id: order.id, order_number: order.order_number }
        });
      });

      // Add pending applications as notifications
      applications?.forEach(app => {
        allNotifications.push({
          id: `app-${app.id}`,
          type: 'application',
          title: 'Seller Application',
          message: `${app.business_name} by ${app.owner_full_name}`,
          created_at: app.created_at || new Date().toISOString(),
          is_read: false,
          metadata: { application_id: app.id }
        });
      });

      // Add database notifications
      dbNotifications?.forEach(notif => {
        allNotifications.push({
          id: notif.id,
          type: notif.type as 'order' | 'application' | 'message',
          title: notif.title,
          message: notif.message,
          created_at: notif.created_at || new Date().toISOString(),
          is_read: notif.is_read || false,
          metadata: notif.metadata
        });
      });

      // Sort by date and dedupe
      allNotifications.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setNotifications(allNotifications.slice(0, 30));
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 30));
  };

  const markAsRead = async (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );

    // Update in database if it's a db notification
    if (!id.startsWith('order-') && !id.startsWith('app-')) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false);
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.type === 'order' && notification.metadata?.order_number) {
      navigate(`/admin?tab=orders`);
    } else if (notification.type === 'application') {
      navigate(`/admin?tab=applications`);
    }
    
    setIsOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="h-4 w-4 text-primary" />;
      case 'application':
        return <Store className="h-4 w-4 text-secondary" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filterByType = (type?: string) => {
    if (!type || type === 'all') return notifications;
    return notifications.filter(n => n.type === type);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-4 rounded-none border-b">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="order" className="text-xs">Orders</TabsTrigger>
            <TabsTrigger value="application" className="text-xs">Sellers</TabsTrigger>
            <TabsTrigger value="message" className="text-xs">Messages</TabsTrigger>
          </TabsList>

          {['all', 'order', 'application', 'message'].map(tabValue => (
            <TabsContent key={tabValue} value={tabValue} className="m-0">
              <ScrollArea className="h-80">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filterByType(tabValue).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Bell className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filterByType(tabValue).map(notification => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                          !notification.is_read ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">
                                {notification.title}
                              </p>
                              {!notification.is_read && (
                                <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatTimeAgo(notification.created_at)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        <div className="p-2 border-t">
          <Button 
            variant="ghost" 
            className="w-full text-sm"
            onClick={() => {
              navigate('/admin');
              setIsOpen(false);
            }}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
