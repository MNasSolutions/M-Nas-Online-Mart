import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Admin notification recipients
const ADMIN_EMAILS = [
  "mnassolutions007@gmail.com",
  "mnassolutions@gmail.com", 
  "send2muhammadsaadahmad@gmail.com"
];

const ADMIN_WHATSAPP = "07069036157";

interface RegistrationNotificationRequest {
  type: "buyer" | "seller" | "product_upload" | "new_order" | "order_shipped" | "order_delivered" | "order_cancelled" | "payout_request" | "newsletter";
  data: {
    full_name?: string;
    email?: string;
    phone?: string;
    account_type?: string;
    business_name?: string;
    product_name?: string;
    order_number?: string;
    amount?: number;
    timestamp?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: RegistrationNotificationRequest = await req.json();
    const timestamp = data.timestamp || new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" });

    console.log(`Processing ${type} notification:`, data);

    // Build notification content based on type
    let subject = "";
    let htmlContent = "";
    let whatsappMessage = "";

    switch (type) {
      case "buyer":
        subject = "🛒 New Buyer Registration - M Nas Online Mart";
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0891b2, #0e7490); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0;">🛒 New Buyer Registration</h1>
            </div>
            <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
              <h2 style="color: #0891b2;">Registration Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Full Name:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${data.full_name || "N/A"}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${data.email || "N/A"}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${data.phone || "N/A"}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Account Type:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">Buyer</td></tr>
                <tr><td style="padding: 10px;"><strong>Date & Time:</strong></td><td style="padding: 10px;">${timestamp}</td></tr>
              </table>
            </div>
            <div style="background: #0891b2; color: white; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
              <p style="margin: 0; font-size: 14px;">M Nas Online Mart - Your Trusted Marketplace</p>
            </div>
          </div>
        `;
        whatsappMessage = `🛒 *New Buyer Registration*\n\nName: ${data.full_name}\nEmail: ${data.email}\nPhone: ${data.phone}\nTime: ${timestamp}`;
        break;

      case "seller":
        subject = "🏪 New Seller Registration - M Nas Online Mart";
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0;">🏪 New Seller Registration</h1>
            </div>
            <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
              <h2 style="color: #f97316;">Registration Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Full Name:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${data.full_name || "N/A"}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Business Name:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${data.business_name || "N/A"}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${data.email || "N/A"}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${data.phone || "N/A"}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Account Type:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">Seller</td></tr>
                <tr><td style="padding: 10px;"><strong>Date & Time:</strong></td><td style="padding: 10px;">${timestamp}</td></tr>
              </table>
              <div style="margin-top: 15px; padding: 15px; background: #fef3c7; border-radius: 8px;">
                <p style="margin: 0; color: #92400e;"><strong>⚠️ Action Required:</strong> Please review this seller application in the admin dashboard.</p>
              </div>
            </div>
            <div style="background: #f97316; color: white; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
              <p style="margin: 0; font-size: 14px;">M Nas Online Mart - Your Trusted Marketplace</p>
            </div>
          </div>
        `;
        whatsappMessage = `🏪 *New Seller Registration*\n\nName: ${data.full_name}\nBusiness: ${data.business_name}\nEmail: ${data.email}\nPhone: ${data.phone}\nTime: ${timestamp}\n\n⚠️ Please review in admin dashboard.`;
        break;

      case "new_order":
        subject = "📦 New Order Placed - M Nas Online Mart";
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0;">📦 New Order Placed!</h1>
            </div>
            <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
              <h2 style="color: #22c55e;">Order Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Order Number:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${data.order_number || "N/A"}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Customer:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${data.full_name || "N/A"}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Amount:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">₦${data.amount?.toLocaleString() || "0"}</td></tr>
                <tr><td style="padding: 10px;"><strong>Date & Time:</strong></td><td style="padding: 10px;">${timestamp}</td></tr>
              </table>
            </div>
          </div>
        `;
        whatsappMessage = `📦 *New Order!*\n\nOrder: ${data.order_number}\nCustomer: ${data.full_name}\nAmount: ₦${data.amount?.toLocaleString()}\nTime: ${timestamp}`;
        break;

      case "payout_request":
        subject = "💰 Seller Payout Request - M Nas Online Mart";
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0;">💰 Payout Request</h1>
            </div>
            <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
              <h2 style="color: #8b5cf6;">Request Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Seller:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${data.full_name || "N/A"}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Amount:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">₦${data.amount?.toLocaleString() || "0"}</td></tr>
                <tr><td style="padding: 10px;"><strong>Date & Time:</strong></td><td style="padding: 10px;">${timestamp}</td></tr>
              </table>
              <div style="margin-top: 15px; padding: 15px; background: #fef3c7; border-radius: 8px;">
                <p style="margin: 0; color: #92400e;"><strong>⚠️ Action Required:</strong> Please process this payout request.</p>
              </div>
            </div>
          </div>
        `;
        whatsappMessage = `💰 *Payout Request*\n\nSeller: ${data.full_name}\nAmount: ₦${data.amount?.toLocaleString()}\nTime: ${timestamp}\n\n⚠️ Please process in admin dashboard.`;
        break;

      default:
        subject = "📢 Notification - M Nas Online Mart";
        htmlContent = `<p>New notification: ${type}</p><pre>${JSON.stringify(data, null, 2)}</pre>`;
        whatsappMessage = `📢 New ${type} notification`;
    }

    // Send emails to all admin addresses
    const emailPromises = ADMIN_EMAILS.map(email => 
      resend.emails.send({
        from: "M Nas Online Mart <onboarding@resend.dev>",
        to: [email],
        subject,
        html: htmlContent,
      })
    );

    await Promise.all(emailPromises);
    console.log("Emails sent successfully to all admins");

    // Log WhatsApp message (actual integration would need Twilio/WhatsApp API)
    console.log("WhatsApp notification:", {
      to: ADMIN_WHATSAPP,
      message: whatsappMessage
    });

    return new Response(
      JSON.stringify({ success: true, message: "Notifications sent" }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error("Notification error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);
