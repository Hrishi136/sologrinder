import { useState } from "react";

/**
 * Shadow Army Hook - manages which shadows are unlocked and provides unlock logic.
 * Designed for future extension (e.g. UI panels).
 * For now, all logic is stubbed.
 */
const SHADOWS = [
  { name: "Iron Soldier", tier: 1 },
  { name: "Scout", tier: 1 },
  { name: "Mage", tier: 1 },
  { name: "Knight", tier: 2 },
  { name: "Assassin", tier: 2 },
  { name: "Healer", tier: 2 },
  { name: "Tank", tier: 3 },
  { name: "Archer", tier: 3 },
  { name: "Berserker", tier: 3 },
  { name: "Igris", tier: 4 },
  { name: "Beru", tier: 4 },
  { name: "Bellion", tier: 4 },
];

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

  // in the future: expose unlock progress, unlocked/total counts, help texts etc.
  return { unlocked, unlockShadow, isUnlocked, SHADOWS };
}

export default useShadowArmy;
