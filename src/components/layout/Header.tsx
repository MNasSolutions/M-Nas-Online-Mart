import { useState } from "react";
import { Search, ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
            <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              ShopHub
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Electronics
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Fashion
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Home & Living
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Sports
            </a>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 bg-muted/50 border-0 focus:bg-background"
              />
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center">
                3
              </span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 bg-muted/50 border-0"
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fade-in">
            <a href="#" className="block py-2 px-4 rounded-md text-foreground hover:bg-accent font-medium">
              Home
            </a>
            <a href="#" className="block py-2 px-4 rounded-md text-muted-foreground hover:bg-accent">
              Electronics
            </a>
            <a href="#" className="block py-2 px-4 rounded-md text-muted-foreground hover:bg-accent">
              Fashion
            </a>
            <a href="#" className="block py-2 px-4 rounded-md text-muted-foreground hover:bg-accent">
              Home & Living
            </a>
            <a href="#" className="block py-2 px-4 rounded-md text-muted-foreground hover:bg-accent">
              Sports
            </a>
          </div>
        )}
      </div>
    </header>
  );
}