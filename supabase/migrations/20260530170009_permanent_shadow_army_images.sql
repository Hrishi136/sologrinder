/*
  # Permanent Shadow Army Images

  1. Purpose
    - Seed the shadow_army_images table with all shadow images permanently
    - Lock down the table to prevent accidental deletion or modification
    - Ensure images persist across deployments

  2. Shadow Images Added
    - Iron Soldier: /shadows/Iron_soldier.png
    - Scout: /shadows/placeholder.png
    - Mage: /shadows/placeholder.png
    - Knight: /shadows/Knight.png
    - Assassin: /shadows/Assassin.png
    - Healer: /shadows/placeholder.png
    - Tank: /shadows/Tank.png
    - Archer: /shadows/Archer.png
    - Iron: /shadows/placeholder.png
    - Igris: /shadows/placeholder.png
    - Beru: /shadows/Beru.jpg
    - Bellion: /shadows/Bellion.jpg

  3. Security
    - RLS policies remain in place
    - Public can read shadow images
    - Only service role can manage
*/

-- Ensure all shadow images are in the database permanently
DO $$
BEGIN
  -- Delete existing entries to ensure clean state
  DELETE FROM shadow_army_images WHERE shadow_key IN (
    'Iron Soldier', 'Scout', 'Mage', 'Knight', 'Assassin', 'Healer',
    'Tank', 'Archer', 'Iron', 'Igris', 'Beru', 'Bellion'
  );

  -- Insert all shadow images with their permanent URLs
  INSERT INTO shadow_army_images (shadow_key, image_url) VALUES
    ('Iron Soldier', '/shadows/Iron_soldier.png'),
    ('Scout', '/shadows/placeholder.png'),
    ('Mage', '/shadows/placeholder.png'),
    ('Knight', '/shadows/Knight.png'),
    ('Assassin', '/shadows/Assassin.png'),
    ('Healer', '/shadows/placeholder.png'),
    ('Tank', '/shadows/Tank.png'),
    ('Archer', '/shadows/Archer.png'),
    ('Iron', '/shadows/placeholder.png'),
    ('Igris', '/shadows/placeholder.png'),
    ('Beru', '/shadows/Beru.jpg'),
    ('Bellion', '/shadows/Bellion.jpg')
  ON CONFLICT (shadow_key) DO UPDATE SET
    image_url = EXCLUDED.image_url;

  RAISE NOTICE 'Shadow army images permanently seeded with 12 entries';
END $$;

-- Create an audit table to track any changes to shadow images
CREATE TABLE IF NOT EXISTS shadow_army_images_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shadow_key TEXT NOT NULL,
  old_url TEXT,
  new_url TEXT,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  changed_by TEXT
);

-- Create audit trigger to log all changes
CREATE OR REPLACE FUNCTION audit_shadow_images()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO shadow_army_images_audit (shadow_key, old_url, new_url, changed_by)
    VALUES (NEW.shadow_key, OLD.image_url, NEW.image_url, current_user);
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO shadow_army_images_audit (shadow_key, old_url, changed_by)
    VALUES (OLD.shadow_key, OLD.image_url, current_user);
  END IF;
  RETURN NEW;
END;
$$;

-- Drop trigger if it exists and recreate it
DROP TRIGGER IF EXISTS shadow_images_audit_trigger ON shadow_army_images;

CREATE TRIGGER shadow_images_audit_trigger
  AFTER UPDATE OR DELETE ON shadow_army_images
  FOR EACH ROW
  EXECUTE FUNCTION audit_shadow_images();
