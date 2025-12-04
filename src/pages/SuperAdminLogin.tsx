import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Eye, EyeOff, Shield, Lock, Mail, Phone, Loader2 } from "lucide-react";

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Email/Password login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // OTP login
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();
      
      if (roleError || !roleData || !['admin', 'super_admin'].includes(roleData.role)) {
        await supabase.auth.signOut();
        throw new Error('Access denied. Super Admin privileges required.');
      }
      
      toast.success("Login successful!", {
        description: "Welcome back, Super Admin"
      });
      navigate('/admin');
    } catch (error: any) {
      toast.error("Login failed", {
        description: error.message || "Invalid credentials"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone) {
      toast.error("Please enter phone number");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone.startsWith('+') ? phone : `+234${phone.replace(/^0/, '')}`,
      });
      
      if (error) throw error;
      
      setOtpSent(true);
      toast.success("OTP sent!", {
        description: "Check your phone for the verification code"
      });
    } catch (error: any) {
      toast.error("Failed to send OTP", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone.startsWith('+') ? phone : `+234${phone.replace(/^0/, '')}`,
        token: otp,
        type: 'sms',
      });
      
      if (error) throw error;
      
      // Check admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user?.id)
        .single();
      
      if (roleError || !roleData || !['admin', 'super_admin'].includes(roleData.role)) {
        await supabase.auth.signOut();
        throw new Error('Access denied. Super Admin privileges required.');
      }
      
      toast.success("Login successful!");
      navigate('/admin');
    } catch (error: any) {
      toast.error("Verification failed", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(224,14%,4%)] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(200,100%,50%)] rounded-full blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[hsl(185,84%,45%)] rounded-full blur-[128px] opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <Card className="w-full max-w-md relative z-10 bg-[hsl(224,14%,7%)] border-[hsl(224,14%,15%)] shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(200,100%,50%)] to-[hsl(185,84%,45%)] flex items-center justify-center shadow-[0_0_30px_hsl(200,100%,50%,0.5)]">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">M Nas Online Mart</CardTitle>
            <CardDescription className="text-[hsl(220,9%,55%)]">Super Admin Portal</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[hsl(224,14%,10%)]">
              <TabsTrigger value="email" className="data-[state=active]:bg-[hsl(200,100%,50%)] data-[state=active]:text-white">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="data-[state=active]:bg-[hsl(200,100%,50%)] data-[state=active]:text-white">
                <Phone className="w-4 h-4 mr-2" />
                Phone OTP
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="mt-6">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[hsl(220,9%,75%)]">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220,9%,45%)]" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@mnasonlinemart.com"
                      className="pl-10 bg-[hsl(224,14%,10%)] border-[hsl(224,14%,20%)] text-white placeholder:text-[hsl(220,9%,40%)] focus:border-[hsl(200,100%,50%)] focus:ring-[hsl(200,100%,50%)]"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[hsl(220,9%,75%)]">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220,9%,45%)]" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-[hsl(224,14%,10%)] border-[hsl(224,14%,20%)] text-white placeholder:text-[hsl(220,9%,40%)] focus:border-[hsl(200,100%,50%)] focus:ring-[hsl(200,100%,50%)]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220,9%,45%)] hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[hsl(200,100%,50%)] to-[hsl(185,84%,45%)] hover:from-[hsl(200,100%,45%)] hover:to-[hsl(185,84%,40%)] text-white shadow-[0_0_20px_hsl(200,100%,50%,0.4)] transition-all duration-300"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Shield className="w-4 h-4 mr-2" />
                  )}
                  Sign In
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="phone" className="mt-6">
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[hsl(220,9%,75%)]">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220,9%,45%)]" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07069036157"
                      className="pl-10 bg-[hsl(224,14%,10%)] border-[hsl(224,14%,20%)] text-white placeholder:text-[hsl(220,9%,40%)] focus:border-[hsl(200,100%,50%)] focus:ring-[hsl(200,100%,50%)]"
                      disabled={otpSent}
                      required
                    />
                  </div>
                </div>
                
                {!otpSent ? (
                  <Button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[hsl(200,100%,50%)] to-[hsl(185,84%,45%)] hover:from-[hsl(200,100%,45%)] hover:to-[hsl(185,84%,40%)] text-white shadow-[0_0_20px_hsl(200,100%,50%,0.4)]"
                  >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Send OTP
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-[hsl(220,9%,75%)]">Enter OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="text-center text-2xl tracking-widest bg-[hsl(224,14%,10%)] border-[hsl(224,14%,20%)] text-white placeholder:text-[hsl(220,9%,40%)] focus:border-[hsl(200,100%,50%)] focus:ring-[hsl(200,100%,50%)]"
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[hsl(200,100%,50%)] to-[hsl(185,84%,45%)] hover:from-[hsl(200,100%,45%)] hover:to-[hsl(185,84%,40%)] text-white shadow-[0_0_20px_hsl(200,100%,50%,0.4)]"
                    >
                      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                      Verify & Login
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => { setOtpSent(false); setOtp(''); }}
                      className="w-full text-[hsl(200,100%,50%)] hover:text-[hsl(200,100%,60%)] hover:bg-[hsl(224,14%,12%)]"
                    >
                      Resend OTP
                    </Button>
                  </>
                )}
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <p className="text-[hsl(220,9%,45%)] text-sm">
              Protected admin area. Unauthorized access is prohibited.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
