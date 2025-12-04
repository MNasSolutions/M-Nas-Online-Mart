import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Wallet, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  Building2,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

interface CommissionTransaction {
  id: string;
  order_id: string;
  seller_id: string;
  total_amount: number;
  commission_amount: number;
  seller_amount: number;
  commission_rate: number;
  status: string;
  created_at: string;
  paid_at: string | null;
  seller_profile?: {
    business_name: string;
    brand_name: string;
    bank_name: string;
    account_number: string;
    user_id: string;
  };
}

export default function PayoutsManagementTab() {
  const [transactions, setTransactions] = useState<CommissionTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState<CommissionTransaction | null>(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('commission_transactions')
        .select(`
          *,
          seller_profile:seller_profiles (
            business_name,
            brand_name,
            bank_name,
            account_number,
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion for the nested data
      const typedData = (data || []).map(item => ({
        ...item,
        seller_profile: item.seller_profile as CommissionTransaction['seller_profile']
      }));
      
      setTransactions(typedData);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Failed to load payout data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayout = async () => {
    if (!selectedPayout || !paymentReference) {
      toast.error('Please enter payment reference');
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('commission_transactions')
        .update({ 
          status: 'paid', 
          paid_at: new Date().toISOString()
        })
        .eq('id', selectedPayout.id);

      if (error) throw error;

      toast.success('Payout approved and marked as paid!');
      setSelectedPayout(null);
      setPaymentReference("");
      loadTransactions();
    } catch (error: any) {
      toast.error('Failed to approve payout', { description: error.message });
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectPayout = async () => {
    if (!selectedPayout) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('commission_transactions')
        .update({ status: 'rejected' })
        .eq('id', selectedPayout.id);

      if (error) throw error;

      toast.success('Payout rejected');
      setSelectedPayout(null);
      setRejectionReason("");
      loadTransactions();
    } catch (error: any) {
      toast.error('Failed to reject payout', { description: error.message });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: React.ReactNode }> = {
      pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: <Clock className="w-3 h-3" /> },
      approved: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: <CheckCircle className="w-3 h-3" /> },
      paid: { color: "bg-green-500/20 text-green-400 border-green-500/30", icon: <CheckCircle className="w-3 h-3" /> },
      rejected: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: <XCircle className="w-3 h-3" /> },
    };
    const variant = variants[status] || variants.pending;
    return (
      <Badge className={`${variant.color} border flex items-center gap-1`}>
        {variant.icon}
        {status}
      </Badge>
    );
  };

  const pendingTotal = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.seller_amount, 0);

  const paidTotal = transactions
    .filter(t => t.status === 'paid')
    .reduce((sum, t) => sum + t.seller_amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(200,100%,50%)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[hsl(224,14%,7%)] border-[hsl(224,14%,15%)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(220,9%,65%)]">
              Pending Payouts
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              ₦{pendingTotal.toLocaleString()}
            </div>
            <p className="text-xs text-[hsl(220,9%,55%)]">
              {transactions.filter(t => t.status === 'pending').length} pending requests
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(224,14%,7%)] border-[hsl(224,14%,15%)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(220,9%,65%)]">
              Total Paid Out
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              ₦{paidTotal.toLocaleString()}
            </div>
            <p className="text-xs text-[hsl(220,9%,55%)]">
              {transactions.filter(t => t.status === 'paid').length} completed payouts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(224,14%,7%)] border-[hsl(224,14%,15%)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(220,9%,65%)]">
              Commission Earned
            </CardTitle>
            <DollarSign className="h-4 w-4 text-[hsl(200,100%,50%)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(200,100%,50%)]">
              ₦{transactions.reduce((sum, t) => sum + t.commission_amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-[hsl(220,9%,55%)]">
              15% platform commission
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="bg-[hsl(224,14%,7%)] border-[hsl(224,14%,15%)]">
        <CardHeader>
          <CardTitle className="text-white">Seller Payouts</CardTitle>
          <CardDescription className="text-[hsl(220,9%,55%)]">
            Manage seller commission payouts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-[hsl(224,14%,15%)] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-[hsl(224,14%,15%)] hover:bg-[hsl(224,14%,10%)]">
                  <TableHead className="text-[hsl(220,9%,65%)]">Seller</TableHead>
                  <TableHead className="text-[hsl(220,9%,65%)]">Bank Details</TableHead>
                  <TableHead className="text-[hsl(220,9%,65%)]">Order Total</TableHead>
                  <TableHead className="text-[hsl(220,9%,65%)]">Commission</TableHead>
                  <TableHead className="text-[hsl(220,9%,65%)]">Seller Amount</TableHead>
                  <TableHead className="text-[hsl(220,9%,65%)]">Status</TableHead>
                  <TableHead className="text-[hsl(220,9%,65%)]">Date</TableHead>
                  <TableHead className="text-[hsl(220,9%,65%)]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-[hsl(224,14%,15%)] hover:bg-[hsl(224,14%,10%)]">
                    <TableCell>
                      <div>
                        <p className="text-white font-medium">{transaction.seller_profile?.brand_name || 'N/A'}</p>
                        <p className="text-[hsl(220,9%,55%)] text-sm">{transaction.seller_profile?.business_name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[hsl(220,9%,55%)]" />
                        <div>
                          <p className="text-white text-sm">{transaction.seller_profile?.bank_name}</p>
                          <p className="text-[hsl(220,9%,55%)] text-xs">{transaction.seller_profile?.account_number}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      ₦{transaction.total_amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-[hsl(200,100%,50%)]">
                      ₦{transaction.commission_amount.toLocaleString()}
                      <span className="text-xs text-[hsl(220,9%,55%)]"> ({transaction.commission_rate}%)</span>
                    </TableCell>
                    <TableCell className="text-green-400 font-semibold">
                      ₦{transaction.seller_amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="text-[hsl(220,9%,65%)]">
                      {format(new Date(transaction.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {transaction.status === 'pending' && (
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => setSelectedPayout(transaction)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Pay
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[hsl(224,14%,7%)] border-[hsl(224,14%,15%)]">
                              <DialogHeader>
                                <DialogTitle className="text-white">Confirm Payout</DialogTitle>
                                <DialogDescription className="text-[hsl(220,9%,55%)]">
                                  Transfer ₦{transaction.seller_amount.toLocaleString()} to seller
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="p-4 rounded-lg bg-[hsl(224,14%,10%)] border border-[hsl(224,14%,20%)]">
                                  <div className="flex items-center gap-3 mb-3">
                                    <CreditCard className="w-5 h-5 text-[hsl(200,100%,50%)]" />
                                    <span className="text-white font-medium">Bank Details</span>
                                  </div>
                                  <div className="space-y-1 text-sm">
                                    <p className="text-[hsl(220,9%,65%)]">Bank: <span className="text-white">{transaction.seller_profile?.bank_name}</span></p>
                                    <p className="text-[hsl(220,9%,65%)]">Account: <span className="text-white">{transaction.seller_profile?.account_number}</span></p>
                                    <p className="text-[hsl(220,9%,65%)]">Amount: <span className="text-green-400 font-bold">₦{transaction.seller_amount.toLocaleString()}</span></p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-[hsl(220,9%,75%)]">Payment Reference</Label>
                                  <Input
                                    value={paymentReference}
                                    onChange={(e) => setPaymentReference(e.target.value)}
                                    placeholder="Enter transaction reference"
                                    className="bg-[hsl(224,14%,10%)] border-[hsl(224,14%,20%)] text-white"
                                  />
                                </div>
                                <div className="flex gap-2 pt-2">
                                  <Button
                                    onClick={handleApprovePayout}
                                    disabled={processing}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Confirm Payment
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => setSelectedPayout(transaction)}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[hsl(224,14%,7%)] border-[hsl(224,14%,15%)]">
                              <DialogHeader>
                                <DialogTitle className="text-white flex items-center gap-2">
                                  <AlertCircle className="w-5 h-5 text-red-400" />
                                  Reject Payout
                                </DialogTitle>
                                <DialogDescription className="text-[hsl(220,9%,55%)]">
                                  Are you sure you want to reject this payout?
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label className="text-[hsl(220,9%,75%)]">Reason (Optional)</Label>
                                  <Textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Enter reason for rejection"
                                    className="bg-[hsl(224,14%,10%)] border-[hsl(224,14%,20%)] text-white"
                                  />
                                </div>
                                <Button
                                  onClick={handleRejectPayout}
                                  disabled={processing}
                                  variant="destructive"
                                  className="w-full"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject Payout
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                      {transaction.status === 'paid' && (
                        <span className="text-green-400 text-sm flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Paid
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-[hsl(220,9%,55%)]">
                      <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No payout transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
