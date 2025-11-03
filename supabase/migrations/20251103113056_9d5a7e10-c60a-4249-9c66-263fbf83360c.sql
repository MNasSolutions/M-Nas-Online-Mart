-- Create storage bucket for seller documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'seller-documents',
  'seller-documents',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
);

-- Storage policies for seller documents
CREATE POLICY "Sellers can upload their documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'seller-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Sellers can view their own documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'seller-documents' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Admins can view all seller documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'seller-documents' AND
  has_role(auth.uid(), 'admin'::app_role)
);