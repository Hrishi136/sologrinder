-- Drop existing policies
DROP POLICY IF EXISTS "Avatar options are viewable by everyone" ON avatar_options;

-- Create new policies
CREATE POLICY "Avatar options are viewable by everyone" 
ON avatar_options 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can update avatar options" 
ON avatar_options 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);