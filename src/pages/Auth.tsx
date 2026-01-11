import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, User, Store, ShoppingBag, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PhoneOTPLogin } from "@/components/auth/PhoneOTPLogin";
import { Separator } from "@/components/ui/separator";

type AuthMode = "login" | "buyer-signup" | "seller-signup" | "choose";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("choose");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode !== "login" && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (mode !== "login" && password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          navigate(isAdminLogin ? "/admin" : "/");
        }
      } else {
        const redirectUrl = `${window.location.origin}/`;
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
              account_type: mode === "seller-signup" ? "seller" : "buyer"
            }
          }
        });

        if (error) {
          setError(error.message);
        } else {
          toast({
            title: "Account created!",
            description: mode === "seller-signup" 
              ? "Please check your email to verify, then complete your seller registration."
              : "Please check your email to verify your account.",
          });
          
          // If seller signup, redirect to seller registration after a delay
          if (mode === "seller-signup" && data.user) {
            setTimeout(() => {
              navigate("/seller-registration");
            }, 2000);
          }
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`
    });

    if (error) {
      setError(error.message);
    } else {
      toast({
        title: "Reset email sent!",
        description: "Check your email for password reset instructions.",
      });
    }
  };

  const resetForm = () => {
    setError("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setIsAdminLogin(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        }
      });
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Choose Account Type Screen
  if (mode === "choose") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/src/assets/logo.png" 
                alt="M Nas Online Mart" 
                className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
              />
            </div>
            <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
              M Nas Online Mart
            </div>
            <p className="text-muted-foreground">
              Choose how you want to join us
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-strong p-8 border space-y-6">
            {/* Buyer Registration */}
            <button
              onClick={() => { setMode("buyer-signup"); resetForm(); }}
              className="w-full p-6 rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all group text-left"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Register as Buyer</h3>
                  <p className="text-sm text-muted-foreground">
                    Shop amazing products, track orders, and enjoy exclusive deals
                  </p>
                </div>
              </div>
            </button>

            {/* Seller Registration */}
            <button
              onClick={() => { setMode("seller-signup"); resetForm(); }}
              className="w-full p-6 rounded-xl border-2 border-secondary/20 hover:border-secondary hover:bg-secondary/5 transition-all group text-left"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                  <Store className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Register as Seller</h3>
                  <p className="text-sm text-muted-foreground">
                    Sell your products, manage your store, and grow your business
                  </p>
                  <p className="text-xs text-warning mt-1">15% commission • ₦3,000/month subscription</p>
                </div>
              </div>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Button */}
            <Button 
              variant="outline" 
              className="w-full" 
              size="lg"
              onClick={() => { setMode("login"); resetForm(); }}
            >
              <User className="h-4 w-4 mr-2" />
              Sign In to Your Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Login / Signup Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button 
          onClick={() => { setMode("choose"); resetForm(); }}
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${mode === "seller-signup" ? "bg-secondary/10" : "bg-primary/10"}`}>
              {mode === "login" ? (
                <User className={`h-10 w-10 text-primary`} />
              ) : mode === "seller-signup" ? (
                <Store className="h-10 w-10 text-secondary" />
              ) : (
                <ShoppingBag className="h-10 w-10 text-primary" />
              )}
            </div>
          </div>
          <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
            {mode === "login" ? "Welcome Back" : mode === "seller-signup" ? "Become a Seller" : "Create Account"}
          </div>
          <p className="text-muted-foreground">
            {mode === "login" 
              ? "Sign in to your account" 
              : mode === "seller-signup" 
                ? "Start selling on M Nas Online Mart"
                : "Join as a buyer and start shopping"}
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-strong p-8 border">
          {mode === "login" ? (
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone OTP
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Admin Login Toggle */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="adminLogin"
                      checked={isAdminLogin}
                      onChange={(e) => setIsAdminLogin(e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                    />
                    <Label htmlFor="adminLogin" className="text-sm">
                      Login as Administrator
                    </Label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Please wait..." : "Sign In"}
                  </Button>

                  {/* Forgot Password */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleForgotPassword}
                    className="w-full text-muted-foreground hover:text-primary"
                  >
                    Forgot your password?
                  </Button>

                  {/* Google Login Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  {/* Google Sign In Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign in with Google
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="phone">
                <PhoneOTPLogin 
                  onSuccess={() => navigate(isAdminLogin ? "/admin" : "/")}
                  isAdminLogin={isAdminLogin}
                />
                
                {/* Admin Login Toggle for Phone */}
                <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
                  <input
                    type="checkbox"
                    id="adminLoginPhone"
                    checked={isAdminLogin}
                    onChange={(e) => setIsAdminLogin(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                  />
                  <Label htmlFor="adminLoginPhone" className="text-sm">
                    Login as Administrator
                  </Label>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Seller Info */}
              {mode === "seller-signup" && (
                <div className="bg-secondary/10 rounded-lg p-4 text-sm space-y-2">
                  <p className="font-medium text-secondary">Seller Benefits:</p>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    <li>• Create your own storefront</li>
                    <li>• List unlimited products</li>
                    <li>• Track orders and earnings</li>
                    <li>• 15% platform commission on sales</li>
                    <li>• ₦3,000 monthly subscription</li>
                  </ul>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className={`w-full ${mode === "seller-signup" ? "bg-secondary hover:bg-secondary/90" : ""}`}
                size="lg"
                disabled={loading}
              >
                {loading 
                  ? "Please wait..." 
                  : mode === "seller-signup"
                    ? "Create Seller Account"
                    : "Create Buyer Account"}
              </Button>

              {/* Google Signup Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Google Sign Up Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign up with Google
              </Button>
            </form>
          )}

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="link"
              onClick={() => { 
                setMode(mode === "login" ? "choose" : "login"); 
                resetForm(); 
              }}
              className="font-semibold"
            >
              {mode === "login" ? "Create Account" : "Sign In"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
