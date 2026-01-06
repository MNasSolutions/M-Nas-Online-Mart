import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StatusNotificationRequest {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  newStatus: string;
  shippingAddress?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Unauthorized request - missing Authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized - Authentication required" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestData: StatusNotificationRequest = await req.json();
    const { orderNumber, customerName, customerEmail, customerPhone, newStatus, shippingAddress } = requestData;

    console.log(`Processing status notification for order ${orderNumber} - Status: ${newStatus}`);

    const adminEmails = [
      "mnassolutions007@gmail.com",
      "mnassolutions@gmail.com",
      "send2muhammadsaadahmad@gmail.com",
    ];

    const whatsappNumber = "2347069036157";

    // Status-specific email content
    let customerSubject = "";
    let customerHtml = "";
    let adminSubject = "";
    let adminHtml = "";

    switch (newStatus) {
      case "shipped":
        customerSubject = `🚚 Your Order ${orderNumber} Has Been Shipped!`;
        customerHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Your Order is on its Way! 🚚</h1>
            <p>Hi ${customerName},</p>
            <p>Great news! Your order <strong>${orderNumber}</strong> has been shipped and is on its way to you.</p>
            ${shippingAddress ? `<p><strong>Delivery Address:</strong><br>${shippingAddress}</p>` : ''}
            <p>You can track your order using the order number on our website.</p>
            <p style="margin-top: 30px;">Thank you for shopping with M Nas Online Mart!</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">If you have any questions, contact us at mnassolutions007@gmail.com or WhatsApp: +234 706 903 6157</p>
          </div>
        `;
        adminSubject = `📦 Order ${orderNumber} Shipped`;
        adminHtml = `
          <h1>Order Shipped</h1>
          <p>Order <strong>${orderNumber}</strong> has been marked as shipped.</p>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Phone:</strong> ${customerPhone}</p>
        `;
        break;

      case "delivered":
        customerSubject = `✅ Your Order ${orderNumber} Has Been Delivered!`;
        customerHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #16a34a;">Order Delivered! ✅</h1>
            <p>Hi ${customerName},</p>
            <p>Your order <strong>${orderNumber}</strong> has been successfully delivered!</p>
            <p>We hope you love your purchase. If you have any questions or concerns about your order, please don't hesitate to contact us.</p>
            <p style="margin-top: 20px;">We'd love to hear your feedback! Please consider leaving a review for your purchased items.</p>
            <p style="margin-top: 30px;">Thank you for choosing M Nas Online Mart!</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">If you have any questions, contact us at mnassolutions007@gmail.com or WhatsApp: +234 706 903 6157</p>
          </div>
        `;
        adminSubject = `✅ Order ${orderNumber} Delivered`;
        adminHtml = `
          <h1>Order Delivered</h1>
          <p>Order <strong>${orderNumber}</strong> has been marked as delivered.</p>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Phone:</strong> ${customerPhone}</p>
        `;
        break;

      case "confirmed":
        customerSubject = `📋 Your Order ${orderNumber} Has Been Confirmed!`;
        customerHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Order Confirmed! 📋</h1>
            <p>Hi ${customerName},</p>
            <p>Your order <strong>${orderNumber}</strong> has been confirmed and is being prepared.</p>
            <p>We'll notify you once it ships!</p>
            <p style="margin-top: 30px;">Thank you for shopping with M Nas Online Mart!</p>
          </div>
        `;
        adminSubject = `📋 Order ${orderNumber} Confirmed`;
        adminHtml = `<h1>Order Confirmed</h1><p>Order <strong>${orderNumber}</strong> has been confirmed.</p>`;
        break;

      case "processing":
        customerSubject = `⚙️ Your Order ${orderNumber} is Being Processed`;
        customerHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #7c3aed;">Order Processing! ⚙️</h1>
            <p>Hi ${customerName},</p>
            <p>Your order <strong>${orderNumber}</strong> is now being processed and prepared for shipping.</p>
            <p>We'll notify you once it ships!</p>
            <p style="margin-top: 30px;">Thank you for your patience!</p>
          </div>
        `;
        adminSubject = `⚙️ Order ${orderNumber} Processing`;
        adminHtml = `<h1>Order Processing</h1><p>Order <strong>${orderNumber}</strong> is being processed.</p>`;
        break;

      case "cancelled":
        customerSubject = `❌ Your Order ${orderNumber} Has Been Cancelled`;
        customerHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #dc2626;">Order Cancelled ❌</h1>
            <p>Hi ${customerName},</p>
            <p>Your order <strong>${orderNumber}</strong> has been cancelled.</p>
            <p>If you did not request this cancellation or have any questions, please contact us immediately.</p>
            <p style="margin-top: 30px;">We hope to serve you again soon!</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">Contact us at mnassolutions007@gmail.com or WhatsApp: +234 706 903 6157</p>
          </div>
        `;
        adminSubject = `❌ Order ${orderNumber} Cancelled`;
        adminHtml = `<h1>Order Cancelled</h1><p>Order <strong>${orderNumber}</strong> has been cancelled.</p>`;
        break;

      default:
        console.log(`Status ${newStatus} does not require notification`);
        return new Response(
          JSON.stringify({ success: true, message: "No notification needed for this status" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
    }

    // Send email to customer
    if (customerSubject && customerHtml) {
      try {
        await resend.emails.send({
          from: "MNAS Online Mart <onboarding@resend.dev>",
          to: [customerEmail],
          subject: customerSubject,
          html: customerHtml,
        });
        console.log(`Customer notification email sent for order ${orderNumber}`);
      } catch (emailError) {
        console.error("Error sending customer email:", emailError);
      }
    }

    // Send email to admins
    for (const email of adminEmails) {
      try {
        await resend.emails.send({
          from: "MNAS Online Mart <onboarding@resend.dev>",
          to: [email],
          subject: adminSubject,
          html: adminHtml,
        });
      } catch (emailError) {
        console.error(`Error sending admin email to ${email}:`, emailError);
      }
    }

    // Generate WhatsApp message link (for reference - actual sending needs WhatsApp Business API)
    const whatsappMessage = `Order ${orderNumber} status updated to: ${newStatus.toUpperCase()}\nCustomer: ${customerName}\nPhone: ${customerPhone}`;
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    console.log(`WhatsApp notification link: ${whatsappLink}`);
    console.log(`Status notification sent successfully for order ${orderNumber}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notifications sent for status: ${newStatus}`,
        whatsappLink 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending status notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
