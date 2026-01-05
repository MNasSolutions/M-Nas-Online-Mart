import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // Verify Paystack signature
    if (signature) {
      const hash = createHmac('sha512', paystackSecretKey)
        .update(body)
        .digest('hex');

      if (hash !== signature) {
        console.error('Invalid Paystack signature');
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const event = JSON.parse(body);
    console.log('Paystack webhook event:', event.event);

    // Handle different event types
    switch (event.event) {
      case 'charge.success': {
        const data = event.data;
        const reference = data.reference;
        const amount = data.amount / 100; // Convert from kobo to Naira
        const email = data.customer?.email;
        const metadata = data.metadata || {};

        console.log('Payment successful:', { reference, amount, email, metadata });

        // Find the order with this payment reference
        const { data: orders, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('transaction_id', reference)
          .limit(1);

        if (orderError) {
          console.error('Error finding order:', orderError);
        }

        if (orders && orders.length > 0) {
          const order = orders[0];

          // Update order status
          const { error: updateError } = await supabase
            .from('orders')
            .update({
              payment_status: 'completed',
              order_status: 'confirmed',
              status: 'confirmed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', order.id);

          if (updateError) {
            console.error('Error updating order:', updateError);
          } else {
            console.log('Order updated successfully:', order.id);
          }

          // Update or create transaction record
          const { error: transactionError } = await supabase
            .from('transactions')
            .upsert({
              order_id: order.id,
              amount: amount,
              payment_method: 'paystack',
              payment_status: 'completed',
              transaction_reference: reference,
              payment_data: data,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'order_id',
            });

          if (transactionError) {
            console.error('Error updating transaction:', transactionError);
          }

          // Create notification for user
          await supabase.from('notifications').insert({
            user_id: order.user_id,
            type: 'payment',
            title: 'Payment Successful',
            message: `Your payment of ₦${amount.toLocaleString()} for order #${order.order_number} was successful.`,
            metadata: { order_id: order.id, reference },
          });

          // Add tracking entry
          await supabase.from('order_tracking').insert({
            order_id: order.id,
            status: 'confirmed',
            description: 'Payment confirmed via Paystack',
            location: 'Payment Gateway',
          });
        } else {
          // If no order found by transaction_id, try to find by pending orders with matching email
          console.log('No order found with transaction_id, checking pending orders...');
        }

        break;
      }

      case 'charge.failed': {
        const data = event.data;
        const reference = data.reference;

        console.log('Payment failed:', reference);

        // Find and update the order
        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .eq('transaction_id', reference)
          .limit(1);

        if (orders && orders.length > 0) {
          const order = orders[0];

          await supabase
            .from('orders')
            .update({
              payment_status: 'failed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', order.id);

          // Create notification
          await supabase.from('notifications').insert({
            user_id: order.user_id,
            type: 'payment',
            title: 'Payment Failed',
            message: `Your payment for order #${order.order_number} failed. Please try again.`,
            metadata: { order_id: order.id, reference },
          });
        }

        break;
      }

      case 'transfer.success':
      case 'transfer.failed':
      case 'transfer.reversed': {
        // Handle transfer events (for payouts to sellers)
        console.log('Transfer event:', event.event, event.data);
        break;
      }

      default:
        console.log('Unhandled event type:', event.event);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Webhook processing failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
