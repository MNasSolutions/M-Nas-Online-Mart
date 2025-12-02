import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface OrderRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_address_id?: string;
  payment_method: string;
  payment_reference?: string;
  items: OrderItem[];
  shipping_fee: number;
  tax_amount: number;
  discount_amount: number;
  discount_code?: string;
  total_amount: number;
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

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const orderData: OrderRequest = await req.json();

    // Validate payment reference for Paystack
    if (orderData.payment_method === 'paystack' && orderData.payment_reference) {
      console.log('Verifying Paystack payment:', orderData.payment_reference);
      
      const verifyResponse = await fetch(
        `https://api.paystack.co/transaction/verify/${orderData.payment_reference}`,
        {
          headers: {
            'Authorization': `Bearer ${paystackSecretKey}`,
          },
        }
      );

      const verifyData = await verifyResponse.json();
      console.log('Paystack verification response:', verifyData);

      if (!verifyData.status || verifyData.data.status !== 'success') {
        return new Response(
          JSON.stringify({ error: 'Payment verification failed' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify amount matches
      const paidAmount = verifyData.data.amount / 100; // Paystack returns amount in kobo
      if (Math.abs(paidAmount - orderData.total_amount) > 0.01) {
        return new Response(
          JSON.stringify({ error: 'Payment amount mismatch' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate order items and calculate totals
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of orderData.items) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, price, stock_quantity, seller_id')
        .eq('id', item.product_id)
        .single();

      if (productError || !product) {
        console.error('Product not found:', item.product_id);
        return new Response(
          JSON.stringify({ error: `Product ${item.product_name} not found` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify price hasn't changed
      if (Math.abs(product.price - item.price) > 0.01) {
        return new Response(
          JSON.stringify({ error: `Price mismatch for ${item.product_name}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check stock
      if (product.stock_quantity < item.quantity) {
        return new Response(
          JSON.stringify({ error: `Insufficient stock for ${item.product_name}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      calculatedSubtotal += item.price * item.quantity;
      validatedItems.push({ ...item, seller_id: product.seller_id });
    }

    // Verify total
    const expectedTotal = calculatedSubtotal + orderData.shipping_fee + orderData.tax_amount - orderData.discount_amount;
    if (Math.abs(expectedTotal - orderData.total_amount) > 0.01) {
      return new Response(
        JSON.stringify({ error: 'Total amount mismatch' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create order
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const commissionRate = 0.15; // 15% commission
    const commissionAmount = calculatedSubtotal * commissionRate;
    const sellerAmount = calculatedSubtotal - commissionAmount;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        shipping_address: orderData.shipping_address,
        shipping_address_id: orderData.shipping_address_id,
        payment_method: orderData.payment_method,
        payment_status: orderData.payment_method === 'paystack' ? 'completed' : 'pending',
        order_status: 'pending',
        total_amount: orderData.total_amount,
        shipping_fee: orderData.shipping_fee,
        tax_amount: orderData.tax_amount,
        discount_amount: orderData.discount_amount,
        discount_code: orderData.discount_code,
        transaction_id: orderData.payment_reference,
        commission_amount: commissionAmount,
        seller_amount: sellerAmount,
        seller_id: validatedItems[0]?.seller_id,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create order items
    const orderItems = validatedItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items error:', itemsError);
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        order_id: order.id,
        amount: orderData.total_amount,
        payment_method: orderData.payment_method,
        payment_status: orderData.payment_method === 'paystack' ? 'completed' : 'pending',
        transaction_reference: orderData.payment_reference,
      });

    if (transactionError) {
      console.error('Transaction error:', transactionError);
    }

    // Update product stock
    for (const item of validatedItems) {
      await supabase.rpc('update_product_stock', {
        product_id: item.product_id,
        quantity_change: -item.quantity,
      });
    }

    // Create commission transaction if seller exists
    if (validatedItems[0]?.seller_id) {
      await supabase
        .from('commission_transactions')
        .insert({
          order_id: order.id,
          seller_id: validatedItems[0].seller_id,
          total_amount: calculatedSubtotal,
          commission_amount: commissionAmount,
          seller_amount: sellerAmount,
          commission_rate: commissionRate,
          status: 'pending',
        });
    }

    console.log('Order created successfully:', order.order_number);

    return new Response(
      JSON.stringify({ 
        success: true, 
        order_id: order.id,
        order_number: order.order_number,
        tracking_token: order.tracking_token,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing order:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
