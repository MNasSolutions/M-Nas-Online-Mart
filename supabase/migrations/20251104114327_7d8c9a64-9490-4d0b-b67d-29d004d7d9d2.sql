-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  category text NOT NULL,
  brand_name text,
  stock_quantity integer DEFAULT 0,
  image_url text,
  additional_images text[],
  weight numeric,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  discount_percentage numeric DEFAULT 0,
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  seller_id uuid REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
  created_by_admin boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can view active products
CREATE POLICY "Anyone can view active products"
  ON public.products
  FOR SELECT
  USING (is_active = true);

-- Sellers can view their own products
CREATE POLICY "Sellers can view their own products"
  ON public.products
  FOR SELECT
  USING (
    seller_id IN (
      SELECT id FROM public.seller_profiles WHERE user_id = auth.uid()
    )
  );

-- Sellers can create products
CREATE POLICY "Sellers can create products"
  ON public.products
  FOR INSERT
  WITH CHECK (
    seller_id IN (
      SELECT id FROM public.seller_profiles WHERE user_id = auth.uid()
    )
  );

-- Sellers can update their own products
CREATE POLICY "Sellers can update their products"
  ON public.products
  FOR UPDATE
  USING (
    seller_id IN (
      SELECT id FROM public.seller_profiles WHERE user_id = auth.uid()
    )
  );

-- Sellers can delete their own products
CREATE POLICY "Sellers can delete their products"
  ON public.products
  FOR DELETE
  USING (
    seller_id IN (
      SELECT id FROM public.seller_profiles WHERE user_id = auth.uid()
    )
  );

-- Admins can do everything
CREATE POLICY "Admins can manage all products"
  ON public.products
  FOR ALL
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'super_admin'::app_role)
  );

-- Create updated_at trigger
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create product-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Storage policies for product images
CREATE POLICY "Anyone can view product images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Sellers can upload product images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    (
      EXISTS (
        SELECT 1 FROM public.seller_profiles 
        WHERE user_id = auth.uid()
      ) OR
      has_role(auth.uid(), 'admin'::app_role) OR
      has_role(auth.uid(), 'super_admin'::app_role)
    )
  );

CREATE POLICY "Sellers can update their product images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'product-images' AND
    (
      EXISTS (
        SELECT 1 FROM public.seller_profiles 
        WHERE user_id = auth.uid()
      ) OR
      has_role(auth.uid(), 'admin'::app_role) OR
      has_role(auth.uid(), 'super_admin'::app_role)
    )
  );

CREATE POLICY "Sellers can delete their product images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'product-images' AND
    (
      EXISTS (
        SELECT 1 FROM public.seller_profiles 
        WHERE user_id = auth.uid()
      ) OR
      has_role(auth.uid(), 'admin'::app_role) OR
      has_role(auth.uid(), 'super_admin'::app_role)
    )
  );