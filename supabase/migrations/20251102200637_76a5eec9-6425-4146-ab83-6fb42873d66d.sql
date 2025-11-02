-- Drop and recreate policies for seller_applications
DROP POLICY IF EXISTS "Users can create their own seller application" ON seller_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON seller_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON seller_applications;

CREATE POLICY "Users can create their own seller application"
  ON seller_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications"
  ON seller_applications FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can update applications"
  ON seller_applications FOR UPDATE
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- Drop and recreate policies for seller_profiles
DROP POLICY IF EXISTS "Sellers can view their own profile" ON seller_profiles;
DROP POLICY IF EXISTS "Admins can manage seller profiles" ON seller_profiles;

CREATE POLICY "Sellers can view their own profile"
  ON seller_profiles FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can manage seller profiles"
  ON seller_profiles FOR ALL
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- Drop and recreate policies for commission_transactions
DROP POLICY IF EXISTS "Sellers can view their commissions" ON commission_transactions;
DROP POLICY IF EXISTS "System can create commission transactions" ON commission_transactions;

CREATE POLICY "Sellers can view their commissions"
  ON commission_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM seller_profiles 
      WHERE seller_profiles.id = commission_transactions.seller_id 
      AND seller_profiles.user_id = auth.uid()
    ) OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin')
  );

CREATE POLICY "System can create commission transactions"
  ON commission_transactions FOR INSERT
  WITH CHECK (true);

-- Drop and recreate policies for product_reviews
DROP POLICY IF EXISTS "Anyone can view reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can create reviews for their orders" ON product_reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON product_reviews;

CREATE POLICY "Anyone can view reviews"
  ON product_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews for their orders"
  ON product_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON product_reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Drop and recreate policies for flash_sales
DROP POLICY IF EXISTS "Anyone can view active flash sales" ON flash_sales;
DROP POLICY IF EXISTS "Admins can manage flash sales" ON flash_sales;

CREATE POLICY "Anyone can view active flash sales"
  ON flash_sales FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage flash sales"
  ON flash_sales FOR ALL
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- Drop and recreate policies for discount_codes
DROP POLICY IF EXISTS "Anyone can view active discount codes" ON discount_codes;
DROP POLICY IF EXISTS "Admins can manage discount codes" ON discount_codes;

CREATE POLICY "Anyone can view active discount codes"
  ON discount_codes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage discount codes"
  ON discount_codes FOR ALL
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- Drop and recreate policies for shipping_rates
DROP POLICY IF EXISTS "Anyone can view shipping rates" ON shipping_rates;
DROP POLICY IF EXISTS "Admins can manage shipping rates" ON shipping_rates;

CREATE POLICY "Anyone can view shipping rates"
  ON shipping_rates FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage shipping rates"
  ON shipping_rates FOR ALL
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- Drop and recreate policies for notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Drop and recreate policies for chat_messages
DROP POLICY IF EXISTS "Users can view their chats" ON chat_messages;
DROP POLICY IF EXISTS "Users can send messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can update their received messages" ON chat_messages;

CREATE POLICY "Users can view their chats"
  ON chat_messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages"
  ON chat_messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- Drop and recreate policies for wishlists
DROP POLICY IF EXISTS "Users can manage their wishlist" ON wishlists;

CREATE POLICY "Users can manage their wishlist"
  ON wishlists FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);