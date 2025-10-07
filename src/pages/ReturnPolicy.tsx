import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, RefreshCcw } from "lucide-react";

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Return & Refund Policy</h1>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4 mb-6">
                <RefreshCcw className="h-8 w-8 text-primary mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">30-Day Return Policy</h2>
                  <p className="text-muted-foreground">
                    We want you to be completely satisfied with your purchase. If you're not happy with your 
                    order, you can return it within 30 days of delivery for a full refund or exchange.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <h3 className="text-xl font-semibold">Eligible for Return</h3>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Items in original condition with tags attached</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Unworn, unwashed, and undamaged products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Original packaging included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Returned within 30 days of delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Proof of purchase provided</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <XCircle className="h-6 w-6 text-red-500 mt-1" />
                  <h3 className="text-xl font-semibold">Not Eligible for Return</h3>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Personalized or customized items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Underwear, swimwear, and intimate apparel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Items marked as final sale</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Opened electronics or software</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Items damaged due to misuse</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-3">How to Return an Item</h2>
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">1.</span>
                    <span>Contact our customer service team at mnassolutions007@gmail.com to initiate a return</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">2.</span>
                    <span>Provide your order number and reason for return</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">3.</span>
                    <span>Receive return authorization and shipping instructions</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">4.</span>
                    <span>Pack the item securely in its original packaging</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">5.</span>
                    <span>Ship the item to the provided return address</span>
                  </li>
                </ol>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">Refund Processing</h2>
                <p className="text-muted-foreground mb-3">
                  Once we receive your return:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Returns are inspected within 2-3 business days</li>
                  <li>Approved refunds are processed within 5-7 business days</li>
                  <li>Refunds are issued to the original payment method</li>
                  <li>You'll receive an email confirmation when your refund is processed</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">Exchanges</h2>
                <p className="text-muted-foreground">
                  We gladly accept exchanges for different sizes or colors. Contact us to arrange an 
                  exchange. Exchanges are subject to product availability.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">Return Shipping Costs</h2>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-muted-foreground mb-2">
                    <strong>Defective or Incorrect Items:</strong> We cover return shipping
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Change of Mind:</strong> Customer is responsible for return shipping costs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Questions?</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about our return policy, please don't hesitate to contact us.
            </p>
            <a
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              Contact Customer Service →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
