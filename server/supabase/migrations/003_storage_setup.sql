-- =============================================
-- Storage Bucket Setup
-- Migration: 003_storage_setup.sql
-- Description: Storage buckets and policies for file uploads
-- =============================================

-- =============================================
-- CREATE STORAGE BUCKETS
-- =============================================

-- Avatars bucket (public) - User profile images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Courses bucket (public) - Course images and media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'courses',
  'courses',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Parties bucket (public) - Party images and media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'parties',
  'parties',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Records bucket (public) - Travel/party records and memories
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'records',
  'records',
  true,
  20971520, -- 20MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Attachments bucket (private) - Private documents and files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'attachments',
  'attachments',
  false,
  10485760, -- 10MB limit
  ARRAY[
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =============================================
-- STORAGE POLICIES - AVATARS BUCKET
-- =============================================

-- Public can view avatars
CREATE POLICY "avatars_select_public"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Users can upload their own avatar
CREATE POLICY "avatars_insert_own"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own avatar
CREATE POLICY "avatars_update_own"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own avatar
CREATE POLICY "avatars_delete_own"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- STORAGE POLICIES - COURSES BUCKET
-- =============================================

-- Public can view course images
CREATE POLICY "courses_select_public"
ON storage.objects FOR SELECT
USING (bucket_id = 'courses');

-- Influencers can upload course images
CREATE POLICY "courses_insert_influencer"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'courses'
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('influencer', 'admin')
  )
);

-- Influencers can update their course images
CREATE POLICY "courses_update_influencer"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'courses'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'courses'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Influencers can delete their course images
CREATE POLICY "courses_delete_influencer"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'courses'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- STORAGE POLICIES - PARTIES BUCKET
-- =============================================

-- Public can view party images
CREATE POLICY "parties_select_public"
ON storage.objects FOR SELECT
USING (bucket_id = 'parties');

-- Influencers can upload party images
CREATE POLICY "parties_insert_influencer"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'parties'
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('influencer', 'admin')
  )
);

-- Influencers can update their party images
CREATE POLICY "parties_update_influencer"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'parties'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'parties'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Influencers can delete their party images
CREATE POLICY "parties_delete_influencer"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'parties'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- STORAGE POLICIES - RECORDS BUCKET
-- =============================================

-- Public can view records
CREATE POLICY "records_select_public"
ON storage.objects FOR SELECT
USING (bucket_id = 'records');

-- Authenticated users can upload records
CREATE POLICY "records_insert_authenticated"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'records'
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND auth.role() = 'authenticated'
);

-- Users can update their own records
CREATE POLICY "records_update_own"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'records'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'records'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own records
CREATE POLICY "records_delete_own"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'records'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- STORAGE POLICIES - ATTACHMENTS BUCKET (PRIVATE)
-- =============================================

-- Users can view their own attachments
CREATE POLICY "attachments_select_own"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins can view all attachments
CREATE POLICY "attachments_select_admin"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'attachments'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Authenticated users can upload attachments
CREATE POLICY "attachments_insert_authenticated"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND auth.role() = 'authenticated'
);

-- Users can update their own attachments
CREATE POLICY "attachments_update_own"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own attachments
CREATE POLICY "attachments_delete_own"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Influencers can view attachments for their courses/parties
CREATE POLICY "attachments_select_influencer"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'attachments'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'influencer'
  )
  -- Additional logic can be added here to check if the attachment
  -- belongs to an application for the influencer's course/party
);

-- =============================================
-- ADDITIONAL STORAGE CONFIGURATION
-- =============================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_id
ON storage.objects (bucket_id);

CREATE INDEX IF NOT EXISTS idx_storage_objects_owner
ON storage.objects (owner);

CREATE INDEX IF NOT EXISTS idx_storage_objects_name
ON storage.objects (name);

-- =============================================
-- STORAGE HELPER FUNCTIONS
-- =============================================

-- Function to get public URL for a file
CREATE OR REPLACE FUNCTION get_public_url(bucket TEXT, file_path TEXT)
RETURNS TEXT AS $$
DECLARE
  supabase_url TEXT;
BEGIN
  -- Get the Supabase URL from the config
  supabase_url := current_setting('app.settings.supabase_url', true);

  IF supabase_url IS NULL THEN
    RETURN NULL;
  END IF;

  RETURN supabase_url || '/storage/v1/object/public/' || bucket || '/' || file_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate signed URL for private files
CREATE OR REPLACE FUNCTION generate_signed_url(bucket TEXT, file_path TEXT, expires_in INTEGER DEFAULT 3600)
RETURNS TEXT AS $$
BEGIN
  -- This is a placeholder - actual implementation requires storage API
  -- In practice, use Supabase client SDK to generate signed URLs
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- STORAGE CLEANUP POLICIES
-- =============================================

-- Create a function to clean up orphaned files
CREATE OR REPLACE FUNCTION cleanup_orphaned_storage_objects()
RETURNS void AS $$
BEGIN
  -- Delete avatar files for deleted users
  DELETE FROM storage.objects
  WHERE bucket_id = 'avatars'
  AND NOT EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id::text = (storage.foldername(storage.objects.name))[1]
  );

  -- Additional cleanup logic can be added here
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on helper functions
GRANT EXECUTE ON FUNCTION get_public_url(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_signed_url(TEXT, TEXT, INTEGER) TO authenticated;
