import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Settings, Palette, DollarSign, Truck, MessageSquare, Bell, Globe, Shield, Smartphone, Key } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface SiteSettings {
  site_name: string;
  site_logo_url: string;
  primary_color: string;
  secondary_color: string;
  default_currency: string;
  free_shipping_minimum: number;
  enable_chatbot: boolean;
  enable_otp_login: boolean;
  sms_provider: string;
  enable_push_notifications: boolean;
  meta_title: string;
  meta_description: string;
  enable_dark_mode: boolean;
  maintenance_mode: boolean;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
}

const defaultSettings: SiteSettings = {
  site_name: "M Nas Online Mart",
  site_logo_url: "",
  primary_color: "#7C3AED",
  secondary_color: "#F59E0B",
  default_currency: "NGN",
  free_shipping_minimum: 100,
  enable_chatbot: true,
  enable_otp_login: true,
  sms_provider: "termii",
  enable_push_notifications: true,
  meta_title: "M Nas Online Mart - Your One-Stop Shop",
  meta_description: "Shop the best products at M Nas Online Mart",
  enable_dark_mode: false,
  maintenance_mode: false,
  contact_email: "mnassolutions007@gmail.com",
  contact_phone: "+2347069036157",
  contact_whatsapp: "2347069036157",
};

export default function AdminSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    checkAdminRole();
  }, [user]);

  const checkAdminRole = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "super_admin",
      });

      if (error) throw error;

      if (!data) {
        // Check for regular admin
        const { data: adminData } = await supabase.rpc("has_role", {
          _user_id: user.id,
          _role: "admin",
        });
        
        if (!adminData) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
      }

      setIsAdmin(true);
      loadSettings();
    } catch (error) {
      console.error("Error checking admin role:", error);
      navigate("/");
    }
  };

  const loadSettings = async () => {
    try {
      // Load settings from localStorage for now (can be moved to DB later)
      const savedSettings = localStorage.getItem("site_settings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      localStorage.setItem("site_settings", JSON.stringify(settings));
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Admin Settings
          </h1>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
            <TabsTrigger value="otp">OTP</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>Configure basic website settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="site_name">Website Name</Label>
                    <Input
                      id="site_name"
                      value={settings.site_name}
                      onChange={(e) => updateSetting("site_name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site_logo">Logo URL</Label>
                    <Input
                      id="site_logo"
                      value={settings.site_logo_url}
                      onChange={(e) => updateSetting("site_logo_url", e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => updateSetting("contact_email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Contact Phone</Label>
                    <Input
                      id="contact_phone"
                      value={settings.contact_phone}
                      onChange={(e) => updateSetting("contact_phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_whatsapp">WhatsApp Number</Label>
                    <Input
                      id="contact_whatsapp"
                      value={settings.contact_whatsapp}
                      onChange={(e) => updateSetting("contact_whatsapp", e.target.value)}
                      placeholder="2347069036157"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable to show maintenance page to visitors
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenance_mode}
                    onCheckedChange={(checked) => updateSetting("maintenance_mode", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Settings */}
          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme Settings
                </CardTitle>
                <CardDescription>Customize website appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary_color"
                        type="color"
                        value={settings.primary_color}
                        onChange={(e) => updateSetting("primary_color", e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={settings.primary_color}
                        onChange={(e) => updateSetting("primary_color", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary_color">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary_color"
                        type="color"
                        value={settings.secondary_color}
                        onChange={(e) => updateSetting("secondary_color", e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={settings.secondary_color}
                        onChange={(e) => updateSetting("secondary_color", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to switch to dark mode
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_dark_mode}
                    onCheckedChange={(checked) => updateSetting("enable_dark_mode", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Currency Settings */}
          <TabsContent value="currency">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Currency Settings
                </CardTitle>
                <CardDescription>Configure currency options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select
                    value={settings.default_currency}
                    onValueChange={(value) => updateSetting("default_currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Settings */}
          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Settings
                </CardTitle>
                <CardDescription>Configure shipping options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="free_shipping">Free Shipping Minimum (in default currency)</Label>
                  <Input
                    id="free_shipping"
                    type="number"
                    value={settings.free_shipping_minimum}
                    onChange={(e) => updateSetting("free_shipping_minimum", parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Orders above this amount qualify for free shipping
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chatbot Settings */}
          <TabsContent value="chatbot">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chatbot Settings
                </CardTitle>
                <CardDescription>Configure AI chatbot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Chatbot</Label>
                    <p className="text-sm text-muted-foreground">
                      Show AI chat assistant on the website
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_chatbot}
                    onCheckedChange={(checked) => updateSetting("enable_chatbot", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OTP Settings */}
          <TabsContent value="otp">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  OTP & SMS Settings
                </CardTitle>
                <CardDescription>Configure OTP login and SMS provider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable OTP Login</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to login with phone OTP
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_otp_login}
                    onCheckedChange={(checked) => updateSetting("enable_otp_login", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>SMS Provider</Label>
                  <Select
                    value={settings.sms_provider}
                    onValueChange={(value) => updateSetting("sms_provider", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="termii">Termii</SelectItem>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="africas_talking">Africa's Talking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send push notifications to users
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_push_notifications}
                    onCheckedChange={(checked) => updateSetting("enable_push_notifications", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Settings */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  SEO Settings
                </CardTitle>
                <CardDescription>Optimize for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={settings.meta_title}
                    onChange={(e) => updateSetting("meta_title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={settings.meta_description}
                    onChange={(e) => updateSetting("meta_description", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Security settings are managed through Supabase dashboard for maximum protection.
                </p>
                <Button variant="outline" asChild>
                  <a
                    href="https://supabase.com/dashboard/project/qtzlturyendzmirvbofu/auth/providers"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Supabase Auth Settings
                  </a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys Management
                </CardTitle>
                <CardDescription>Manage API keys securely</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  API keys are stored securely in Supabase Secrets for maximum security.
                  Never expose API keys in client-side code.
                </p>
                <Button variant="outline" asChild>
                  <a
                    href="https://supabase.com/dashboard/project/qtzlturyendzmirvbofu/settings/functions"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Manage Secrets in Supabase
                  </a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={saveSettings} disabled={saving} size="lg">
            {saving ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
