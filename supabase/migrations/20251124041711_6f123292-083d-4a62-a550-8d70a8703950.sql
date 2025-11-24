-- Drop the update policy to prevent any changes to uploaded avatars
DROP POLICY IF EXISTS "Authenticated users can update avatar options" ON avatar_options;