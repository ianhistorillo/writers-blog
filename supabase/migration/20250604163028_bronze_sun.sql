/*
  # Initial Schema Setup

  1. New Tables
    - users (handled by Supabase Auth)
    - posts
      - id (uuid, primary key)
      - title (text)
      - slug (text, unique)
      - content (text)
      - excerpt (text)
      - cover_image (text)
      - author_id (uuid, references auth.users)
      - created_at (timestamp)
      - updated_at (timestamp)
      - published_at (timestamp)
      - status (text)
      - featured (boolean)
    - categories
      - id (uuid, primary key)
      - name (text)
      - slug (text, unique)
    - tags
      - id (uuid, primary key)
      - name (text)
      - slug (text, unique)
    - post_categories
      - post_id (uuid, references posts)
      - category_id (uuid, references categories)
    - post_tags
      - post_id (uuid, references posts)
      - tag_id (uuid, references tags)
    - comments
      - id (uuid, primary key)
      - post_id (uuid, references posts)
      - user_id (uuid, references auth.users)
      - content (text)
      - created_at (timestamp)
      - approved (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  cover_image text,
  author_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  status text NOT NULL DEFAULT 'draft',
  featured boolean DEFAULT false,
  CONSTRAINT status_check CHECK (status IN ('draft', 'published'))
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL
);

-- Create post_categories junction table
CREATE TABLE IF NOT EXISTS post_categories (
  post_id uuid REFERENCES posts ON DELETE CASCADE,
  category_id uuid REFERENCES categories ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Create post_tags junction table
CREATE TABLE IF NOT EXISTS post_tags (
  post_id uuid REFERENCES posts ON DELETE CASCADE,
  tag_id uuid REFERENCES tags ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  approved boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Anyone can read published posts"
  ON posts FOR SELECT
  USING (status = 'published' OR auth.uid() = author_id);

CREATE POLICY "Authors can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own posts"
  ON posts FOR DELETE
  USING (auth.uid() = author_id);

-- Categories policies
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can create categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Tags policies
CREATE POLICY "Anyone can read tags"
  ON tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can create tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Post categories policies
CREATE POLICY "Anyone can read post categories"
  ON post_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authors can manage post categories"
  ON post_categories FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM posts WHERE id = post_id AND author_id = auth.uid()
  ));

-- Post tags policies
CREATE POLICY "Anyone can read post tags"
  ON post_tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authors can manage post tags"
  ON post_tags FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM posts WHERE id = post_id AND author_id = auth.uid()
  ));

-- Comments policies
CREATE POLICY "Anyone can read approved comments"
  ON comments FOR SELECT
  USING (approved = true OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to posts
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();