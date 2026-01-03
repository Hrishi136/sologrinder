import { useState } from "react";
import { SHADOW_UNITS, ShadowUnit } from "@/constants/shadowArmy";

/**
 * Shadow Army Hook - manages which shadows are unlocked and provides unlock logic.
 * Shadow images are permanent game assets and cannot be modified by users.
 */
export function useShadowArmy() {
  // Keep track of unlocked shadow names.
  const [unlocked, setUnlocked] = useState<string[]>([]);

  // Simple unlock - later, change logic to check requirements.
  function unlockShadow(name: string) {
    if (!unlocked.includes(name)) setUnlocked(u => [...u, name]);
  }

  function isUnlocked(name: string) {
    return unlocked.includes(name);
  }

  // Get all shadow units from constants (replaces local SHADOWS array)
  const SHADOWS = SHADOW_UNITS;

  return { unlocked, unlockShadow, isUnlocked, SHADOWS };
}

export default useShadowArmy;
export type { ShadowUnit };
