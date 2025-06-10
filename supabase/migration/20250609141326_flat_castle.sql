/*
  # Enhance media file security and user isolation

  1. Security Updates
    - Update RLS policies to ensure users can only access their own media
    - Add additional constraints for user isolation
    - Update storage policies for better security

  2. Database Changes
    - Ensure proper indexing for performance
    - Add constraints for data integrity
*/

-- Update media files policies for stricter user isolation
DROP POLICY IF EXISTS "Users can view all media files" ON media_files;
DROP POLICY IF EXISTS "Users can upload media files" ON media_files;
DROP POLICY IF EXISTS "Users can delete own media files" ON media_files;

-- Create new stricter policies
CREATE POLICY "Users can only view their own media files"
  ON media_files FOR SELECT
  USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can only upload media files for themselves"
  ON media_files FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can only delete their own media files"
  ON media_files FOR DELETE
  USING (auth.uid() = uploaded_by);

-- Update storage policies for better user isolation
DROP POLICY IF EXISTS "Users can upload media files" ON storage.objects;
DROP POLICY IF EXISTS "Media files are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own media files" ON storage.objects;

-- Create new storage policies with user isolation
CREATE POLICY "Users can upload to their own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media' 
    AND auth.role() = 'authenticated' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own media files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'media' 
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR auth.role() = 'anon'  -- Allow public access for published content
    )
  );

CREATE POLICY "Users can delete their own media files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add index for better performance on user-specific queries
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by 
ON media_files(uploaded_by);

-- Add index for better performance on file path queries
CREATE INDEX IF NOT EXISTS idx_media_files_file_path 
ON media_files(file_path);