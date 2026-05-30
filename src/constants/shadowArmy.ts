/**
 * Shadow Army Constants
 * Each shadow unit maps to a predefined image key.
 * Images are permanent game assets and cannot be modified by users.
 */

export interface ShadowUnit {
  name: string;
  tier: number;
  imageKey: string;
}

// Predefined shadow units with permanent image keys
export const SHADOW_UNITS: ShadowUnit[] = [
  // Tier 1 - Basic Shadows
  { name: "Iron Soldier", tier: 1, imageKey: "iron_soldier" },
  { name: "Scout", tier: 1, imageKey: "scout" },
  { name: "Mage", tier: 1, imageKey: "mage" },
  
  // Tier 2 - Elite Shadows
  { name: "Knight", tier: 2, imageKey: "knight" },
  { name: "Assassin", tier: 2, imageKey: "assassin" },
  { name: "Healer", tier: 2, imageKey: "healer" },
  
  // Tier 3 - Marshal Shadows
  { name: "Tank", tier: 3, imageKey: "tank" },
  { name: "Archer", tier: 3, imageKey: "archer" },
  { name: "Berserker", tier: 3, imageKey: "berserker" },
  
  // Tier 4 - Legendary Shadows
  { name: "Igris", tier: 4, imageKey: "igris" },
  { name: "Beru", tier: 4, imageKey: "beru" },
  { name: "Bellion", tier: 4, imageKey: "bellion" },
];

// Static image paths for each shadow unit
// These are permanent assets that cannot be changed by users
export const SHADOW_IMAGES: Record<string, string> = {
  iron_soldier: "/shadows/iron_soldier.png",
  scout: "/shadows/scout.png",
  mage: "/shadows/mage.png",
  knight: "/shadows/knight.png",
  assassin: "/shadows/assassin.png",
  healer: "/shadows/healer.png",
  tank: "/shadows/tank.png",
  archer: "/shadows/archer.png",
  berserker: "/shadows/berserker.png",
  igris: "/shadows/igris.png",
  beru: "/shadows/beru.png",
  bellion: "/shadows/bellion.png",
};

// Helper function to get image path for a shadow unit
export function getShadowImage(imageKey: string): string {
  return SHADOW_IMAGES[imageKey] || "/shadows/placeholder.png";
}

// Helper function to get shadow unit by name
export function getShadowByName(name: string): ShadowUnit | undefined {
  return SHADOW_UNITS.find(s => s.name === name);
}
