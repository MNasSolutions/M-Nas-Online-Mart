import { useState, useEffect } from "react";
import { Cookie, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("cookie-consent", JSON.stringify(prefs));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setShowBanner(false);
    setShowCustomize(false);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const handleDenyAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(onlyNecessary);
    savePreferences(onlyNecessary);
  };

  const handleSaveCustom = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-card/95 backdrop-blur-lg border-t shadow-strong animate-slide-up">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0 mt-1">
                <Cookie className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">We value your privacy</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDenyAll}
                className="flex-1 md:flex-none"
              >
                Deny All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowCustomize(true)}
                className="flex-1 md:flex-none"
              >
                <Settings className="h-4 w-4 mr-1" />
                Customize
              </Button>
              <Button 
                size="sm" 
                onClick={handleAcceptAll}
                className="flex-1 md:flex-none"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Customize Dialog */}
      <Dialog open={showCustomize} onOpenChange={setShowCustomize}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Manage your cookie preferences below. Necessary cookies are required for the website to function.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Necessary Cookies */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="space-y-0.5">
                <Label className="font-medium">Necessary Cookies</Label>
                <p className="text-xs text-muted-foreground">
                  Essential for the website to function properly
                </p>
              </div>
              <Switch checked disabled />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="space-y-0.5">
                <Label className="font-medium">Analytics Cookies</Label>
                <p className="text-xs text-muted-foreground">
                  Help us understand how visitors interact with our website
                </p>
              </div>
              <Switch 
                checked={preferences.analytics}
                onCheckedChange={(checked) => 
                  setPreferences({ ...preferences, analytics: checked })
                }
              />
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="space-y-0.5">
                <Label className="font-medium">Marketing Cookies</Label>
                <p className="text-xs text-muted-foreground">
                  Used to deliver personalized advertisements
                </p>
              </div>
              <Switch 
                checked={preferences.marketing}
                onCheckedChange={(checked) => 
                  setPreferences({ ...preferences, marketing: checked })
                }
              />
            </div>

            {/* Functional Cookies */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="space-y-0.5">
                <Label className="font-medium">Functional Cookies</Label>
                <p className="text-xs text-muted-foreground">
                  Enable enhanced functionality and personalization
                </p>
              </div>
              <Switch 
                checked={preferences.functional}
                onCheckedChange={(checked) => 
                  setPreferences({ ...preferences, functional: checked })
                }
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleDenyAll}>
              Deny All
            </Button>
            <Button className="flex-1" onClick={handleSaveCustom}>
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
