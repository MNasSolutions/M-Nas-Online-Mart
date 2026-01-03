import { useState } from "react";
import { Phone, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PhoneOTPLoginProps {
  onSuccess: () => void;
  isAdminLogin?: boolean;
}

export function PhoneOTPLogin({ onSuccess, isAdminLogin = false }: PhoneOTPLoginProps) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  // Format phone number to E.164 format
  const formatPhone = (input: string): string => {
    let cleaned = input.replace(/\D/g, "");
    
    // Handle Nigerian numbers
    if (cleaned.startsWith("0")) {
      cleaned = "234" + cleaned.slice(1);
    }
    if (!cleaned.startsWith("+")) {
      cleaned = "+" + cleaned;
    }
    return cleaned;
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formattedPhone = formatPhone(phone);
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          channel: 'sms',
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setOtpSent(true);
        startCountdown();
        toast({
          title: "OTP Sent!",
          description: `Verification code sent to ${formattedPhone}`,
        });
      }
    } catch (err: any) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formattedPhone = formatPhone(phone);
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        // Check admin role if admin login
        if (isAdminLogin) {
          const { data: isAdmin } = await supabase.rpc("has_role", {
            _user_id: data.user.id,
            _role: "admin",
          });
          const { data: isSuperAdmin } = await supabase.rpc("has_role", {
            _user_id: data.user.id,
            _role: "super_admin",
          });

          if (!isAdmin && !isSuperAdmin) {
            await supabase.auth.signOut();
            setError("Access denied. Admin privileges required.");
            return;
          }
        }

        toast({
          title: "Welcome!",
          description: "Successfully logged in.",
        });
        onSuccess();
      }
    } catch (err: any) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    await handleSendOTP();
  };

  return (
    <div className="space-y-5">
      {!otpSent ? (
        <>
          {/* Phone Input */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., 07069036157"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10"
                maxLength={15}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter your Nigerian phone number. OTP will be sent via SMS.
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="button"
            className="w-full"
            size="lg"
            onClick={handleSendOTP}
            disabled={loading || !phone}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                Send Verification Code
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </>
      ) : (
        <>
          {/* OTP Input */}
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Label>Enter Verification Code</Label>
              <p className="text-sm text-muted-foreground">
                We sent a 6-digit code to {formatPhone(phone)}
              </p>
            </div>

            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {countdown > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                Code expires in <span className="font-semibold text-primary">{countdown}s</span>
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="button"
            className="w-full"
            size="lg"
            onClick={handleVerifyOTP}
            disabled={loading || otp.length !== 6}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Sign In"
            )}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setError("");
              }}
            >
              Change number
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResendOTP}
              disabled={countdown > 0}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
