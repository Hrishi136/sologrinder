import { useState, useEffect } from "react";
import { SHADOW_UNITS, ShadowUnit } from "@/constants/shadowArmy";
import { supabase } from "@/integrations/supabase/client";

const LOCAL_STORAGE_KEY = "shadow_army_unlocked";
const SHADOW_IMAGES_KEY = "shadow_army_images";
const MIGRATION_KEY = "shadow_army_migrated_to_supabase";

/**
 * Shadow Army Hook - manages shadow units and their permanent images from Supabase.
 * Images are stored in Supabase storage and URLs are cached in the database.
 * Shadows start LOCKED and must be unlocked by meeting requirements.
 */
export function useShadowArmy() {
  // Load unlocked shadows from localStorage, default to EMPTY (all locked)
  const [unlocked, setUnlocked] = useState<string[]>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return []; // No shadows unlocked by default for new users
  });
  const [shadowImages, setShadowImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Fetch shadow images from Supabase on mount
  useEffect(() => {
    fetchShadowImages();
    migrateLocalStorageToSupabase();
  }, []);

  async function fetchShadowImages() {
    try {
      const { data, error } = await supabase
        .from("shadow_army_images")
        .select("shadow_key, image_url");

      if (error) {
        console.error("Error fetching shadow images:", error);
        return;
      }

      const images: Record<string, string> = {};
      data?.forEach(row => {
        // Index by both the exact shadow_key AND lowercase version for flexibility
        images[row.shadow_key] = row.image_url;
        images[row.shadow_key.toLowerCase()] = row.image_url;
      });
      setShadowImages(images);
    } catch (err) {
      console.error("Failed to fetch shadow images:", err);
    } finally {
      setLoading(false);
    }
  }

  // One-time migration from localStorage to Supabase storage
  async function migrateLocalStorageToSupabase() {
    // Always attempt migration if we have local data, even if marked migrated
    // This ensures data is properly backed up to Supabase
    const localData = localStorage.getItem(SHADOW_IMAGES_KEY);
    if (!localData) {
      localStorage.setItem(MIGRATION_KEY, "true");
      return;
    }

    try {
      const localImages: Record<string, string> = JSON.parse(localData);
      const entries = Object.entries(localImages);
      
      if (entries.length === 0) {
        localStorage.setItem(MIGRATION_KEY, "true");
        return;
      }

      console.log(`Migrating ${entries.length} shadow images to Supabase...`);

      for (const [name, dataUrl] of entries) {
        const imageKey = name.toLowerCase().replace(/\s+/g, "_");
        
        // Convert base64 to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        
        // Upload to Supabase storage
        const fileName = `${imageKey}.png`;
        const { error: uploadError } = await supabase.storage
          .from("shadow-army")
          .upload(fileName, blob, { 
            upsert: true,
            contentType: "image/png"
          });

        if (uploadError) {
          console.error(`Failed to upload ${name}:`, uploadError);
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("shadow-army")
          .getPublicUrl(fileName);

        // Store URL in database
        const { error: dbError } = await supabase
          .from("shadow_army_images")
          .upsert({ 
            shadow_key: name, 
            image_url: urlData.publicUrl 
          }, { 
            onConflict: "shadow_key" 
          });

        if (dbError) {
          console.error(`Failed to save URL for ${name}:`, dbError);
        }
      }

      localStorage.setItem(MIGRATION_KEY, "true");
      console.log("Migration complete!");
      
      // Refresh images from database
      fetchShadowImages();
    } catch (err) {
      console.error("Migration failed:", err);
    }
  }

  function isUnlocked(name: string) {
    return unlocked.includes(name);
  }

  function hasPermanentImage(name: string): boolean {
    return !!shadowImages[name];
  }

  function getShadowImageUrl(name: string): string | null {
    return shadowImages[name] || null;
  }

  const SHADOWS = SHADOW_UNITS;

  // Unlock a shadow and persist to localStorage
  function unlockShadow(name: string) {
    if (unlocked.includes(name)) return false;
    const newUnlocked = [...unlocked, name];
    setUnlocked(newUnlocked);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUnlocked));
    return true;
  }

  // Persist unlocked shadows whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(unlocked));
  }, [unlocked]);

  return {
    unlocked,
    isUnlocked,
    unlockShadow,
    SHADOWS,
    shadowImages,
    hasPermanentImage,
    getShadowImageUrl,
    loading
  };
}

export default useShadowArmy;
export type { ShadowUnit };
