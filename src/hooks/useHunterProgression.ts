
import { useState } from "react";

// Demo/sample rank data
type Rank = {
  name: string;
  multiplier: number;
  color: string;
  badgeIcon: string;
};

const RANKS: Rank[] = [
  { name: "E-Rank", multiplier: 1, color: "#87b7ff", badgeIcon: "badge" },
  { name: "D-Rank", multiplier: 2, color: "#4aa3ea", badgeIcon: "badge-check" },
  { name: "C-Rank", multiplier: 3, color: "#329fa8", badgeIcon: "star-half" },
  { name: "B-Rank", multiplier: 4, color: "#9cdc96", badgeIcon: "star" },
  { name: "A-Rank", multiplier: 6, color: "#e0c453", badgeIcon: "trophy" },
  { name: "S-Rank", multiplier: 8, color: "#ed3434", badgeIcon: "award" }
];

const RANK_THRESHOLDS = [0, 100, 250, 500, 900, 1600, 2600]; // Points required for each rank. [0] is ignored.

const START_STATS = [
  { label: "Strength", val: 23 },
  { label: "Agility", val: 17 },
  { label: "Intelligence", val: 21 },
  { label: "Vitality", val: 18 },
];

export function useHunterProgression() {
  const [stats, setStats] = useState([...START_STATS]);
  const [currentRankIndex, setCurrentRankIndex] = useState(0);
  const [rankPoints, setRankPoints] = useState(46); // Demo starting value
  const [daysAtRank, setDaysAtRank] = useState(12);
  const [badges, setBadges] = useState<string[]>([]);
  const [showCeremony, setShowCeremony] = useState(false);
  const [lastBadge, setLastBadge] = useState<string | null>(null);

  const currentRank = RANKS[currentRankIndex];
  const nextRank = RANKS[currentRankIndex + 1] || null;
  const nextThreshold = RANK_THRESHOLDS[currentRankIndex + 1] ?? null;

  // Calculate total power level
  const powerLevel = stats.reduce((acc, stat) => acc + stat.val, 0) * currentRank.multiplier;

  // Simulate quest completion that gives points (for demo button etc)
  const completeQuest = (points: number) => {
    let newPoints = rankPoints + points;
    let newIndex = currentRankIndex;
    let badgeEarned: string | null = null;
    let didRankUp = false;
    // Level up if enough points, but careful of over-leveling
    while (nextThreshold && newPoints >= nextThreshold && newIndex < RANKS.length - 1) {
      newPoints = newPoints - nextThreshold;
      newIndex++;
      badgeEarned = RANKS[newIndex].badgeIcon;
      didRankUp = true;
    }
    setRankPoints(newPoints);
    if (didRankUp) {
      setCurrentRankIndex(newIndex);
      setDaysAtRank(0);
      if (badgeEarned) {
        setBadges(b => [...b, badgeEarned]);
        setLastBadge(badgeEarned);
        setShowCeremony(true);
      }
      // Optional: boost base stats
      setStats(s =>
        s.map((stat) => ({
          ...stat,
          val: stat.val + Math.max(1, Math.floor(stat.val * 0.10)) // Increase each stat by 10% (rounded down, min 1)
        }))
      );
    }
  };

  // Call when user finishes rank-up ceremony
  const finishCeremony = () => setShowCeremony(false);

  return {
    stats,
    currentRank,
    nextRank,
    powerLevel,
    rankPoints,
    nextThreshold,
    daysAtRank,
    badges,
    showCeremony,
    completeQuest,
    finishCeremony,
    lastBadge,
    currentRankIndex
  };
}

