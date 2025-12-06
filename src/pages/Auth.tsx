import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, User, Store, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name (signup only) */}
            {mode !== "login" && (
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
            )}

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

            {/* Confirm Password (signup only) */}
            {mode !== "login" && (
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
            )}

            {/* Admin Login Toggle */}
            {mode === "login" && (
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
            )}

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
                : mode === "login" 
                  ? "Sign In" 
                  : mode === "seller-signup"
                    ? "Create Seller Account"
                    : "Create Buyer Account"}
            </Button>

            {/* Forgot Password */}
            {mode === "login" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleForgotPassword}
                className="w-full text-muted-foreground hover:text-primary"
              >
                Forgot your password?
              </Button>
            )}
          </form>

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
