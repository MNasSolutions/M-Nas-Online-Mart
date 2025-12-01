import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EarningsTabProps {
  sellerId: string;
  sellerProfile: any;
}

export function EarningsTab({ sellerId, sellerProfile }: EarningsTabProps) {
  const { toast } = useToast();
  const { format } = useCurrency();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  useEffect(() => {
    loadTransactions();
  }, [sellerId]);

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("commission_transactions")
        .select("*")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    const availableEarnings = (sellerProfile?.total_sales || 0) - (sellerProfile?.total_commission || 0);

    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (amount > availableEarnings) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough earnings to withdraw",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Withdrawal Request Submitted",
      description: "Your withdrawal request has been sent to admin for processing",
    });

    setWithdrawDialogOpen(false);
    setWithdrawAmount("");
  };

  const availableEarnings = (sellerProfile?.total_sales || 0) - (sellerProfile?.total_commission || 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(availableEarnings)}</div>
            <p className="text-xs text-muted-foreground">Ready to withdraw</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(sellerProfile?.total_sales || 0)}</div>
            <p className="text-xs text-muted-foreground">All time sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Commission Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(sellerProfile?.total_commission || 0)}</div>
            <p className="text-xs text-muted-foreground">15% platform fee</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Commission Breakdown</CardTitle>
          <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Withdraw Earnings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw Earnings</DialogTitle>
                <DialogDescription>
                  Enter the amount you want to withdraw. Funds will be transferred to your registered bank account.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Available Balance</Label>
                  <p className="text-2xl font-bold">{format(availableEarnings)}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Withdrawal Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bank Details</Label>
                  <p className="text-sm">
                    {sellerProfile?.bank_name} - {sellerProfile?.account_number}
                  </p>
                </div>
                <Button onClick={handleWithdraw} className="w-full">
                  Request Withdrawal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded">
              <div>
                <p className="font-semibold">Commission Rate</p>
                <p className="text-sm text-muted-foreground">Platform fee on each sale</p>
              </div>
              <p className="text-2xl font-bold">15%</p>
            </div>

            {transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Your Earnings</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{format(transaction.total_amount)}</TableCell>
                      <TableCell className="font-semibold">{format(transaction.seller_amount)}</TableCell>
                      <TableCell className="text-destructive">{format(transaction.commission_amount)}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === "paid" ? "default" : "secondary"}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-8">No transactions yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
