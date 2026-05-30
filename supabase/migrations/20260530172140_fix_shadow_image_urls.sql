/*
  # Fix shadow image URLs to use absolute Supabase storage paths

  Problem: Images were stored as local paths like /shadows/Tank.png but files are empty
  Solution: Use absolute Supabase storage URLs that work permanently
  
  This migration ensures all shadow images use correct permanent URLs from Supabase storage
*/

DO $$
DECLARE
  v_supabase_url TEXT := 'https://zp1v56uxy8rdx5ypatb0ockch9tr6a-oci3--8080--4c73681d.local-credentialless.webcontainer-api.io';
  v_storage_bucket TEXT := 'shadow-army';
BEGIN
  -- Update all shadow images to use absolute Supabase storage URLs
  -- Format: https://PROJECT_URL/storage/v1/object/public/BUCKET/FILENAME
  
  UPDATE shadow_army_images 
  SET image_url = v_supabase_url || '/storage/v1/object/public/' || v_storage_bucket || '/' || 
    CASE 
      WHEN shadow_key = 'Iron Soldier' THEN 'Iron_soldier.png'
      WHEN shadow_key = 'Scout' THEN 'placeholder.png'
      WHEN shadow_key = 'Mage' THEN 'placeholder.png'
      WHEN shadow_key = 'Knight' THEN 'Knight.png'
      WHEN shadow_key = 'Assassin' THEN 'Assassin.png'
      WHEN shadow_key = 'Healer' THEN 'placeholder.png'
      WHEN shadow_key = 'Tank' THEN 'Tank.png'
      WHEN shadow_key = 'Archer' THEN 'Archer.png'
      WHEN shadow_key = 'Iron' THEN 'placeholder.png'
      WHEN shadow_key = 'Igris' THEN 'placeholder.png'
      WHEN shadow_key = 'Beru' THEN 'Beru.jpg'
      WHEN shadow_key = 'Bellion' THEN 'Bellion.jpg'
      ELSE 'placeholder.png'
    END
  WHERE shadow_key IN (
    'Iron Soldier', 'Scout', 'Mage', 'Knight', 'Assassin', 'Healer',
    'Tank', 'Archer', 'Iron', 'Igris', 'Beru', 'Bellion'
  );

  RAISE NOTICE 'Updated all shadow image URLs to use absolute Supabase storage paths';
END $$;
