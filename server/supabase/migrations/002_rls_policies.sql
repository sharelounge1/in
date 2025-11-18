-- =============================================
-- Row Level Security (RLS) Policies
-- Migration: 002_rls_policies.sql
-- Description: Comprehensive RLS policies for all tables
-- =============================================

-- =============================================
-- Helper Functions (MUST BE CREATED FIRST)
-- =============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (SELECT role = 'admin' FROM profiles WHERE id = auth.uid()),
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to check if user is influencer
CREATE OR REPLACE FUNCTION is_influencer()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (SELECT role IN ('influencer', 'admin') FROM profiles WHERE id = auth.uid()),
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    (SELECT role FROM profiles WHERE id = auth.uid()),
    'anonymous'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =============================================
-- Enable RLS on all tables
-- =============================================
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS influencer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS course_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS party_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS inquiries ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES TABLE POLICIES
-- =============================================

-- Users can read their own profile
CREATE POLICY "profiles_select_own"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "profiles_select_admin"
ON profiles FOR SELECT
USING (is_admin());

-- Users can insert their own profile (for registration)
CREATE POLICY "profiles_insert_own"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- =============================================
-- INFLUENCER_PROFILES TABLE POLICIES
-- =============================================

-- Public can read verified influencers
CREATE POLICY "influencer_profiles_select_verified"
ON influencer_profiles FOR SELECT
USING (
  verification_status = 'verified'
  OR user_id = auth.uid()
  OR is_admin()
);

-- Influencer can update their own profile
CREATE POLICY "influencer_profiles_update_own"
ON influencer_profiles FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Influencer can insert their own profile
CREATE POLICY "influencer_profiles_insert_own"
ON influencer_profiles FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Admins can read all influencer profiles
CREATE POLICY "influencer_profiles_select_admin"
ON influencer_profiles FOR SELECT
USING (is_admin());

-- Admins can update all influencer profiles
CREATE POLICY "influencer_profiles_update_admin"
ON influencer_profiles FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- =============================================
-- COURSES TABLE POLICIES
-- =============================================

-- Public can read published courses
CREATE POLICY "courses_select_public"
ON courses FOR SELECT
USING (
  status = 'published'
  OR influencer_id = auth.uid()
  OR is_admin()
);

-- Influencer can create their own courses
CREATE POLICY "courses_insert_own"
ON courses FOR INSERT
WITH CHECK (
  influencer_id = auth.uid()
  AND is_influencer()
);

-- Influencer can update their own courses
CREATE POLICY "courses_update_own"
ON courses FOR UPDATE
USING (influencer_id = auth.uid())
WITH CHECK (influencer_id = auth.uid());

-- Influencer can delete their own courses
CREATE POLICY "courses_delete_own"
ON courses FOR DELETE
USING (influencer_id = auth.uid());

-- Admins can read all courses
CREATE POLICY "courses_select_admin"
ON courses FOR SELECT
USING (is_admin());

-- Admins can update all courses
CREATE POLICY "courses_update_admin"
ON courses FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- =============================================
-- COURSE_APPLICATIONS TABLE POLICIES
-- =============================================

-- Users can read their own applications
CREATE POLICY "course_applications_select_own"
ON course_applications FOR SELECT
USING (user_id = auth.uid());

-- Users can create their own applications
CREATE POLICY "course_applications_insert_own"
ON course_applications FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own applications (e.g., cancel)
CREATE POLICY "course_applications_update_own"
ON course_applications FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Influencers can read applications for their courses
CREATE POLICY "course_applications_select_influencer"
ON course_applications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = course_applications.course_id
    AND courses.influencer_id = auth.uid()
  )
);

-- Influencers can update applications for their courses (e.g., approve/reject)
CREATE POLICY "course_applications_update_influencer"
ON course_applications FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = course_applications.course_id
    AND courses.influencer_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = course_applications.course_id
    AND courses.influencer_id = auth.uid()
  )
);

-- Admins can read all applications
CREATE POLICY "course_applications_select_admin"
ON course_applications FOR SELECT
USING (is_admin());

-- =============================================
-- PARTIES TABLE POLICIES
-- =============================================

-- Public can read published parties
CREATE POLICY "parties_select_public"
ON parties FOR SELECT
USING (
  status = 'published'
  OR influencer_id = auth.uid()
  OR is_admin()
);

-- Influencer can create their own parties
CREATE POLICY "parties_insert_own"
ON parties FOR INSERT
WITH CHECK (
  influencer_id = auth.uid()
  AND is_influencer()
);

-- Influencer can update their own parties
CREATE POLICY "parties_update_own"
ON parties FOR UPDATE
USING (influencer_id = auth.uid())
WITH CHECK (influencer_id = auth.uid());

-- Influencer can delete their own parties
CREATE POLICY "parties_delete_own"
ON parties FOR DELETE
USING (influencer_id = auth.uid());

-- Admins can read all parties
CREATE POLICY "parties_select_admin"
ON parties FOR SELECT
USING (is_admin());

-- Admins can update all parties
CREATE POLICY "parties_update_admin"
ON parties FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- =============================================
-- PARTY_APPLICATIONS TABLE POLICIES
-- =============================================

-- Users can read their own applications
CREATE POLICY "party_applications_select_own"
ON party_applications FOR SELECT
USING (user_id = auth.uid());

-- Users can create their own applications
CREATE POLICY "party_applications_insert_own"
ON party_applications FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own applications (e.g., cancel)
CREATE POLICY "party_applications_update_own"
ON party_applications FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Influencers can read applications for their parties
CREATE POLICY "party_applications_select_influencer"
ON party_applications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM parties
    WHERE parties.id = party_applications.party_id
    AND parties.influencer_id = auth.uid()
  )
);

-- Influencers can update applications for their parties
CREATE POLICY "party_applications_update_influencer"
ON party_applications FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM parties
    WHERE parties.id = party_applications.party_id
    AND parties.influencer_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM parties
    WHERE parties.id = party_applications.party_id
    AND parties.influencer_id = auth.uid()
  )
);

-- Admins can read all party applications
CREATE POLICY "party_applications_select_admin"
ON party_applications FOR SELECT
USING (is_admin());

-- =============================================
-- PAYMENTS TABLE POLICIES
-- =============================================

-- Users can read their own payments
CREATE POLICY "payments_select_own"
ON payments FOR SELECT
USING (user_id = auth.uid());

-- Influencers can read payments for their courses/parties
CREATE POLICY "payments_select_influencer"
ON payments FOR SELECT
USING (
  (
    payments.reference_type = 'course'
    AND EXISTS (
      SELECT 1 FROM courses c
      JOIN influencer_profiles ip ON c.influencer_id = ip.id
      WHERE c.id = payments.reference_id
      AND ip.user_id = auth.uid()
    )
  )
  OR (
    payments.reference_type = 'party'
    AND EXISTS (
      SELECT 1 FROM parties p
      JOIN influencer_profiles ip ON p.influencer_id = ip.id
      WHERE p.id = payments.reference_id
      AND ip.user_id = auth.uid()
    )
  )
);

-- Admins can read all payments
CREATE POLICY "payments_select_admin"
ON payments FOR SELECT
USING (is_admin());

-- System can insert payments (via service role)
-- Note: Payments should be created by backend service

-- =============================================
-- SETTLEMENTS TABLE POLICIES
-- =============================================

-- Influencers can read their own settlements
CREATE POLICY "settlements_select_own"
ON settlements FOR SELECT
USING (influencer_id = auth.uid());

-- Admins can read all settlements
CREATE POLICY "settlements_select_admin"
ON settlements FOR SELECT
USING (is_admin());

-- Admins can update settlements
CREATE POLICY "settlements_update_admin"
ON settlements FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- Admins can insert settlements
CREATE POLICY "settlements_insert_admin"
ON settlements FOR INSERT
WITH CHECK (is_admin());

-- =============================================
-- NOTIFICATIONS TABLE POLICIES
-- =============================================

-- Users can read their own notifications
CREATE POLICY "notifications_select_own"
ON notifications FOR SELECT
USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "notifications_update_own"
ON notifications FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "notifications_delete_own"
ON notifications FOR DELETE
USING (user_id = auth.uid());

-- System can insert notifications (via service role)
-- Note: Notifications should be created by backend service

-- =============================================
-- DIRECT_MESSAGES TABLE POLICIES
-- =============================================

-- Users can read messages where they are sender or receiver
CREATE POLICY "direct_messages_select_own"
ON direct_messages FOR SELECT
USING (
  sender_id = auth.uid()
  OR receiver_id = auth.uid()
);

-- Users can create messages
CREATE POLICY "direct_messages_insert_own"
ON direct_messages FOR INSERT
WITH CHECK (sender_id = auth.uid());

-- Users can update their own sent messages (e.g., mark as read by sender)
CREATE POLICY "direct_messages_update_own"
ON direct_messages FOR UPDATE
USING (
  sender_id = auth.uid()
  OR receiver_id = auth.uid()
)
WITH CHECK (
  sender_id = auth.uid()
  OR receiver_id = auth.uid()
);

-- Admins can read all messages
CREATE POLICY "direct_messages_select_admin"
ON direct_messages FOR SELECT
USING (is_admin());

-- =============================================
-- REVIEWS TABLE POLICIES
-- =============================================

-- Public can read active reviews
CREATE POLICY "reviews_select_public"
ON reviews FOR SELECT
USING (
  is_active = true
  OR user_id = auth.uid()
  OR is_admin()
);

-- Users can create their own reviews
CREATE POLICY "reviews_insert_own"
ON reviews FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own reviews
CREATE POLICY "reviews_update_own"
ON reviews FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete their own reviews
CREATE POLICY "reviews_delete_own"
ON reviews FOR DELETE
USING (user_id = auth.uid());

-- Admins can read all reviews
CREATE POLICY "reviews_select_admin"
ON reviews FOR SELECT
USING (is_admin());

-- Admins can update all reviews (moderation)
CREATE POLICY "reviews_update_admin"
ON reviews FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- =============================================
-- INQUIRIES TABLE POLICIES
-- =============================================

-- Users can read their own inquiries
CREATE POLICY "inquiries_select_own"
ON inquiries FOR SELECT
USING (user_id = auth.uid());

-- Users can create their own inquiries
CREATE POLICY "inquiries_insert_own"
ON inquiries FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own inquiries
CREATE POLICY "inquiries_update_own"
ON inquiries FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Target influencer can read inquiries directed to them
CREATE POLICY "inquiries_select_influencer"
ON inquiries FOR SELECT
USING (target_influencer_id = auth.uid());

-- Target influencer can update inquiries (respond)
CREATE POLICY "inquiries_update_influencer"
ON inquiries FOR UPDATE
USING (target_influencer_id = auth.uid())
WITH CHECK (target_influencer_id = auth.uid());

-- Admins can read all inquiries
CREATE POLICY "inquiries_select_admin"
ON inquiries FOR SELECT
USING (is_admin());

-- Admins can update all inquiries
CREATE POLICY "inquiries_update_admin"
ON inquiries FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- =============================================
-- Additional Security Policies
-- =============================================

-- Prevent users from changing their own role
CREATE POLICY "profiles_prevent_role_change"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  -- Allow update only if role is not being changed
  -- or if the user is an admin
  (
    (SELECT role FROM profiles WHERE id = auth.uid()) = role
  )
  OR is_admin()
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant anon user limited access
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON courses TO anon;
GRANT SELECT ON parties TO anon;
GRANT SELECT ON influencer_profiles TO anon;
GRANT SELECT ON reviews TO anon;
