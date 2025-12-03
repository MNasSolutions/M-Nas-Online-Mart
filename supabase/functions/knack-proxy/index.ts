import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting: simple in-memory store (resets on function restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in ms

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(clientId);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get secrets
    const KNACK_APP_ID = Deno.env.get('KNACK_APP_ID');
    const KNACK_API_KEY = Deno.env.get('KNACK_API_KEY');

    if (!KNACK_APP_ID || !KNACK_API_KEY) {
      console.error('Missing Knack credentials in secrets');
      return new Response(
        JSON.stringify({ error: 'Knack integration not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client identifier for rate limiting
    const clientId = req.headers.get('x-forwarded-for') || 
                     req.headers.get('cf-connecting-ip') || 
                     'anonymous';

    // Check rate limit
    if (!checkRateLimit(clientId)) {
      console.warn(`Rate limit exceeded for client: ${clientId}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { objectKey } = await req.json();

    // Validate objectKey
    if (!objectKey || typeof objectKey !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid objectKey parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize objectKey - only allow alphanumeric and underscores
    const sanitizedObjectKey = objectKey.replace(/[^a-zA-Z0-9_]/g, '');
    if (sanitizedObjectKey !== objectKey || sanitizedObjectKey.length > 50) {
      return new Response(
        JSON.stringify({ error: 'Invalid objectKey format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching Knack data for object: ${sanitizedObjectKey}`);

    // Make request to Knack API
    const knackResponse = await fetch(
      `https://api.knack.com/v1/objects/${sanitizedObjectKey}/records`,
      {
        method: 'GET',
        headers: {
          'X-Knack-Application-Id': KNACK_APP_ID,
          'X-Knack-REST-API-Key': KNACK_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!knackResponse.ok) {
      console.error(`Knack API error: ${knackResponse.status}`);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch data from Knack' }),
        { status: knackResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await knackResponse.json();
    console.log(`Successfully fetched ${data.records?.length || 0} records`);

    return new Response(
      JSON.stringify({ records: data.records || [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in knack-proxy function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
