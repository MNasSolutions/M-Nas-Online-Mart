import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by visiting the Track Order page and entering your order number. You'll receive an email with your order number when your order is confirmed.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept bank transfers and online payments. For bank transfers, you'll receive our account details during checkout.",
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-7 business days. You'll receive tracking information once your order ships.",
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Please visit our Return Policy page for full details.",
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we ship within selected regions. Please contact us for international shipping inquiries.",
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach us via email at mnassolutions007@gmail.com or through our Contact page. We typically respond within 24 hours.",
    },
    {
      question: "Can I cancel my order?",
      answer: "Orders can be cancelled within 24 hours of placement. Please contact us immediately if you need to cancel an order.",
    },
    {
      question: "Are my payment details secure?",
      answer: "Yes, we use industry-standard encryption to protect your payment information. We never store your full payment details.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
            <p className="text-muted-foreground mb-4">
              Can't find the answer you're looking for? Please contact our customer support team.
            </p>
            <a
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              Contact Support →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
