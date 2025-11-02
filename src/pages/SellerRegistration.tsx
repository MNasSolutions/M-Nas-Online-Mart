import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function SellerRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    brandName: "",
    ownerFullName: "",
    email: user?.email || "",
    phone: "",
    country: "",
    state: "",
    city: "",
    businessAddress: "",
    productCategory: "",
    bankName: "",
    accountNumber: "",
    businessWebsite: "",
    businessLogo: null as File | null,
    idCard: null as File | null,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply as a seller",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!agreed) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the 15% commission terms",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // TODO: Upload files to storage if provided
      let businessLogoUrl = null;
      let idCardUrl = null;

      // Insert seller application
      const { error } = await supabase
        .from("seller_applications")
        .insert({
          user_id: user.id,
          business_name: formData.businessName,
          brand_name: formData.brandName,
          owner_full_name: formData.ownerFullName,
          email: formData.email || user.email,
          phone: formData.phone,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          business_address: formData.businessAddress,
          product_category: formData.productCategory,
          bank_name: formData.bankName,
          account_number: formData.accountNumber,
          business_logo_url: businessLogoUrl,
          id_card_url: idCardUrl,
          business_website: formData.businessWebsite,
          agreed_to_commission: agreed,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your seller application has been submitted for review. You will be notified once approved.",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sellerTerms = `
SELLER TERMS & COMMISSION AGREEMENT

By registering as a seller on M Nas Solutions Online Mart, you agree to the following:

1. COMMISSION STRUCTURE
   - A 15% commission will be deducted from every sale you make
   - You will receive 85% of the sale price after commission
   - Commission is automatically calculated and recorded for each transaction

2. PAYMENT DETAILS
   - Admin receives commission payments to:
     * Opay Account: 7069036157 - Abubakar Ahmad Saad
     * Moniepoint Account: 7069036157 - Muhammad Ahmad Saad
   - Seller receives remaining amount to registered bank account

3. SELLER RESPONSIBILITIES
   - Provide accurate product information
   - Maintain adequate inventory
   - Respond to customer inquiries promptly
   - Ship products within agreed timeframes
   - Maintain quality standards

4. APPROVAL PROCESS
   - All applications are reviewed by admin
   - Approval typically takes 1-3 business days
   - Rejected applications include reason for rejection

5. ACCOUNT STATUS
   - Admin reserves right to suspend accounts for policy violations
   - Sellers can be deactivated for fraudulent activity
   - All transactions are monitored for compliance

By checking the box below, you confirm that you have read and agree to these terms.
  `;

  if (showTerms) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Seller Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm mb-6">{sellerTerms}</pre>
              <Button onClick={() => setShowTerms(false)}>
                Back to Application
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Become a Seller</CardTitle>
              <CardDescription>
                Join M Nas Solutions Online Mart as a seller and reach thousands of customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertDescription>
                  <strong>Commission:</strong> A 15% commission applies to all sales. You will receive 85% of each sale.
                  <Button
                    variant="link"
                    className="p-0 h-auto ml-2"
                    onClick={() => setShowTerms(true)}
                  >
                    Read full terms
                  </Button>
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Business Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        required
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="brandName">Brand Name *</Label>
                      <Input
                        id="brandName"
                        required
                        placeholder="e.g., Samsung, Amazon"
                        value={formData.brandName}
                        onChange={(e) => handleInputChange("brandName", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ownerFullName">Owner Full Name *</Label>
                    <Input
                      id="ownerFullName"
                      required
                      value={formData.ownerFullName}
                      onChange={(e) => handleInputChange("ownerFullName", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        placeholder="+234..."
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="productCategory">Product Category *</Label>
                    <Select
                      value={formData.productCategory}
                      onValueChange={(value) => handleInputChange("productCategory", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                        <SelectItem value="home">Home & Garden</SelectItem>
                        <SelectItem value="health">Health & Beauty</SelectItem>
                        <SelectItem value="sports">Sports & Outdoors</SelectItem>
                        <SelectItem value="books">Books & Media</SelectItem>
                        <SelectItem value="toys">Toys & Games</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Location</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        required
                        placeholder="Nigeria"
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        required
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        required
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="businessAddress">Business Address *</Label>
                    <Textarea
                      id="businessAddress"
                      required
                      value={formData.businessAddress}
                      onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                    />
                  </div>
                </div>

                {/* Banking Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Banking Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Input
                        id="bankName"
                        required
                        value={formData.bankName}
                        onChange={(e) => handleInputChange("bankName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number *</Label>
                      <Input
                        id="accountNumber"
                        required
                        value={formData.accountNumber}
                        onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Information (Optional)</h3>
                  
                  <div>
                    <Label htmlFor="businessWebsite">Business Website</Label>
                    <Input
                      id="businessWebsite"
                      type="url"
                      placeholder="https://..."
                      value={formData.businessWebsite}
                      onChange={(e) => handleInputChange("businessWebsite", e.target.value)}
                    />
                  </div>
                </div>

                {/* Agreement */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the 15% commission on all sales and have read the{" "}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-primary underline"
                    >
                      seller terms and conditions
                    </button>
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={loading || !agreed}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
