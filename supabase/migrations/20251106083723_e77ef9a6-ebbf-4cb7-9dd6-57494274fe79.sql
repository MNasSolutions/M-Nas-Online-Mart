-- Create payment method enum (if not exists)
DO $$ BEGIN
  CREATE TYPE payment_method_type AS ENUM ('paystack', 'opay', 'moniepoint', 'bank_transfer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create payment status enum (if not exists)
DO $$ BEGIN
  CREATE TYPE payment_status_type AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create order status enum (if not exists)
DO $$ BEGIN
  CREATE TYPE order_status_type AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create shipping_addresses table
CREATE TABLE IF NOT EXISTS public.shipping_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Nigeria',
  postal_code TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  payment_method payment_method_type NOT NULL,
  payment_status payment_status_type NOT NULL DEFAULT 'pending',
  transaction_reference TEXT UNIQUE,
  amount NUMERIC NOT NULL,
  payment_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add new columns to orders table
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS shipping_address_id UUID,
  ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_amount NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_code TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS order_status order_status_type DEFAULT 'pending';

-- Update existing payment_method and payment_status columns only if they're text type
DO $$ BEGIN
  IF (SELECT data_type FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'payment_method') = 'text' THEN
    ALTER TABLE public.orders ALTER COLUMN payment_method DROP DEFAULT;
    ALTER TABLE public.orders 
      ALTER COLUMN payment_method TYPE payment_method_type USING payment_method::payment_method_type;
  END IF;
END $$;

DO $$ BEGIN
  IF (SELECT data_type FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'payment_status') = 'text' THEN
    ALTER TABLE public.orders ALTER COLUMN payment_status DROP DEFAULT;
    ALTER TABLE public.orders 
      ALTER COLUMN payment_status TYPE payment_status_type USING payment_status::payment_status_type;
    ALTER TABLE public.orders ALTER COLUMN payment_status SET DEFAULT 'pending'::payment_status_type;
  END IF;
END $$;

-- Enable RLS on shipping_addresses
ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;

-- RLS policies for shipping_addresses (drop if exists first)
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.shipping_addresses;
CREATE POLICY "Users can view their own addresses"
  ON public.shipping_addresses FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own addresses" ON public.shipping_addresses;
CREATE POLICY "Users can create their own addresses"
  ON public.shipping_addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own addresses" ON public.shipping_addresses;
CREATE POLICY "Users can update their own addresses"
  ON public.shipping_addresses FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.shipping_addresses;
CREATE POLICY "Users can delete their own addresses"
  ON public.shipping_addresses FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for transactions
DROP POLICY IF EXISTS "Users can view their order transactions" ON public.transactions;
CREATE POLICY "Users can view their order transactions"
  ON public.transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = transactions.order_id
      AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR SELECT
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "System can create transactions" ON public.transactions;
CREATE POLICY "System can create transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update transactions" ON public.transactions;
CREATE POLICY "Admins can update transactions"
  ON public.transactions FOR UPDATE
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- Trigger function to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS trigger_set_order_number ON public.orders;

-- Trigger to set order_number on insert
CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_shipping_addresses_updated_at ON public.shipping_addresses;
CREATE TRIGGER update_shipping_addresses_updated_at
  BEFORE UPDATE ON public.shipping_addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();