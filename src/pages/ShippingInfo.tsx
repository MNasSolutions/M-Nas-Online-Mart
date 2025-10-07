import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Truck, Clock, MapPin } from "lucide-react";

export default function ShippingInfo() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Shipping Information</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Truck className="h-8 w-8 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Standard Shipping</h3>
                    <p className="text-muted-foreground">3-7 business days</p>
                    <p className="text-muted-foreground">Free on orders over $50</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Package className="h-8 w-8 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Express Shipping</h3>
                    <p className="text-muted-foreground">1-3 business days</p>
                    <p className="text-muted-foreground">Additional fees apply</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Processing Time</h2>
                </div>
                <p className="text-muted-foreground">
                  Orders are typically processed within 1-2 business days. You'll receive a confirmation 
                  email once your order ships with tracking information.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Delivery Areas</h2>
                </div>
                <p className="text-muted-foreground mb-3">
                  We currently deliver to select regions. Please ensure your address is complete and accurate 
                  to avoid delivery delays.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Domestic shipping available nationwide</li>
                  <li>International shipping for select countries</li>
                  <li>Contact us for specific location inquiries</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">Tracking Your Order</h2>
                <p className="text-muted-foreground mb-3">
                  Once your order ships, you'll receive:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Email notification with tracking number</li>
                  <li>Real-time updates on your order status</li>
                  <li>Estimated delivery date</li>
                  <li>Access to our Track Order page for detailed tracking</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">Shipping Costs</h2>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-muted-foreground mb-2">
                    <strong>Free Standard Shipping:</strong> Orders over $50
                  </p>
                  <p className="text-muted-foreground mb-2">
                    <strong>Standard Shipping:</strong> $5.99 flat rate
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Express Shipping:</strong> Calculated at checkout
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">Important Notes</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Shipping times are estimates and may vary during peak seasons</li>
                  <li>Address changes must be requested within 24 hours of order placement</li>
                  <li>We are not responsible for delays caused by customs or local carriers</li>
                  <li>A signature may be required for high-value items</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
