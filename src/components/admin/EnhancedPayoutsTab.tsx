import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle, DollarSign, Clock, Wallet, BadgeCheck, AlertCircle } from "lucide-react";

interface PayoutRequest {
  id: string;
  seller_id: string;
  order_id: string;
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

const BANK_CODES: Record<string, string> = {
  'Opay': '999992',
  'Moniepoint': '50515',
  'Access Bank': '044',
  'GTBank': '058',
  'First Bank': '011',
  'UBA': '033',
  'Zenith Bank': '057',
  'Kuda Bank': '090267',
  'PalmPay': '999991',
  'Wema Bank': '035',
  'Stanbic IBTC': '221',
  'Sterling Bank': '232',
  'Fidelity Bank': '070',
  'FCMB': '214',
  'Union Bank': '032',
  'Polaris Bank': '076',
  'Ecobank': '050',
};

export default function EnhancedPayoutsTab() {
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [verifyingBank, setVerifyingBank] = useState(false);
  const [bankVerification, setBankVerification] = useState<{ verified: boolean; account_name: string } | null>(null);

  // Stats
  const [stats, setStats] = useState({
    pending: 0,
    pendingAmount: 0,
    paid: 0,
    paidAmount: 0,
    totalCommission: 0,
  });

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    setLoading(true);
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

      setPayouts(data || []);

      // Calculate stats
      const pending = data?.filter(p => p.status === 'pending') || [];
      const paid = data?.filter(p => p.status === 'paid') || [];
      
      setStats({
        pending: pending.length,
        pendingAmount: pending.reduce((sum, p) => sum + p.seller_amount, 0),
        paid: paid.length,
        paidAmount: paid.reduce((sum, p) => sum + p.seller_amount, 0),
        totalCommission: (data || []).reduce((sum, p) => sum + p.commission_amount, 0),
      });

    } catch (error: any) {
      console.error('Error loading payouts:', error);
      toast.error('Failed to load payouts');
    } finally {
      setLoading(false);
    }
  };

  const verifyBankAccount = async (accountNumber: string, bankName: string) => {
    setVerifyingBank(true);
    setBankVerification(null);

    try {
      const bankCode = BANK_CODES[bankName];
      if (!bankCode) {
        toast.error(`Bank code not found for ${bankName}`);
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('verify-bank-account', {
        body: { account_number: accountNumber, bank_code: bankCode },
        headers: {
          Authorization: `Bearer ${session?.session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data.verified) {
        setBankVerification({
          verified: true,
          account_name: data.account_name,
        });
        toast.success(`Account verified: ${data.account_name}`);
      } else {
        toast.error(data.error || 'Account verification failed');
      }
    } catch (error: any) {
      console.error('Bank verification error:', error);
      toast.error('Failed to verify bank account');
    } finally {
      setVerifyingBank(false);
    }
  };

  const handleApprovePayout = async () => {
    if (!selectedPayout || !paymentReference) {
      toast.error('Please enter payment reference');
      return;
    }

    try {
      const { error } = await supabase
        .from('commission_transactions')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('id', selectedPayout.id);

      if (error) throw error;

      // Update seller's total_sales
      await supabase
        .from('seller_profiles')
        .update({
          total_sales: selectedPayout.seller_profile 
            ? (await supabase
                .from('seller_profiles')
                .select('total_sales')
                .eq('id', selectedPayout.seller_id)
                .single()).data?.total_sales || 0 + selectedPayout.seller_amount
            : selectedPayout.seller_amount
        })
        .eq('id', selectedPayout.seller_id);

      toast.success('Payout approved and marked as paid');
      setSelectedPayout(null);
      setPaymentReference("");
      setBankVerification(null);
      loadPayouts();
    } catch (error: any) {
      console.error('Error approving payout:', error);
      toast.error('Failed to approve payout');
    }
  };

  const handleRejectPayout = async () => {
    if (!selectedPayout) return;

    try {
      const { error } = await supabase
        .from('commission_transactions')
        .update({
          status: 'rejected',
        })
        .eq('id', selectedPayout.id);

      if (error) throw error;

      toast.success('Payout rejected');
      setSelectedPayout(null);
      setRejectionReason("");
      loadPayouts();
    } catch (error: any) {
      console.error('Error rejecting payout:', error);
      toast.error('Failed to reject payout');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'paid':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-500"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-500"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(200,100%,50%)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[hsl(224,14%,8%)] border-[hsl(224,14%,12%)]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-[hsl(220,9%,65%)]">Pending Payouts</p>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
                <p className="text-sm text-yellow-500">₦{stats.pendingAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(224,14%,8%)] border-[hsl(224,14%,12%)]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-[hsl(220,9%,65%)]">Paid Out</p>
                <p className="text-2xl font-bold text-white">{stats.paid}</p>
                <p className="text-sm text-green-500">₦{stats.paidAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(224,14%,8%)] border-[hsl(224,14%,12%)]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-[hsl(200,100%,50%)]/20 rounded-lg">
                <Wallet className="w-6 h-6 text-[hsl(200,100%,50%)]" />
              </div>
              <div>
                <p className="text-sm text-[hsl(220,9%,65%)]">Total Commission</p>
                <p className="text-2xl font-bold text-white">₦{stats.totalCommission.toLocaleString()}</p>
                <p className="text-sm text-[hsl(200,100%,50%)]">Platform earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(224,14%,8%)] border-[hsl(224,14%,12%)]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-[hsl(220,9%,65%)]">Commission Rate</p>
                <p className="text-2xl font-bold text-white">15%</p>
                <p className="text-sm text-purple-500">Per transaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payouts Table */}
      <Card className="bg-[hsl(224,14%,8%)] border-[hsl(224,14%,12%)]">
        <CardHeader>
          <CardTitle className="text-white">Seller Payout Requests</CardTitle>
          <CardDescription className="text-[hsl(220,9%,65%)]">
            Manage and process seller withdrawal requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(224,14%,12%)]">
                <TableHead className="text-[hsl(220,9%,65%)]">Seller</TableHead>
                <TableHead className="text-[hsl(220,9%,65%)]">Bank Details</TableHead>
                <TableHead className="text-[hsl(220,9%,65%)]">Order Total</TableHead>
                <TableHead className="text-[hsl(220,9%,65%)]">Commission</TableHead>
                <TableHead className="text-[hsl(220,9%,65%)]">Payout Amount</TableHead>
                <TableHead className="text-[hsl(220,9%,65%)]">Status</TableHead>
                <TableHead className="text-[hsl(220,9%,65%)]">Date</TableHead>
                <TableHead className="text-[hsl(220,9%,65%)]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id} className="border-[hsl(224,14%,12%)]">
                  <TableCell className="text-white">
                    <div>
                      <p className="font-medium">{payout.seller_profile?.business_name || 'N/A'}</p>
                      <p className="text-sm text-[hsl(220,9%,65%)]">{payout.seller_profile?.brand_name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    <div>
                      <p className="font-medium">{payout.seller_profile?.bank_name || 'N/A'}</p>
                      <p className="text-sm text-[hsl(220,9%,65%)]">{payout.seller_profile?.account_number}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-white font-medium">₦{payout.total_amount.toLocaleString()}</TableCell>
                  <TableCell className="text-[hsl(200,100%,50%)]">₦{payout.commission_amount.toLocaleString()}</TableCell>
                  <TableCell className="text-green-500 font-bold">₦{payout.seller_amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(payout.status || 'pending')}</TableCell>
                  <TableCell className="text-[hsl(220,9%,65%)]">
                    {new Date(payout.created_at || '').toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {payout.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => setSelectedPayout(payout)}
                            >
                              Pay
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-[hsl(224,14%,8%)] border-[hsl(224,14%,12%)]">
                            <DialogHeader>
                              <DialogTitle className="text-white">Process Payout</DialogTitle>
                              <DialogDescription className="text-[hsl(220,9%,65%)]">
                                Verify bank details and confirm payment
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4 py-4">
                              {/* Bank Details */}
                              <div className="bg-[hsl(224,14%,12%)] p-4 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-[hsl(220,9%,65%)]">Bank:</span>
                                  <span className="text-white font-medium">{payout.seller_profile?.bank_name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[hsl(220,9%,65%)]">Account:</span>
                                  <span className="text-white font-medium">{payout.seller_profile?.account_number}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[hsl(220,9%,65%)]">Amount:</span>
                                  <span className="text-green-500 font-bold">₦{payout.seller_amount.toLocaleString()}</span>
                                </div>
                              </div>

                              {/* Bank Verification */}
                              <div>
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  disabled={verifyingBank}
                                  onClick={() => verifyBankAccount(
                                    payout.seller_profile?.account_number || '',
                                    payout.seller_profile?.bank_name || ''
                                  )}
                                >
                                  {verifyingBank ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  ) : (
                                    <BadgeCheck className="w-4 h-4 mr-2" />
                                  )}
                                  Verify Bank Account
                                </Button>
                                {bankVerification?.verified && (
                                  <div className="mt-2 p-2 bg-green-500/20 rounded flex items-center">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                    <span className="text-green-500 text-sm">
                                      Verified: {bankVerification.account_name}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Payment Reference */}
                              <div>
                                <Label className="text-white">Payment Reference</Label>
                                <Input
                                  placeholder="Enter transaction reference"
                                  value={paymentReference}
                                  onChange={(e) => setPaymentReference(e.target.value)}
                                  className="bg-[hsl(224,14%,12%)] border-[hsl(224,14%,16%)] text-white"
                                />
                              </div>
                            </div>

                            <DialogFooter>
                              <Button 
                                variant="outline" 
                                onClick={() => setSelectedPayout(null)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={handleApprovePayout}
                                disabled={!paymentReference}
                              >
                                Confirm Payment
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => setSelectedPayout(payout)}
                            >
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-[hsl(224,14%,8%)] border-[hsl(224,14%,12%)]">
                            <DialogHeader>
                              <DialogTitle className="text-white">Reject Payout</DialogTitle>
                              <DialogDescription className="text-[hsl(220,9%,65%)]">
                                Provide a reason for rejecting this payout
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="py-4">
                              <Label className="text-white">Rejection Reason</Label>
                              <Textarea
                                placeholder="Enter reason for rejection..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="bg-[hsl(224,14%,12%)] border-[hsl(224,14%,16%)] text-white"
                              />
                            </div>

                            <DialogFooter>
                              <Button 
                                variant="outline" 
                                onClick={() => setSelectedPayout(null)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                variant="destructive"
                                onClick={handleRejectPayout}
                              >
                                Confirm Rejection
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                    {payout.status === 'paid' && (
                      <span className="text-green-500 text-sm">
                        Paid {payout.paid_at ? new Date(payout.paid_at).toLocaleDateString() : ''}
                      </span>
                    )}
                    {payout.status === 'rejected' && (
                      <span className="text-red-500 text-sm">Rejected</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {payouts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-[hsl(220,9%,65%)]">
                    No payout transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
