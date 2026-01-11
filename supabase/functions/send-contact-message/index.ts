import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactMessageRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactMessageRequest = await req.json();

    // Validate inputs
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize inputs (limit length)
    const sanitizedName = name.slice(0, 100);
    const sanitizedEmail = email.slice(0, 255);
    const sanitizedMessage = message.slice(0, 2000);

    console.log(`New contact message from ${sanitizedName} (${sanitizedEmail})`);

    const adminEmails = [
      "mnassolutions007@gmail.com",
      "mnassolutions@gmail.com", 
      "send2muhammadsaadahmad@gmail.com",
    ];

    const whatsappNumber = "2347069036157";

    // Send email notification to admins
    for (const adminEmail of adminEmails) {
      try {
        await resend.emails.send({
          from: "MNAS Online Mart <onboarding@resend.dev>",
          to: [adminEmail],
          subject: `📩 New Contact Message from ${sanitizedName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #0ea5e9;">New Contact Form Message</h1>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>From:</strong> ${sanitizedName}</p>
                <p><strong>Email:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></p>
                <p><strong>Message:</strong></p>
                <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
                  ${sanitizedMessage.replace(/\n/g, '<br>')}
                </div>
              </div>
              <p style="color: #6b7280; font-size: 12px;">
                Reply directly to ${sanitizedEmail} to respond to this customer.
              </p>
            </div>
          `,
        });
        console.log(`Email sent to ${adminEmail}`);
      } catch (emailError) {
        console.error(`Failed to send email to ${adminEmail}:`, emailError);
      }
    }

    // Send confirmation email to customer
    try {
      await resend.emails.send({
        from: "MNAS Online Mart <onboarding@resend.dev>",
        to: [sanitizedEmail],
        subject: "We received your message - M Nas Online Mart",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0ea5e9;">Thank you for contacting us!</h1>
            <p>Hi ${sanitizedName},</p>
            <p>We've received your message and will get back to you as soon as possible.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your message:</strong></p>
              <p style="color: #4b5563;">${sanitizedMessage.replace(/\n/g, '<br>')}</p>
            </div>
            <p>Best regards,<br>The M Nas Online Mart Team</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">
              Contact us: mnassolutions007@gmail.com | WhatsApp: +234 706 903 6157
            </p>
          </div>
        `,
      });
      console.log(`Confirmation email sent to ${sanitizedEmail}`);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    // Generate WhatsApp message link
    const whatsappMessage = `📩 NEW CONTACT MESSAGE\n\n👤 Name: ${sanitizedName}\n📧 Email: ${sanitizedEmail}\n\n💬 Message:\n${sanitizedMessage}`;
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    console.log(`WhatsApp link generated: ${whatsappLink}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Contact message sent successfully",
        whatsappLink 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error processing contact message:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
