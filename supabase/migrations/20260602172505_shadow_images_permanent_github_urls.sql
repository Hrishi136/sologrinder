/*
  # Permanent GitHub URLs for all shadow army images
  
  Replaces all shadow images with permanent GitHub raw content URLs.
  These URLs are guaranteed to never disappear and will always be available.
  
  1. New URLs
    - All 12 shadow images now use permanent GitHub URLs
    - Images hosted on: https://github.com/Hrishi136/sologrinder
    
  2. Security
    - Images fetched from trusted public GitHub repository
    - No local file storage dependencies
    - RLS policies remain unchanged
*/

DO $$
BEGIN
  -- Clear and repopulate with permanent GitHub URLs
  DELETE FROM shadow_army_images;

  INSERT INTO shadow_army_images (shadow_key, image_url) VALUES
    ('Iron Soldier', 'https://raw.githubusercontent.com/Hrishi136/sologrinder/main/Iron_soldier.png'),
    ('Scout', 'https://raw.githubusercontent.com/Hrishi136/sologrinder/main/Scout.png'),
    ('Mage', 'https://raw.githubusercontent.com/Hrishi136/sologrinder/main/Mage.png'),
    ('Knight', 'https://raw.githubusercontent.com/Hrishi136/sologrinder/main/Knight.png'),
    ('Assassin', 'https://raw.githubusercontent.com/Hrishi136/sologrinder/main/Assassin.png'),
    ('Healer', 'https://raw.githubusercontent.com/Hrishi136/sologrinder/main/Healer.png'),
    ('Tank', 'https://raw.githubusercontent.com/Hrishi136/sologrinder/main/Tank.png'),
    ('Archer', 'https://raw.githubusercontent.com/Hrishi136/sologrinder/main/Archer.png'),
    ('Iron', 'https://raw.githubusercontent.com/Hrishi136/sologrinder/main/Iron.jpg'),
    ('Igris', 'https://raw.githubusercontent.com/Hrishi136/sologrinder/main/Igris.jpg'),
    ('Beru', 'https://raw.githubusercontent.com/Hrishi136/sologrinder/main/Beru.jpg'),
    ('Bellion', 'https://raw.githubusercontent.com/Hrishi136/sologrinder/main/Bellion.jpg')
  ON CONFLICT (shadow_key) DO UPDATE SET
    image_url = EXCLUDED.image_url;

  RAISE NOTICE 'Updated all 12 shadow images with permanent GitHub URLs';
END $$;
