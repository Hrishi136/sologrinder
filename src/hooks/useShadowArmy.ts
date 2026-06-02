import { useState, useEffect } from "react";
import { SHADOW_UNITS, ShadowUnit } from "@/constants/shadowArmy";
import { supabase } from "@/integrations/supabase/client";

const LOCAL_STORAGE_KEY = "shadow_army_unlocked";

/**
 * Shadow Army Hook - manages shadow units and their permanent images from GitHub.
 * Images are permanently hosted on GitHub and fetched via database URL references.
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

  // Fetch shadow images from Supabase database (which stores GitHub URLs)
  useEffect(() => {
    fetchShadowImages();
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
