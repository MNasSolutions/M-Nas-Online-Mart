-- Fix 1: Add INSERT policy for order_items table to allow order creation
CREATE POLICY "Users can create order items for their orders"
ON order_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Fix 2: Add SELECT policy for newsletter_subscriptions (only admins can view)
CREATE POLICY "Only admins can view newsletter subscriptions"
ON newsletter_subscriptions FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Fix 3: Add tracking_token column to orders table for secure order tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_token uuid DEFAULT gen_random_uuid() UNIQUE;

-- Update existing orders to have tracking tokens
UPDATE orders SET tracking_token = gen_random_uuid() WHERE tracking_token IS NULL;