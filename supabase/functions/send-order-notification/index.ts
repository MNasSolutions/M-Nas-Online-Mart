import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentMethod: string;
  transactionId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication - JWT is automatically verified by Supabase when verify_jwt = true (default)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Unauthorized request - missing Authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized - Authentication required" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const orderData: OrderNotificationRequest = await req.json();

    const itemsHtml = orderData.items
      .map(
        (item) =>
          `<li>${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`
      )
      .join("");

    // Send email to admin
    const adminEmails = [
      "mnassolutions007@gmail.com",
      "mnassolutions@gmail.com",
      "send2muhammadsaadahmad@gmail.com",
    ];

    for (const email of adminEmails) {
      await resend.emails.send({
        from: "MNAS Online Mart <onboarding@resend.dev>",
        to: [email],
        subject: `New Order ${orderData.orderNumber}`,
        html: `
          <h1>New Order Received</h1>
          <h2>Order #${orderData.orderNumber}</h2>
          <p><strong>Customer:</strong> ${orderData.customerName}</p>
          <p><strong>Email:</strong> ${orderData.customerEmail}</p>
          <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
          <p><strong>Shipping Address:</strong><br>${orderData.shippingAddress}</p>
          <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
          ${orderData.transactionId ? `<p><strong>Transaction ID:</strong> ${orderData.transactionId}</p>` : ""}
          <h3>Items:</h3>
          <ul>${itemsHtml}</ul>
          <p><strong>Total Amount:</strong> $${orderData.totalAmount.toFixed(2)}</p>
        `,
      });
    }

    // Send confirmation email to customer
    await resend.emails.send({
      from: "MNAS Online Mart <onboarding@resend.dev>",
      to: [orderData.customerEmail],
      subject: `Order Confirmation ${orderData.orderNumber}`,
      html: `
        <h1>Thank you for your order!</h1>
        <h2>Order #${orderData.orderNumber}</h2>
        <p>Hi ${orderData.customerName},</p>
        <p>We've received your order and will process it shortly.</p>
        <h3>Your Items:</h3>
        <ul>${itemsHtml}</ul>
        <p><strong>Total:</strong> $${orderData.totalAmount.toFixed(2)}</p>
        <p><strong>Shipping Address:</strong><br>${orderData.shippingAddress}</p>
        <p>You will receive tracking information once your order ships.</p>
      `,
    });

    console.log("Order notifications sent successfully:", orderData.orderNumber);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending order notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
