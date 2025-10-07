import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About MNAS Online Mart</h1>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                MNAS Online Mart is your trusted destination for quality products at competitive prices. 
                We started with a simple mission: to make online shopping easy, secure, and enjoyable for everyone.
              </p>
              <p className="text-muted-foreground mb-4">
                From electronics to fashion, home essentials to sports equipment, we curate a diverse 
                selection of products to meet your everyday needs.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Quality:</strong> We carefully select products from trusted suppliers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Customer Service:</strong> Your satisfaction is our top priority</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Security:</strong> Safe and secure shopping experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Transparency:</strong> Clear pricing and honest communication</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> mnassolutions007@gmail.com</p>
                <p><strong>Alternative Emails:</strong></p>
                <ul className="list-disc list-inside ml-4">
                  <li>mnassolutions@gmail.com</li>
                  <li>send2muhammadsaadahmad@gmail.com</li>
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
