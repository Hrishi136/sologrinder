/*
  # Revert to simple relative paths and use proper fallback strategy
  
  Since empty PNG files are in the public folder, we revert to relative paths.
  The ShadowUnitAvatar component will show letter fallback when images fail to load.
  This ensures the app never breaks - it shows functional UI at all times.
*/

DO $$
BEGIN
  UPDATE shadow_army_images 
  SET image_url = 
    CASE 
      WHEN shadow_key = 'Iron Soldier' THEN '/shadows/Iron_soldier.png'
      WHEN shadow_key = 'Scout' THEN '/shadows/placeholder.png'
      WHEN shadow_key = 'Mage' THEN '/shadows/placeholder.png'
      WHEN shadow_key = 'Knight' THEN '/shadows/Knight.png'
      WHEN shadow_key = 'Assassin' THEN '/shadows/Assassin.png'
      WHEN shadow_key = 'Healer' THEN '/shadows/placeholder.png'
      WHEN shadow_key = 'Tank' THEN '/shadows/Tank.png'
      WHEN shadow_key = 'Archer' THEN '/shadows/Archer.png'
      WHEN shadow_key = 'Iron' THEN '/shadows/Iron.png'
      WHEN shadow_key = 'Igris' THEN '/shadows/Igris.png'
      WHEN shadow_key = 'Beru' THEN '/shadows/Beru.jpg'
      WHEN shadow_key = 'Bellion' THEN '/shadows/Bellion.jpg'
      ELSE '/shadows/placeholder.png'
    END;

  RAISE NOTICE 'Reverted shadow image URLs to relative paths with proper fallback';
END $$;
