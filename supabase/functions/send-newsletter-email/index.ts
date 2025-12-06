import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Rate limiting constants
const MAX_REQUESTS_PER_MINUTE = 5;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  
  const record = rateLimitMap.get(clientId);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  
  record.count++;
  return true;
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60 * 1000);

interface NewsletterRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a moment before trying again." }), 
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email }: NewsletterRequest = await req.json();
    
    // Basic email validation
    if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 255) {
      console.error("Invalid email format");
      return new Response(
        JSON.stringify({ error: "Invalid email address format" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address format" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Prevent obviously fake/disposable emails (basic check)
    const disposableDomains = ['tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'fakeinbox.com'];
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(emailDomain)) {
      console.warn("Disposable email blocked");
      return new Response(
        JSON.stringify({ error: "Disposable email addresses are not allowed" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Newsletter subscription request received");

    const emailResponse = await resend.emails.send({
      from: "M Nas Online Mart <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to M Nas Online Mart Newsletter!",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #FF6B35; margin-bottom: 10px;">Welcome to M Nas Online Mart!</h1>
            <p style="color: #666; font-size: 16px;">Thank you for subscribing to our newsletter</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 15px;">What to expect:</h2>
            <ul style="color: #666; line-height: 1.6;">
              <li>🛍️ Exclusive deals and offers</li>
              <li>🆕 New product announcements</li>
              <li>💰 Special discounts for subscribers</li>
              <li>📱 Latest trends and recommendations</li>
            </ul>
          </div>

          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 10px;">Payment Information</h3>
            <p style="color: #666; margin-bottom: 10px;"><strong>Moniepoint:</strong> Muhammad Ahmad Saad - 7069036157</p>
            <p style="color: #666; margin-bottom: 0;"><strong>Opay:</strong> Abubakar Ahmad Saad - 7069036157</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Start shopping now and enjoy great deals!</p>
            <a href="https://lovable.dev" 
               style="display: inline-block; background: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
              Shop Now
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px;">
              M Nas Online Mart<br>
              Your trusted online shopping destination
            </p>
          </div>
        </div>
      `,
    });

    console.log("Newsletter email sent successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Newsletter subscription successful! Check your email for confirmation.",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in newsletter subscription:", error.message || "Unknown error");
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to send newsletter email. Please try again."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
