import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <h2>1. Introduction</h2>
            <p>
              M Nas Solutions Online Mart ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our e-commerce platform.
            </p>

            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Personal Information</h3>
            <p>We collect information that you provide directly to us:</p>
            <ul>
              <li>Name, email address, and phone number</li>
              <li>Shipping and billing addresses</li>
              <li>Payment information (processed through secure gateways)</li>
              <li>Account credentials (username and encrypted password)</li>
              <li>Profile information (for buyers and sellers)</li>
            </ul>

            <h3>2.2 Business Information (for Sellers)</h3>
            <ul>
              <li>Business name and brand name</li>
              <li>Business address and location</li>
              <li>Bank account details</li>
              <li>Tax identification numbers</li>
              <li>Business documentation and IDs</li>
            </ul>

            <h3>2.3 Automatically Collected Information</h3>
            <ul>
              <li>Device information and IP address</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>Clickstream data</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h3>2.4 Transaction Information</h3>
            <ul>
              <li>Purchase history and order details</li>
              <li>Payment method and transaction IDs</li>
              <li>Shipping and tracking information</li>
              <li>Product reviews and ratings</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use collected information for:</p>
            <ul>
              <li><strong>Order Processing:</strong> To process and fulfill your orders</li>
              <li><strong>Communication:</strong> To send order confirmations, shipping updates, and customer support</li>
              <li><strong>Payment Processing:</strong> To process payments and calculate commissions</li>
              <li><strong>Account Management:</strong> To create and manage user accounts</li>
              <li><strong>Platform Improvement:</strong> To analyze usage and improve our services</li>
              <li><strong>Marketing:</strong> To send promotional content (with your consent)</li>
              <li><strong>Security:</strong> To detect and prevent fraud</li>
              <li><strong>Legal Compliance:</strong> To comply with Nigerian laws and regulations</li>
            </ul>

            <h2>4. Information Sharing and Disclosure</h2>
            
            <h3>4.1 With Sellers</h3>
            <p>When you make a purchase, we share necessary information with sellers to fulfill your order:</p>
            <ul>
              <li>Your name and shipping address</li>
              <li>Contact information for delivery</li>
              <li>Order details and payment confirmation</li>
            </ul>

            <h3>4.2 With Payment Processors</h3>
            <p>We share payment information with:</p>
            <ul>
              <li>Paystack and Flutterwave for payment processing</li>
              <li>Banks for direct transfers</li>
              <li>Opay and Moniepoint for commission payments</li>
            </ul>

            <h3>4.3 With Service Providers</h3>
            <p>We may share information with third-party service providers who assist us in:</p>
            <ul>
              <li>Email delivery (Resend)</li>
              <li>SMS notifications</li>
              <li>Analytics and performance monitoring</li>
              <li>Cloud hosting services</li>
            </ul>

            <h3>4.4 Admin Access</h3>
            <p>
              Super Admin Muhammad Sa'ad Ahmad (M Nas Solutions) has full access to all platform data for management, oversight, and customer support purposes.
            </p>

            <h2>5. Data Security</h2>
            <p>We implement security measures to protect your information:</p>
            <ul>
              <li>Encrypted password storage</li>
              <li>Secure HTTPS connections</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>Secure payment gateways</li>
            </ul>

            <h2>6. Your Rights and Choices</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update incorrect or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing emails</li>
              <li><strong>Data Portability:</strong> Request your data in a portable format</li>
            </ul>

            <h2>7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance user experience, analyze traffic, and remember preferences. You can control cookies through your browser settings.
            </p>

            <h2>8. Children's Privacy</h2>
            <p>
              Our platform is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we become aware of such collection, we will take steps to delete the information.
            </p>

            <h2>9. Data Retention</h2>
            <p>
              We retain your information for as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements. Transaction records are kept for a minimum of 7 years as required by Nigerian law.
            </p>

            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries outside Nigeria. We ensure appropriate safeguards are in place to protect your data.
            </p>

            <h2>11. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Users will be notified of material changes via email or platform notification.
            </p>

            <h2>12. Contact Us</h2>
            <p>For privacy-related questions or to exercise your rights, contact:</p>
            <ul>
              <li>Email: mnassolutions007@gmail.com</li>
              <li>Email: send2muhammadsaadahmad@gmail.com</li>
              <li>WhatsApp/SMS: +2347069036157</li>
              <li>Super Admin: Muhammad Sa'ad Ahmad (M Nas Solutions)</li>
            </ul>

            <h2>13. Governing Law</h2>
            <p>
              This Privacy Policy is governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved under Nigerian jurisdiction.
            </p>

            <p className="mt-8 font-semibold">
              By using M Nas Solutions Online Mart, you consent to the collection and use of your information as described in this Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
