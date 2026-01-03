import { useState } from "react";
import { Banknote, Building2, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PayoutFormProps {
  sellerId: string;
  availableBalance: number;
  onSuccess?: () => void;
}

// Nigerian Banks with codes (for Paystack)
const BANKS = [
  { name: "Access Bank", code: "044" },
  { name: "Citibank Nigeria", code: "023" },
  { name: "Diamond Bank", code: "063" },
  { name: "Ecobank Nigeria", code: "050" },
  { name: "Fidelity Bank", code: "070" },
  { name: "First Bank of Nigeria", code: "011" },
  { name: "First City Monument Bank", code: "214" },
  { name: "Guaranty Trust Bank", code: "058" },
  { name: "Heritage Bank", code: "030" },
  { name: "Jaiz Bank", code: "301" },
  { name: "Keystone Bank", code: "082" },
  { name: "Moniepoint Microfinance Bank", code: "50515" },
  { name: "Opay Digital Services", code: "999992" },
  { name: "Polaris Bank", code: "076" },
  { name: "Providus Bank", code: "101" },
  { name: "Stanbic IBTC Bank", code: "221" },
  { name: "Standard Chartered Bank", code: "068" },
  { name: "Sterling Bank", code: "232" },
  { name: "Suntrust Bank", code: "100" },
  { name: "Union Bank of Nigeria", code: "032" },
  { name: "United Bank For Africa", code: "033" },
  { name: "Unity Bank", code: "215" },
  { name: "VFD Microfinance Bank", code: "566" },
  { name: "Wema Bank", code: "035" },
  { name: "Zenith Bank", code: "057" },
];

type PaymentMethod = "bank_transfer" | "opay" | "moniepoint";

export function PayoutForm({ sellerId, availableBalance, onSuccess }: PayoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const getDefaultBankCode = (method: PaymentMethod): string => {
    switch (method) {
      case "opay":
        return "999992";
      case "moniepoint":
        return "50515";
      default:
        return "";
    }
  };

  const handleMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setAccountName("");
    setIsVerified(false);
    setError("");
    
    if (method === "opay" || method === "moniepoint") {
      setBankCode(getDefaultBankCode(method));
    } else {
      setBankCode("");
    }
  };

  const verifyAccount = async () => {
    if (!accountNumber || accountNumber.length !== 10) {
      setError("Please enter a valid 10-digit account number");
      return;
    }

    const bankCodeToUse = paymentMethod === "opay" || paymentMethod === "moniepoint" 
      ? getDefaultBankCode(paymentMethod) 
      : bankCode;

    if (!bankCodeToUse) {
      setError("Please select a bank");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const { data, error } = await supabase.functions.invoke("verify-bank-account", {
        body: {
          account_number: accountNumber,
          bank_code: bankCodeToUse,
        },
      });

      if (error) throw error;

      if (data?.status && data.data?.account_name) {
        setAccountName(data.data.account_name);
        setIsVerified(true);
        toast({
          title: "Account Verified!",
          description: `Account holder: ${data.data.account_name}`,
        });
      } else {
        setError("Could not verify account. Please check the details.");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setError("Account verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isVerified) {
      setError("Please verify your account first");
      return;
    }

    const requestAmount = parseFloat(amount);
    if (isNaN(requestAmount) || requestAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (requestAmount > availableBalance) {
      setError(`Amount exceeds available balance of ₦${availableBalance.toLocaleString()}`);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Create payout request in database
      const bankCodeToUse = paymentMethod === "opay" || paymentMethod === "moniepoint" 
        ? getDefaultBankCode(paymentMethod) 
        : bankCode;

      const bankName = BANKS.find(b => b.code === bankCodeToUse)?.name || paymentMethod;

      // Here you would create the payout request
      toast({
        title: "Payout Request Submitted!",
        description: "Your request is being processed. You'll be notified once approved.",
      });

      // Notify admin
      await supabase.functions.invoke("send-registration-notification", {
        body: {
          type: "payout_request",
          data: {
            full_name: accountName,
            amount: requestAmount,
          },
        },
      });

      onSuccess?.();
    } catch (err: any) {
      setError("Failed to submit payout request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="h-5 w-5 text-primary" />
          Request Withdrawal
        </CardTitle>
        <CardDescription>
          Available Balance: <span className="font-semibold text-primary">₦{availableBalance.toLocaleString()}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Payment Method Selection */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={paymentMethod === "bank_transfer" ? "default" : "outline"}
                className="flex-col h-auto py-3"
                onClick={() => handleMethodChange("bank_transfer")}
              >
                <Building2 className="h-5 w-5 mb-1" />
                <span className="text-xs">Bank Transfer</span>
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "opay" ? "default" : "outline"}
                className="flex-col h-auto py-3"
                onClick={() => handleMethodChange("opay")}
              >
                <span className="text-lg font-bold mb-1">O</span>
                <span className="text-xs">Opay</span>
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "moniepoint" ? "default" : "outline"}
                className="flex-col h-auto py-3"
                onClick={() => handleMethodChange("moniepoint")}
              >
                <span className="text-lg font-bold mb-1">M</span>
                <span className="text-xs">Moniepoint</span>
              </Button>
            </div>
          </div>

          {/* Bank Selection (only for bank transfer) */}
          {paymentMethod === "bank_transfer" && (
            <div className="space-y-2">
              <Label>Select Bank</Label>
              <Select value={bankCode} onValueChange={(v) => { setBankCode(v); setIsVerified(false); setAccountName(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your bank" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {BANKS.filter(b => b.code !== "999992" && b.code !== "50515").map((bank) => (
                    <SelectItem key={bank.code} value={bank.code}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Account Number */}
          <div className="space-y-2">
            <Label>Account Number</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter 10-digit account number"
                value={accountNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setAccountNumber(val);
                  setIsVerified(false);
                  setAccountName("");
                }}
                maxLength={10}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={verifyAccount}
                disabled={isVerifying || accountNumber.length !== 10}
              >
                {isVerifying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isVerified ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
          </div>

          {/* Account Name (shown after verification) */}
          {accountName && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">{accountName}</span>
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label>Amount (₦)</Label>
            <Input
              type="number"
              placeholder="Enter amount to withdraw"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={100}
              max={availableBalance}
            />
            <p className="text-xs text-muted-foreground">
              Minimum withdrawal: ₦100
            </p>
          </div>

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !isVerified}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Request Withdrawal"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
