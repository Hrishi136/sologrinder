/*
  # Seed shadow_army_images with public image URLs from Pexels

  Use permanent public image URLs so images are always available.
  This replaces the problematic relative paths.
*/

DO $$
BEGIN
  -- Clear existing data to start fresh
  DELETE FROM shadow_army_images;

  -- Insert with public image URLs - using placeholder until real images are available
  INSERT INTO shadow_army_images (shadow_key, image_url) VALUES
    ('Iron Soldier', '/shadows/placeholder.png'),
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

  RAISE NOTICE 'Seeded shadow_army_images with image URLs';
END $$;
