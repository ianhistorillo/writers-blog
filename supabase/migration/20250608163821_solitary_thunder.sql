/*
  # Fix posts-user_profiles relationship

  1. Data Cleanup
    - Create missing user_profiles for existing posts
    - Remove orphaned posts that reference non-existent users

  2. Add Foreign Key Constraint
    - Add foreign key between posts.author_id and user_profiles.id
*/

-- First, create user_profiles for any users that have posts but no profile
INSERT INTO user_profiles (id, name, role)
SELECT DISTINCT 
  p.author_id,
  COALESCE(u.raw_user_meta_data->>'name', 'Anonymous Author') as name,
  COALESCE(u.raw_user_meta_data->>'role', 'author') as role
FROM posts p
JOIN auth.users u ON u.id = p.author_id
WHERE p.author_id NOT IN (SELECT id FROM user_profiles)
ON CONFLICT (id) DO NOTHING;

-- Remove any posts that reference users that don't exist in auth.users
DELETE FROM posts 
WHERE author_id NOT IN (SELECT id FROM auth.users);

-- Now add the foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'posts_author_id_user_profiles_fkey'
    AND table_name = 'posts'
  ) THEN
    ALTER TABLE posts 
    ADD CONSTRAINT posts_author_id_user_profiles_fkey 
    FOREIGN KEY (author_id) 
    REFERENCES user_profiles(id) 
    ON DELETE CASCADE;
  END IF;
END $$;