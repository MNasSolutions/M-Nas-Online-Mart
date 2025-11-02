import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Terms and Conditions</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using M Nas Solutions Online Mart, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
            </p>

            <h2>2. User Accounts</h2>
            <p>
              To use certain features of our platform, you must create an account. You are responsible for:
            </p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring your account information is accurate and up-to-date</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>

            <h2>3. Buyer Terms</h2>
            <p>As a buyer on our platform, you agree to:</p>
            <ul>
              <li>Provide accurate shipping and payment information</li>
              <li>Complete payment for orders placed</li>
              <li>Review products before leaving feedback</li>
              <li>Contact sellers for product-related issues</li>
              <li>Follow our refund and return policies</li>
            </ul>

            <h2>4. Seller Terms</h2>
            <p>As a seller on our platform, you agree to:</p>
            <ul>
              <li>Pay a 15% commission on all sales</li>
              <li>Provide accurate product information</li>
              <li>Ship products within agreed timeframes</li>
              <li>Maintain adequate inventory levels</li>
              <li>Respond to customer inquiries promptly</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>

            <h2>5. Commission Structure</h2>
            <p>
              M Nas Solutions Online Mart operates on a commission-based model:
            </p>
            <ul>
              <li>Platform commission: 15% of each sale</li>
              <li>Seller receives: 85% of the sale price</li>
              <li>Commission is automatically deducted from each transaction</li>
              <li>Payment to admin accounts (Opay: 7069036157, Moniepoint: 7069036157)</li>
            </ul>

            <h2>6. Payment Terms</h2>
            <p>
              All payments are processed through our integrated payment gateways including Paystack, Flutterwave, and bank transfers. By making a purchase, you agree to provide valid payment information and authorize the platform to charge your payment method.
            </p>

            <h2>7. Shipping and Delivery</h2>
            <p>
              Shipping costs are calculated based on product weight and destination. Delivery times vary by location. Sellers are responsible for ensuring timely delivery of products.
            </p>

            <h2>8. Product Reviews and Ratings</h2>
            <p>
              Buyers may leave reviews and ratings for products they purchase. Reviews must be:
            </p>
            <ul>
              <li>Based on actual experience with the product</li>
              <li>Honest and not misleading</li>
              <li>Free from offensive or inappropriate content</li>
              <li>Not incentivized or compensated</li>
            </ul>

            <h2>9. Prohibited Activities</h2>
            <p>Users are prohibited from:</p>
            <ul>
              <li>Selling counterfeit or illegal products</li>
              <li>Engaging in fraudulent transactions</li>
              <li>Manipulating reviews or ratings</li>
              <li>Misrepresenting products or services</li>
              <li>Harassing other users</li>
              <li>Violating intellectual property rights</li>
            </ul>

            <h2>10. Account Suspension and Termination</h2>
            <p>
              M Nas Solutions reserves the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or harm the platform's reputation. Super Admin Muhammad Sa'ad Ahmad has full authority over all account decisions.
            </p>

            <h2>11. Intellectual Property</h2>
            <p>
              All content on this platform, including logos, text, images, and software, is the property of M Nas Solutions Online Mart and protected by Nigerian and international copyright laws.
            </p>

            <h2>12. Limitation of Liability</h2>
            <p>
              M Nas Solutions Online Mart is not liable for:
            </p>
            <ul>
              <li>Product quality issues (buyer-seller matter)</li>
              <li>Shipping delays beyond our control</li>
              <li>Disputes between buyers and sellers</li>
              <li>Loss or damage during shipping</li>
            </ul>

            <h2>13. Dispute Resolution</h2>
            <p>
              All disputes will be resolved through our internal dispute resolution process. If unresolved, disputes will be subject to the laws of Nigeria.
            </p>

            <h2>14. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or platform notification.
            </p>

            <h2>15. Contact Information</h2>
            <p>For questions about these terms, contact:</p>
            <ul>
              <li>Email: mnassolutions007@gmail.com</li>
              <li>WhatsApp/SMS: +2347069036157</li>
              <li>Super Admin: Muhammad Sa'ad Ahmad (M Nas Solutions)</li>
            </ul>

            <p className="mt-8 font-semibold">
              By using M Nas Solutions Online Mart, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
