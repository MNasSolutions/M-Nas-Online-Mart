import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, TrendingUp, Wallet, Download } from "lucide-react";

export function CommissionTrackingTab() {
  const { toast } = useToast();
  const { format } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  
  const [walletData, setWalletData] = useState({
    balance: 0,
    totalCommission: 0,
    totalSubscriptions: 0,
  });
  
  const [commissionTransactions, setCommissionTransactions] = useState<any[]>([]);
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadCommissionData();
  }, []);

  const loadCommissionData = async () => {
    try {
      setLoading(true);

      // Load platform wallet
      const { data: wallet } = await supabase
        .from("platform_wallet")
        .select("*")
        .single();

      if (wallet) {
        setWalletData({
          balance: Number(wallet.balance || 0),
          totalCommission: Number(wallet.total_commission || 0),
          totalSubscriptions: Number(wallet.total_subscriptions || 0),
        });
      }

      // Load commission transactions
      const { data: commissions } = await supabase
        .from("commission_transactions")
        .select(`
          *,
          seller_profiles(business_name, brand_name),
          orders(order_number, customer_name)
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      setCommissionTransactions(commissions || []);

      // Load wallet transactions
      const { data: transactions } = await supabase
        .from("wallet_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      setWalletTransactions(transactions || []);
    } catch (error) {
      console.error("Error loading commission data:", error);
      toast({
        title: "Error",
        description: "Failed to load commission data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    if (amount > walletData.balance) {
      toast({
        title: "Insufficient Balance",
        description: "Withdrawal amount exceeds available balance",
        variant: "destructive",
      });
      return;
    }

    setWithdrawing(true);
    try {
      // Create withdrawal transaction
      const { error: txError } = await supabase
        .from("wallet_transactions")
        .insert({
          transaction_type: "withdrawal",
          amount: -amount,
          description: "Admin withdrawal",
          reference: `WD-${Date.now()}`,
        });

      if (txError) throw txError;

      // Update wallet balance
      const { error: walletError } = await supabase
        .from("platform_wallet")
        .update({
          balance: walletData.balance - amount,
        })
        .eq("id", (await supabase.from("platform_wallet").select("id").single()).data?.id);

      if (walletError) throw walletError;

      toast({
        title: "Withdrawal Successful",
        description: `${format(amount)} has been withdrawn`,
      });

      setWithdrawDialogOpen(false);
      setWithdrawAmount("");
      await loadCommissionData();
    } catch (error: any) {
      console.error("Error processing withdrawal:", error);
      toast({
        title: "Withdrawal Failed",
        description: error.message || "Failed to process withdrawal",
        variant: "destructive",
      });
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{format(walletData.balance)}</div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setWithdrawDialogOpen(true)}
              disabled={walletData.balance <= 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(walletData.totalCommission)}</div>
            <p className="text-xs text-muted-foreground">15% from sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(walletData.totalSubscriptions)}</div>
            <p className="text-xs text-muted-foreground">Seller subscriptions</p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Commission (15%)</TableHead>
                <TableHead>Seller Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissionTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No commission transactions yet
                  </TableCell>
                </TableRow>
              ) : (
                commissionTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">
                      {tx.orders?.order_number || "N/A"}
                    </TableCell>
                    <TableCell>
                      {tx.seller_profiles?.brand_name || tx.seller_profiles?.business_name || "N/A"}
                    </TableCell>
                    <TableCell>{tx.orders?.customer_name || "N/A"}</TableCell>
                    <TableCell>{format(Number(tx.total_amount))}</TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      {format(Number(tx.commission_amount))}
                    </TableCell>
                    <TableCell>{format(Number(tx.seller_amount))}</TableCell>
                    <TableCell>
                      <Badge variant={tx.status === "paid" ? "default" : "secondary"}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(tx.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Wallet Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {walletTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No wallet transactions yet
                  </TableCell>
                </TableRow>
              ) : (
                walletTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <Badge
                        variant={
                          tx.transaction_type === "commission"
                            ? "default"
                            : tx.transaction_type === "subscription"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {tx.transaction_type}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={
                        Number(tx.amount) >= 0
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {format(Number(tx.amount))}
                    </TableCell>
                    <TableCell>{tx.description || "N/A"}</TableCell>
                    <TableCell className="font-mono text-sm">{tx.reference || "N/A"}</TableCell>
                    <TableCell>{new Date(tx.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Withdrawal Dialog */}
      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Enter the amount you want to withdraw from your platform wallet
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Available Balance</Label>
              <div className="text-2xl font-bold text-primary">{format(walletData.balance)}</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="withdrawAmount">Withdrawal Amount</Label>
              <Input
                id="withdrawAmount"
                type="number"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="0"
                max={walletData.balance}
                step="0.01"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setWithdrawDialogOpen(false);
                setWithdrawAmount("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleWithdraw} disabled={withdrawing}>
              {withdrawing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Withdraw
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
