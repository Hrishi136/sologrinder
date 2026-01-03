import { useState, useEffect } from "react";
import { SHADOW_UNITS, ShadowUnit } from "@/constants/shadowArmy";

const STORAGE_KEY = "shadow_army_images";

/**
 * Shadow Army Hook - manages which shadows are unlocked and their permanent images.
 * Once an image is uploaded for a shadow, it becomes permanent and cannot be changed.
 */
export function useShadowArmy() {
  const [unlocked, setUnlocked] = useState<string[]>([]);
  
  // Permanent shadow images stored in localStorage
  const [shadowImages, setShadowImages] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Persist images to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shadowImages));
  }, [shadowImages]);

  // Upload image for a shadow - only works if no image exists (permanent)
  function uploadShadowImage(name: string, imageDataUrl: string) {
    // Once set, images are permanent - cannot be changed
    if (shadowImages[name]) {
      console.warn(`Image for ${name} is already set and locked.`);
      return false;
    }
    setShadowImages(prev => ({ ...prev, [name]: imageDataUrl }));
    return true;
  }

  // Check if a shadow has a permanent image
  function hasPermanentImage(name: string): boolean {
    return !!shadowImages[name];
  }

  // Get the permanent image for a shadow
  function getShadowImageUrl(name: string): string | null {
    return shadowImages[name] || null;
  }

  function unlockShadow(name: string) {
    if (!unlocked.includes(name)) setUnlocked(u => [...u, name]);
  }

  function isUnlocked(name: string) {
    return unlocked.includes(name);
  }

  const SHADOWS = SHADOW_UNITS;

  return { 
    unlocked, 
    unlockShadow, 
    isUnlocked, 
    SHADOWS,
    shadowImages,
    uploadShadowImage,
    hasPermanentImage,
    getShadowImageUrl
  };
}

export default useShadowArmy;
export type { ShadowUnit };
