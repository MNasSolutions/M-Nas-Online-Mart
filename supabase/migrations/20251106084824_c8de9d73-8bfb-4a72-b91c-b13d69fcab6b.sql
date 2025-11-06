-- Add seller subscriptions table
CREATE TABLE IF NOT EXISTS public.seller_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
  subscription_amount NUMERIC NOT NULL DEFAULT 3000,
  currency TEXT NOT NULL DEFAULT 'NGN',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add seller followers table
CREATE TABLE IF NOT EXISTS public.seller_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(seller_id, user_id)
);

-- Add platform wallet table
CREATE TABLE IF NOT EXISTS public.platform_wallet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  balance NUMERIC NOT NULL DEFAULT 0,
  total_commission NUMERIC NOT NULL DEFAULT 0,
  total_subscriptions NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial wallet record
INSERT INTO public.platform_wallet (balance, total_commission, total_subscriptions)
VALUES (0, 0, 0)
ON CONFLICT DO NOTHING;

-- Add wallet transactions table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('commission', 'subscription', 'withdrawal')),
  amount NUMERIC NOT NULL,
  description TEXT,
  reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add site visitors table
CREATE TABLE IF NOT EXISTS public.site_visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  page_url TEXT,
  referrer TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.seller_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visitors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for seller_subscriptions
CREATE POLICY "Sellers can view their own subscriptions"
  ON public.seller_subscriptions FOR SELECT
  USING (seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all subscriptions"
  ON public.seller_subscriptions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for seller_followers
CREATE POLICY "Users can manage their own follows"
  ON public.seller_followers FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view follower counts"
  ON public.seller_followers FOR SELECT
  USING (true);

-- RLS Policies for platform_wallet
CREATE POLICY "Only admins can view wallet"
  ON public.platform_wallet FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Only admins can update wallet"
  ON public.platform_wallet FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for wallet_transactions
CREATE POLICY "Only admins can view wallet transactions"
  ON public.wallet_transactions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "System can create wallet transactions"
  ON public.wallet_transactions FOR INSERT
  WITH CHECK (true);

-- RLS Policies for site_visitors
CREATE POLICY "Anyone can insert visitor records"
  ON public.site_visitors FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can view visitors"
  ON public.site_visitors FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_seller_subscriptions_updated_at
  BEFORE UPDATE ON public.seller_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add follower count to seller_profiles
ALTER TABLE public.seller_profiles ADD COLUMN IF NOT EXISTS follower_count INTEGER DEFAULT 0;

-- Function to update follower count
CREATE OR REPLACE FUNCTION update_seller_follower_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE seller_profiles SET follower_count = follower_count + 1 WHERE id = NEW.seller_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE seller_profiles SET follower_count = GREATEST(follower_count - 1, 0) WHERE id = OLD.seller_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_follower_count_trigger
  AFTER INSERT OR DELETE ON public.seller_followers
  FOR EACH ROW EXECUTE FUNCTION update_seller_follower_count();