-- Fix function search path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Fix function search path for set_order_number
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix function search path for update_seller_follower_count
CREATE OR REPLACE FUNCTION public.update_seller_follower_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE seller_profiles SET follower_count = follower_count + 1 WHERE id = NEW.seller_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE seller_profiles SET follower_count = GREATEST(follower_count - 1, 0) WHERE id = OLD.seller_id;
  END IF;
  RETURN NULL;
END;
$function$;