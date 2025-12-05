import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Bank codes for Nigerian banks including mobile money
const BANK_CODES = {
  'opay': '999992',
  'moniepoint': '50515',
  'access_bank': '044',
  'gtbank': '058',
  'first_bank': '011',
  'uba': '033',
  'zenith': '057',
  'kuda': '090267',
  'palmpay': '999991',
  'wema': '035',
  'stanbic': '221',
  'sterling': '232',
  'fidelity': '070',
  'fcmb': '214',
  'union_bank': '032',
  'polaris': '076',
  'ecobank': '050',
  'keystone': '082',
  'providus': '101',
};

interface VerifyRequest {
  account_number: string;
  bank_code: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { account_number, bank_code }: VerifyRequest = await req.json();

    // Validate input
    if (!account_number || !bank_code) {
      return new Response(
        JSON.stringify({ error: 'Account number and bank code are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate account number format (Nigerian accounts are 10 digits)
    if (!/^\d{10}$/.test(account_number)) {
      return new Response(
        JSON.stringify({ error: 'Account number must be 10 digits' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Verifying bank account:', { account_number, bank_code });

    // Call Paystack Bank Resolution API
    const response = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      {
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`,
        },
      }
    );

    const data = await response.json();
    console.log('Paystack bank verification response:', data);

    if (!data.status) {
      return new Response(
        JSON.stringify({ 
          error: data.message || 'Could not verify account',
          verified: false,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        verified: true,
        account_name: data.data.account_name,
        account_number: data.data.account_number,
        bank_id: data.data.bank_id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Bank verification error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
