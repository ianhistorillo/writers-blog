/*
  # Add User Profiles and Media Storage

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `avatar_url` (text)
      - `role` (text, default 'author')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `media_files`
      - `id` (uuid, primary key)
      - `filename` (text)
      - `original_name` (text)
      - `file_path` (text)
      - `file_size` (bigint)
      - `mime_type` (text)
      - `uploaded_by` (uuid, references auth.users)
      - `created_at` (timestamp)

  2. Storage
    - Create storage bucket for media files
    - Set up RLS policies for media access

  3. Security
    - Enable RLS on new tables
    - Add policies for user access
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  avatar_url text,
  role text NOT NULL DEFAULT 'author',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create media_files table
CREATE TABLE IF NOT EXISTS media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  uploaded_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view all profiles"
  ON user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Media files policies
CREATE POLICY "Users can view all media files"
  ON media_files FOR SELECT
  USING (true);

CREATE POLICY "Users can upload media files"
  ON media_files FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete own media files"
  ON media_files FOR DELETE
  USING (auth.uid() = uploaded_by);

-- Create storage bucket for media
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload media files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Media files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Users can delete own media files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Anonymous'),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'author')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add updated_at trigger to user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();