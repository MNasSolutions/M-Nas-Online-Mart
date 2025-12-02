-- Fix search_path for update_product_stock function
DROP FUNCTION IF EXISTS update_product_stock(UUID, INTEGER);

CREATE OR REPLACE FUNCTION update_product_stock(product_id UUID, quantity_change INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE products
  SET 
    stock_quantity = GREATEST(0, stock_quantity + quantity_change),
    updated_at = NOW()
  WHERE id = product_id;
END;
$$;