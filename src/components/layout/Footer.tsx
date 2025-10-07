import { useState } from "react";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter-email', {
        body: { email }
      });

      if (error) throw error;

      toast({
        title: "Subscribed Successfully!",
        description: "Check your email for confirmation and welcome message.",
      });
      
      setEmail("");
    } catch (error: any) {
      console.error('Newsletter signup error:', error);
      toast({
        title: "Subscription Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              M Nas Online Mart
            </div>
            <p className="text-muted-foreground text-sm">
              Your trusted partner for premium products and exceptional shopping experience. 
              We deliver quality and value to customers worldwide.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:text-primary" asChild>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary" asChild>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary" asChild>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="text-muted-foreground hover:text-primary transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-muted-foreground hover:text-primary transition-colors">Return Policy</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/products?category=electronics" className="text-muted-foreground hover:text-primary transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=fashion" className="text-muted-foreground hover:text-primary transition-colors">Fashion</Link></li>
              <li><Link to="/products?category=home" className="text-muted-foreground hover:text-primary transition-colors">Home & Living</Link></li>
              <li><Link to="/products?category=sports" className="text-muted-foreground hover:text-primary transition-colors">Sports</Link></li>
              <li><Link to="/track-order" className="text-muted-foreground hover:text-primary transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-muted-foreground text-sm">
              Subscribe to get updates on new products and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSignup} className="space-y-2">
              <Input 
                type="email"
                placeholder="Enter your email" 
                className="bg-background"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                variant="cta" 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Subscribing..." : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Subscribe
                  </>
                )}
              </Button>
            </form>
            
            {/* Contact Info */}
            <div className="space-y-2 pt-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>mnassolutions007@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>mnassolutions@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © 2024 M Nas Online Mart. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}